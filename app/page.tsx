'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiShield, FiPercent, FiActivity, FiGrid } from 'react-icons/fi';
import gsap from 'gsap';
import * as THREE from 'three';

const features = [
  {
    icon: FiPercent,
    title: 'Quadratic Voting Engine',
    description: 'Ensure democratic outcomes. The voting cost scales quadratically (cost = votes²), protecting consensus against whale dominance.',
  },
  {
    icon: FiShield,
    title: 'Timelocked Treasury Executor',
    description: 'Successful grant proposals trigger auto-payouts protected by an on-chain timelock to ensure safety and prevent exploits.',
  },
  {
    icon: FiActivity,
    title: 'Milestone Tracking & State Machine',
    description: 'Proposal lifecycle states (Active ➔ Passed ➔ Executed/Failed) are fully verified on-chain via Soroban smart contracts.',
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      // Intro animations
      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 }
      );

      gsap.fromTo(
        '.hero-desc',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      gsap.fromTo(
        '.hero-btns',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.7 }
      );

      gsap.fromTo(
        '.feat-title-section',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.9 }
      );

      gsap.fromTo(
        '.feat-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out', stagger: 0.15, delay: 1.1 }
      );

      gsap.fromTo(
        '.infra-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 1.4 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  // Three.js 3D Consensus Sphere Scene
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 25;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);

    // Particle Group
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    // Geometry of particles
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    // Distribute particles in a sphere volume
    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 5.5 + Math.random() * 1.5; // Radius size of sphere

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.18,
      color: 0x8b5cf6, // Purple
      transparent: true,
      opacity: 0.8,
    });

    // Points object
    const points = new THREE.Points(geometry, material);
    particleGroup.add(points);

    // Draw connection lines between nearby particles to make it a network lattice
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1, // Indigo
      transparent: true,
      opacity: 0.15,
      linewidth: 1,
    });

    const linePositions = [];
    // Add connection lines based on close proximity
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const idxA = i * 3;
        const idxB = j * 3;
        const dist = Math.hypot(
          positions[idxA] - positions[idxB],
          positions[idxA + 1] - positions[idxB + 1],
          positions[idxA + 2] - positions[idxB + 2]
        );
        // If they are close, draw a line segment connecting them
        if (dist < 3.5) {
          linePositions.push(positions[idxA], positions[idxA + 1], positions[idxA + 2]);
          linePositions.push(positions[idxB], positions[idxB + 1], positions[idxB + 2]);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    particleGroup.add(lines);

    // Interaction state
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.005;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.005;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.parentElement?.clientWidth || width;
      const h = canvas.parentElement?.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slow rotation of particles
      particleGroup.rotation.y = elapsedTime * 0.08;
      particleGroup.rotation.x = elapsedTime * 0.04;

      // Mouse interactive parallax lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      
      camera.position.x = targetX * 12;
      camera.position.y = -targetY * 12;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      lineGeometry.dispose();
      material.dispose();
      lineMaterial.dispose();
    };
  }, [mounted]);

  return (
    <div ref={containerRef} className="bg-[#fcf8fa] dark:bg-surface-900 overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center border-b border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-900 py-12 md:py-0">
        {/* Background decorative gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-lighten" />
          <div className="absolute top-20 right-0 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-900/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-lighten" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Title & Subtitle */}
            <div className="lg:col-span-7 text-left space-y-6">
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans opacity-0">
                Democratic Governance powered by{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400">
                  Quadratic Voting
                </span>
              </h1>

              <p className="hero-desc text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium opacity-0">
                Empower DAO members to propose, vote quadratically on funding allocations, and execute decentralized treasury grants trustlessly.
              </p>

              <div className="hero-btns flex flex-wrap gap-4 pt-4 opacity-0">
                <Link href="/dashboard" className="btn-primary h-12 px-6 flex items-center justify-center gap-2 uppercase tracking-wider text-xs font-semibold shadow-xl shadow-black/10 dark:shadow-white/5 hover:-translate-y-0.5 transition-transform">
                  Enter voting portal <FiArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/transfer" className="btn-secondary h-12 px-6 flex items-center justify-center gap-2 uppercase tracking-wider text-xs font-semibold hover:-translate-y-0.5 transition-transform bg-white/80 dark:bg-surface-800/80 backdrop-blur-md">
                  Direct XLM Transfer
                </Link>
              </div>
            </div>

            {/* Right Column: 3D interactive consensus sphere container */}
            <div className="lg:col-span-5 h-[350px] sm:h-[450px] relative w-full flex items-center justify-center">
              {mounted ? (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-rose-500/5 rounded-2xl border border-slate-200/50 dark:border-surface-700/50 backdrop-blur-sm -z-10 shadow-inner" />
                  <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                </div>
              ) : (
                <div className="h-20 w-20 border-2 border-t-purple-600 rounded-full animate-spin" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="feat-title-section text-center space-y-2 mb-12 opacity-0">
          <h2 className="text-2xl font-bold text-black dark:text-white sm:text-3xl font-sans">
            GovVault Core Protocol Pillars
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            State of the art DAO governance and treasury execution utilizing Soroban.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="feat-card card rounded border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-6 transition-all hover:border-black flex flex-col justify-between h-56 opacity-0 shadow-sm">
              <div>
                <feature.icon className="mb-4 h-6 w-6 text-black dark:text-white animate-pulse" />
                <h3 className="text-base font-bold text-black dark:text-white font-sans mb-2">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Task Checklist Tracker */}
      <section className="border-t border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-850/50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="infra-card rounded border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-8 shadow-sm opacity-0">
            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 font-sans">
                <FiGrid className="h-5 w-5 text-slate-400" />
                Core Governance Infrastructure Setup
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-wallet connections, quadratic on-chain voting metrics, and secure execution flows.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              <div className="rounded border border-slate-200 dark:border-surface-700 p-4 bg-slate-50 dark:bg-surface-800">
                <div className="text-sm font-bold text-black dark:text-white">Wallet Integration</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 font-semibold">Freighter, xBull, and Albedo</div>
              </div>
              <div className="rounded border border-slate-200 dark:border-surface-700 p-4 bg-slate-50 dark:bg-surface-800">
                <div className="text-sm font-bold text-black dark:text-white">Voting Logic</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 font-semibold">On-chain Quadratic Cost Engine</div>
              </div>
              <div className="rounded border border-slate-200 dark:border-surface-700 p-4 bg-slate-50 dark:bg-surface-800">
                <div className="text-sm font-bold text-black dark:text-white">Treasury Control</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 font-semibold">Timelocked Release Mechanism</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
