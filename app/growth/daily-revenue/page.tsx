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
  Globe2,
} from 'lucide-react';

export default function DailyRevenueAcceleratorPage() {
  const [scaleMode, setScaleMode] = useState<'usa_baseline' | 'global_238k'>('global_238k');
  const [currentSubscribers, setCurrentSubscribers] = useState(112);
  const [batchDispatched, setBatchDispatched] = useState(false);

  const growthPlanMonthlyRate = 119;
  const inrRate = 83.5;

  // Mode Targets
  const targetSubscribers = scaleMode === 'global_238k' ? 2000 : 528;
  const targetMonthlyMRR = scaleMode === 'global_238k' ? 238000 : 62870.4;
  const targetDailyUSD = targetMonthlyMRR / 30;

  const currentDailyUSD = (currentSubscribers * growthPlanMonthlyRate) / 30;
  const currentDailyINR = currentDailyUSD * inrRate;
  const targetDailyINR = targetDailyUSD * inrRate;
  const targetMonthlyINR = targetMonthlyMRR * inrRate;
  const progressPercent = Math.min(100, Math.round((currentSubscribers / targetSubscribers) * 100));

  const milestonesGlobal = [
    { name: 'Milestone 1: $1,000/day (Crossing ₹25L/mo)', clients: 252, dailyUSD: 1000, dailyINR: 83500, monthlyUSD: 30000, monthlyINR: 2505000, status: currentSubscribers >= 252 ? 'achieved' : 'active' },
    { name: 'Milestone 2: $2,095/day (Original US Target)', clients: 528, dailyUSD: 2095.68, dailyINR: 175000, monthlyUSD: 62870, monthlyINR: 5249645, status: currentSubscribers >= 528 ? 'achieved' : 'upcoming' },
    { name: 'Milestone 3: $3,966/day (Crossing ₹1 Crore/mo)', clients: 1000, dailyUSD: 3966.66, dailyINR: 331216, monthlyUSD: 119000, monthlyINR: 9936500, status: currentSubscribers >= 1000 ? 'achieved' : 'upcoming' },
    { name: 'Milestone 4: $5,950/day (1,500 Global Clients)', clients: 1500, dailyUSD: 5950, dailyINR: 496825, monthlyUSD: 178500, monthlyINR: 14904750, status: currentSubscribers >= 1500 ? 'achieved' : 'upcoming' },
    { name: '🎯 FINAL GLOBAL VISION: $7,933.33/day ($238,000/mo)', clients: 2000, dailyUSD: 7933.33, dailyINR: 662433, monthlyUSD: 238000, monthlyINR: 19873000, status: currentSubscribers >= 2000 ? 'achieved' : 'upcoming' },
  ];

  const milestonesUSA = [
    { name: 'Milestone 1: $250/day', clients: 63, dailyUSD: 250, dailyINR: 20875, monthlyUSD: 7500, monthlyINR: 626250, status: currentSubscribers >= 63 ? 'achieved' : 'active' },
    { name: 'Milestone 2: $500/day', clients: 126, dailyUSD: 500, dailyINR: 41750, monthlyUSD: 15000, monthlyINR: 1252500, status: currentSubscribers >= 126 ? 'achieved' : 'active' },
    { name: 'Milestone 3: $1,000/day', clients: 252, dailyUSD: 1000, dailyINR: 83500, monthlyUSD: 30000, monthlyINR: 2505000, status: currentSubscribers >= 252 ? 'achieved' : 'upcoming' },
    { name: 'Milestone 4: $1,500/day', clients: 378, dailyUSD: 1500, dailyINR: 125250, monthlyUSD: 45000, monthlyINR: 3757500, status: currentSubscribers >= 378 ? 'achieved' : 'upcoming' },
    { name: '🎯 FINAL GOAL: $2,095.68/day', clients: 528, dailyUSD: 2095.68, dailyINR: 175000, monthlyUSD: 62870, monthlyINR: 5249645, status: currentSubscribers >= 528 ? 'achieved' : 'upcoming' },
  ];

  const activeMilestones = scaleMode === 'global_238k' ? milestonesGlobal : milestonesUSA;

  const handleAccelerateBatch = async () => {
    setBatchDispatched(true);
    try {
      await fetch('/api/growth/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 50 }),
      });
      setCurrentSubscribers((prev) => prev + 4);
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
                <span className="p-2 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-500 text-slate-950">
                  <Globe2 className="w-5 h-5 stroke-[2.5]" />
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {scaleMode === 'global_238k'
                    ? 'Global $238,000 / Month ($7,933/Day) Revenue Engine'
                    : '$2,095.68 / Day Revenue Acceleration Engine'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {scaleMode === 'global_238k' ? '₹2 कोटी / महिना Scale Target' : '₹1.75L / दिवस Autopilot'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {scaleMode === 'global_238k'
                  ? '7-Country Global Matrix: 2,000 Paid Subscribers ($119/mo) = $238,000/mo MRR (~₹1.98 Crore/mo | ₹6.62 Lakhs/day).'
                  : 'US Baseline Plan: 528 Paid Subscribers ($119/mo) = $62,870/mo MRR = $2,095.68 Daily Income.'}
              </p>
            </div>

            {/* Target Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
              <button
                onClick={() => setScaleMode('global_238k')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  scaleMode === 'global_238k'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" /> Global $238,000/mo (₹2 Cr/mo)
              </button>
              <button
                onClick={() => setScaleMode('usa_baseline')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                  scaleMode === 'usa_baseline'
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                US Baseline ($2,095/day)
              </button>
            </div>
          </div>

          {/* MAIN HERO STATS CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily / Monthly Income Target */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Target Monthly & Daily Velocity
                </div>
                <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white font-mono">
                  ${targetMonthlyMRR.toLocaleString()}{' '}
                  <span className="text-lg text-slate-400 font-normal">/ month</span>
                </div>
                <div className="text-sm text-emerald-400 font-mono font-bold">
                  (₹{targetMonthlyINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })} दरमहा — ₹{targetDailyINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })} दररोज थेट बँकेत)
                </div>
              </div>

              {/* Current Run-Rate */}
              <div className="space-y-2 md:border-l md:border-slate-800 md:pl-6">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Current Live Run-Rate (Active)
                </div>
                <div className="text-3xl sm:text-5xl font-black text-white font-mono">
                  ${(currentSubscribers * growthPlanMonthlyRate).toLocaleString()}{' '}
                  <span className="text-lg text-slate-400 font-normal">/ month</span>
                </div>
                <div className="text-sm text-cyan-400 font-mono font-semibold">
                  ₹{((currentSubscribers * growthPlanMonthlyRate) * inrRate).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / महिना ({currentSubscribers} / {targetSubscribers} Active Global Clients)
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Pacing: <strong>{progressPercent}%</strong> toward {targetSubscribers} Target Subscribers</span>
                <span>Remaining: <strong className="text-emerald-400">{targetSubscribers - currentSubscribers} Subscribers Needed</strong></span>
              </div>
              <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.max(6, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 7-COUNTRY GLOBAL ALLOCATION */}
          {scaleMode === 'global_238k' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400" /> 7-Country Subscriber Distribution for $238,000/Month
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white block">🇺🇸 USA</span>
                  <span className="text-emerald-400 font-mono font-bold block">700 Clients</span>
                  <span className="text-[10px] text-slate-400 block">$83,300/mo</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white block">🇬🇧 UK</span>
                  <span className="text-emerald-400 font-mono font-bold block">300 Clients</span>
                  <span className="text-[10px] text-slate-400 block">$35,700/mo</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white block">🇨🇦 Canada</span>
                  <span className="text-emerald-400 font-mono font-bold block">250 Clients</span>
                  <span className="text-[10px] text-slate-400 block">$29,750/mo</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white block">🇦🇺 Australia</span>
                  <span className="text-emerald-400 font-mono font-bold block">250 Clients</span>
                  <span className="text-[10px] text-slate-400 block">$29,750/mo</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white block">🇦🇪 UAE</span>
                  <span className="text-emerald-400 font-mono font-bold block">150 Clients</span>
                  <span className="text-[10px] text-slate-400 block">$17,850/mo</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white block">🇪🇺 Europe</span>
                  <span className="text-emerald-400 font-mono font-bold block">150 Clients</span>
                  <span className="text-[10px] text-slate-400 block">$17,850/mo</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white block">🇮🇳 India</span>
                  <span className="text-emerald-400 font-mono font-bold block">200 Clients</span>
                  <span className="text-[10px] text-slate-400 block">$23,800/mo</span>
                </div>
              </div>
            </div>
          )}

          {/* MILESTONE ROADMAP */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Revenue Acceleration Milestone Roadmap
            </h3>

            <div className="space-y-3">
              {activeMilestones.map((m, idx) => (
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
                      <div className="text-sm font-bold text-emerald-400">${m.monthlyUSD.toLocaleString()}/mo (${m.dailyUSD.toFixed(0)}/day)</div>
                      <div className="text-[10px] text-slate-400">₹{m.monthlyINR.toLocaleString('en-IN')}/महिना (₹{m.dailyINR.toLocaleString('en-IN')}/दिवस)</div>
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
        </main>
      </div>
    </div>
  );
}
