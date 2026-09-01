'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, Zap, ArrowRight, ShieldAlert } from 'lucide-react';

export function UrgencyCountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 48,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 }; // Reset loop for continuous urgency
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <aside aria-label="Limited Time Offer" className="bg-gradient-to-r from-red-600 via-amber-600 to-red-700 text-white text-xs font-bold py-2.5 px-4 shadow-xl border-b border-red-500/50 sticky top-0 z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1 bg-black/40 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-amber-300 border border-amber-400/40 animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 60% OFF ENDS TODAY
          </span>
          <span className="font-extrabold text-white text-xs sm:text-sm tracking-tight">
            FINAL CALL: Founding Member Pricing ($597.50 → $239 / $297.50 → $119)
          </span>
          <span className="text-[11px] bg-red-950/60 px-2 py-0.5 rounded text-red-200 hidden md:inline">
            🚨 Only 3 Territory Licenses Left
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Countdown Timer */}
          <div className="flex items-center gap-1 font-mono text-xs bg-black/60 px-3 py-1 rounded-xl border border-red-400/30 text-amber-300 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400 mr-1" />
            <span className="font-black text-white">{formatNumber(timeLeft.hours)}</span>h :
            <span className="font-black text-white">{formatNumber(timeLeft.minutes)}</span>m :
            <span className="font-black text-amber-400 animate-pulse">{formatNumber(timeLeft.seconds)}</span>s
          </div>

          <Link
            href="/pricing"
            className="py-1 px-3 rounded-xl bg-white hover:bg-amber-100 text-slate-950 font-black text-xs flex items-center gap-1 transition shadow-md active:scale-95 shrink-0"
          >
            Claim 60% OFF <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
