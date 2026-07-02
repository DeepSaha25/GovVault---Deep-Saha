'use client';

import { useEffect, useState, useCallback } from 'react';
import { FiClock } from 'react-icons/fi';

interface ProposalCountdownProps {
  targetTime: number; // Unix timestamp in seconds
  onEnd?: () => void;
  prefix?: string;
  isExecuted?: boolean;
}

export function ProposalCountdown({ targetTime, onEnd, prefix = 'Remaining:', isExecuted = false }: ProposalCountdownProps) {
  const calculateTimeLeft = useCallback(() => {
    const difference = targetTime * 1000 - Date.now();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      };
    }

    return timeLeft;
  }, [targetTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Initial check
    const currentLeft = calculateTimeLeft();
    setTimeLeft(currentLeft);
    if (currentLeft.isExpired && onEnd) {
      onEnd();
    }

    const timer = setInterval(() => {
      const nextLeft = calculateTimeLeft();
      setTimeLeft(nextLeft);

      if (nextLeft.isExpired) {
        clearInterval(timer);
        if (onEnd) {
          onEnd();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, onEnd]);

  if (isExecuted) {
    return (
      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
        <FiClock className="h-3.5 w-3.5" />
        <span>Completed</span>
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div className="flex items-center gap-1 text-[10px] font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider font-bold">
        <FiClock className="h-3.5 w-3.5 animate-pulse" />
        <span>Ended</span>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;
  const formattedTime = [
    days > 0 ? `${days}d` : null,
    hours > 0 || days > 0 ? `${String(hours).padStart(2, '0')}h` : null,
    `${String(minutes).padStart(2, '0')}m`,
    `${String(seconds).padStart(2, '0')}s`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-700 dark:text-amber-400 uppercase tracking-wider font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/30">
      <FiClock className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
      <span>{prefix} {formattedTime}</span>
    </div>
  );
}
