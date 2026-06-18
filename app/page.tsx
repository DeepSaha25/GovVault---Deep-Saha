import Link from 'next/link';
import { FiArrowRight, FiShield, FiPercent, FiTrendingUp, FiActivity, FiGrid } from 'react-icons/fi';

const features = [
  {
    icon: FiPercent,
    title: 'Quadratic Voting Engine',
    description: 'Ensure democratic outcomes. The voting cost scales quadratically (cost = votes²), checking whale dominance.',
  },
  {
    icon: FiShield,
    title: 'Timelocked Treasury Executor',
    description: 'Successful grant proposals trigger auto-payouts protected by a timelock to ensure safety and prevent exploits.',
  },
  {
    icon: FiActivity,
    title: 'Milestone Tracking & State Machine',
    description: 'Proposal lifecycle states (Active ➔ Passed ➔ Executed/Expired) are fully verified on-chain via smart contracts.',
  },
];

export default function LandingPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-900 bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-sm text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Level 1 & 2 — GovVault Protocol Active
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Democratic Governance with{' '}
              <span className="gradient-text">Quadratic Voting</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-400 sm:text-xl">
              Empower DAO members to propose, vote quadratically on funding allocations, and execute decentralized treasury grants trustlessly.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/dashboard" className="btn-primary h-12 px-6">
                Enter voting portal <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/transfer" className="rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:text-white px-6 h-12 inline-flex items-center gap-2 text-sm font-medium transition-colors">
                Level 1 XLM Transfer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
          GovVault Core Protocol Pillars
        </h2>
        <p className="mt-3 text-center text-zinc-400">
          State of the art DAO governance and treasury execution utilizing Soroban.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card">
              <feature.icon className="mb-3 h-6 w-6 text-zinc-350" />
              <h3 className="text-base font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-450">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Task Checklist Tracker */}
      <section className="border-t border-zinc-900 bg-zinc-900/10">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FiGrid className="h-5 w-5 text-zinc-400" />
              DAO White & Yellow Belt Complete Setup
            </h3>
            <p className="mt-2 text-sm text-zinc-450">
              Integrate multiple wallets, deploy quadratic governor contracts, and synchronize real-time voting streams.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 text-center">
              <div className="rounded-lg border border-zinc-850 p-4 bg-zinc-900/20">
                <div className="text-2xl font-bold text-white">L1</div>
                <div className="text-xs text-zinc-500 mt-1 font-medium">Freighter & XLM Transfer</div>
              </div>
              <div className="rounded-lg border border-zinc-850 p-4 bg-zinc-900/20">
                <div className="text-2xl font-bold text-white">L2</div>
                <div className="text-xs text-zinc-500 mt-1 font-medium">Soroban Governor Contracts</div>
              </div>
              <div className="rounded-lg border border-zinc-850 p-4 bg-zinc-900/20">
                <div className="text-2xl font-bold text-white">L3</div>
                <div className="text-xs text-zinc-500 mt-1 font-medium">Quadratic Vote Calculator</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
