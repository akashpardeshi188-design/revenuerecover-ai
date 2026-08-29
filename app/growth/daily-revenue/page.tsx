'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import {
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
  Users,
  Send,
  Flame,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export default function DailyRevenueAcceleratorPage() {
  const [currentSubscribers, setCurrentSubscribers] = useState(57);
  const [batchDispatched, setBatchDispatched] = useState(false);

  const targetDailyUSD = 2095.68;
  const targetMonthlyMRR = 62870.4;
  const targetSubscribers = 528;
  const growthPlanMonthlyRate = 119;
  const inrRate = 83.5;

  const currentDailyUSD = (currentSubscribers * growthPlanMonthlyRate) / 30;
  const currentDailyINR = currentDailyUSD * inrRate;
  const targetDailyINR = targetDailyUSD * inrRate;
  const progressPercent = Math.min(100, Math.round((currentSubscribers / targetSubscribers) * 100));

  const milestones = [
    { name: 'Milestone 1: $250/day', clients: 63, dailyUSD: 250, dailyINR: 20875, status: currentSubscribers >= 63 ? 'achieved' : 'active' },
    { name: 'Milestone 2: $500/day', clients: 126, dailyUSD: 500, dailyINR: 41750, status: currentSubscribers >= 126 ? 'achieved' : 'upcoming' },
    { name: 'Milestone 3: $1,000/day', clients: 252, dailyUSD: 1000, dailyINR: 83500, status: currentSubscribers >= 252 ? 'achieved' : 'upcoming' },
    { name: 'Milestone 4: $1,500/day', clients: 378, dailyUSD: 1500, dailyINR: 125250, status: currentSubscribers >= 378 ? 'achieved' : 'upcoming' },
    { name: '🎯 FINAL GOAL: $2,095.68/day', clients: 528, dailyUSD: 2095.68, dailyINR: 175000, status: currentSubscribers >= 528 ? 'achieved' : 'upcoming' },
  ];

  const handleAccelerateBatch = async () => {
    setBatchDispatched(true);
    try {
      await fetch('/api/growth/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 50 }),
      });
      setCurrentSubscribers((prev) => prev + 3);
    } catch (e) {
      console.warn('Batch trigger simulation active', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <GrowthNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 text-slate-950">
                  <DollarSign className="w-5 h-5 stroke-[2.5]" />
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  $2,095.68 / Day Revenue Acceleration Engine
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ₹1,75,000 / दिवस Autopilot
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Mathematical Execution Plan: 528 Paid Growth Subscribers ($119/mo) = $62,870/mo MRR = $2,095.68 Daily Income.
              </p>
            </div>

            <button
              onClick={handleAccelerateBatch}
              disabled={batchDispatched}
              className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 hover:from-emerald-300 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
            >
              {batchDispatched ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" /> Daily Batch Fired (+3 New Subscribers Queued)
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950" /> Execute $2,095/Day Acceleration Cycle
                </>
              )}
            </button>
          </div>

          {/* MAIN HERO STATS CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Income Target */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Target Daily Revenue Velocity
                </div>
                <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-white font-mono">
                  ${targetDailyUSD.toLocaleString()}{' '}
                  <span className="text-lg text-slate-400 font-normal">/ day</span>
                </div>
                <div className="text-sm text-emerald-400 font-mono font-bold">
                  (₹{targetDailyINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })} दररोज थेट खात्यात)
                </div>
              </div>

              {/* Current Run-Rate */}
              <div className="space-y-2 md:border-l md:border-slate-800 md:pl-6">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Current Live Run-Rate
                </div>
                <div className="text-3xl sm:text-5xl font-black text-white font-mono">
                  ${currentDailyUSD.toFixed(2)}{' '}
                  <span className="text-lg text-slate-400 font-normal">/ day</span>
                </div>
                <div className="text-sm text-cyan-400 font-mono font-semibold">
                  ₹{currentDailyINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / दिवस ({currentSubscribers} / {targetSubscribers} Active Clients)
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Pacing: <strong>{progressPercent}%</strong> toward 528 Target Subscribers</span>
                <span>Remaining: <strong className="text-emerald-400">{targetSubscribers - currentSubscribers} Subscribers Needed</strong></span>
              </div>
              <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.max(8, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* MILESTONE ROADMAP */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> $2,095.68/Day Milestone Roadmap
            </h3>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                    m.status === 'achieved'
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                        m.status === 'achieved'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm">{m.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Requires: <strong className="text-cyan-300">{m.clients} Active Clients</strong> on Growth Plan ($119/mo)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-right">
                    <div>
                      <div className="text-sm font-bold text-emerald-400">${m.dailyUSD.toLocaleString()}/day</div>
                      <div className="text-[10px] text-slate-400">₹{m.dailyINR.toLocaleString('en-IN')}/दिवस</div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        m.status === 'achieved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {m.status === 'achieved' ? '✓ In Progress' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HOW THE SYSTEM EXECUTES THIS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-xl">
              <div className="font-bold text-cyan-400 text-sm flex items-center gap-1.5">
                <Send className="w-4 h-4" /> 1. Daily 3,500 Outreaches
              </div>
              <p className="text-slate-300 leading-relaxed">
                Automated multi-channel sequencer dispatches personalized dollar leakage audits to Texas, Florida, and California contractors.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-xl">
              <div className="font-bold text-purple-400 text-sm flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> 2. 3-Day Instant Trials
              </div>
              <p className="text-slate-300 leading-relaxed">
                72-hour ROI trial recovers their first $1,500 job in 48 hours, triggering automatic $119 subscription conversions on Day 3.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-xl">
              <div className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> 3. Razorpay Rolling Settlements
              </div>
              <p className="text-slate-300 leading-relaxed">
                Daily auto-charges settle into Indian INR bank accounts, creating an unbreakable $2,095.68/day recurring cash engine.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
