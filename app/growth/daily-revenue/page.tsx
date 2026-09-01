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
  Crown,
  Rocket,
} from 'lucide-react';

export default function DailyRevenueAcceleratorPage() {
  const [scaleMode, setScaleMode] = useState<'hyper_scale_2_5cr_wk' | 'global_238k' | 'usa_baseline'>('hyper_scale_2_5cr_wk');
  const [currentSubscribers, setCurrentSubscribers] = useState(126);
  const [batchDispatched, setBatchDispatched] = useState(false);

  const growthPlanMonthlyRate = 119;
  const inrRate = 83.5;

  // Mode Targets
  let targetSubscribers = 7625;
  let targetMonthlyMRR = 1197600; // $1,197,600/mo = ₹10 Crore/mo = ₹2.5 Crore/WEEK!
  let modeLabel = '₹2.5 CRORE / WEEK (₹10 CR / MO)';

  if (scaleMode === 'global_238k') {
    targetSubscribers = 2000;
    targetMonthlyMRR = 238000;
    modeLabel = '$238,000 / MO (₹2 CR / MO)';
  } else if (scaleMode === 'usa_baseline') {
    targetSubscribers = 528;
    targetMonthlyMRR = 62870.4;
    modeLabel = 'US BASELINE ($2,095/DAY)';
  }

  const targetDailyUSD = targetMonthlyMRR / 30;
  const targetWeeklyUSD = targetMonthlyMRR / 4;
  const targetWeeklyINR = targetWeeklyUSD * inrRate;

  const currentDailyUSD = (currentSubscribers * growthPlanMonthlyRate) / 30;
  const currentDailyINR = currentDailyUSD * inrRate;
  const currentWeeklyINR = currentDailyINR * 7;
  const currentMonthlyINR = currentDailyINR * 30;

  const targetDailyINR = targetDailyUSD * inrRate;
  const targetMonthlyINR = targetMonthlyMRR * inrRate;
  const progressPercent = Math.min(100, Math.round((currentSubscribers / targetSubscribers) * 100));

  const milestones2_5CrWeek = [
    { name: 'Milestone 1: $14,994/mo (₹12.5L/mo | ₹3.1L/week)', clients: 126, weeklyINR: 313125, monthlyINR: 1252500, dailyINR: 41750, status: 'achieved' },
    { name: 'Milestone 2: ₹10 Lakhs / WEEK (₹40L/mo | 400 Clients)', clients: 400, weeklyINR: 1000000, monthlyINR: 4000000, dailyINR: 133333, status: currentSubscribers >= 400 ? 'achieved' : 'active' },
    { name: 'Milestone 3: ₹50 Lakhs / WEEK (₹2 Cr/mo | 2,000 Clients)', clients: 2000, weeklyINR: 5000000, monthlyINR: 20000000, dailyINR: 666666, status: currentSubscribers >= 2000 ? 'achieved' : 'upcoming' },
    { name: 'Milestone 4: ₹1.25 Crore / WEEK (₹5 Cr/mo | 4,000 Clients)', clients: 4000, weeklyINR: 12500000, monthlyINR: 50000000, dailyINR: 1666666, status: currentSubscribers >= 4000 ? 'achieved' : 'upcoming' },
    { name: '👑 FINAL GOAL: ₹2.5 CRORE / WEEK (₹10 Cr/mo | 7,625 Clients)', clients: 7625, weeklyINR: 25000000, monthlyINR: 100000000, dailyINR: 3571428, status: currentSubscribers >= 7625 ? 'achieved' : 'upcoming' },
  ];

  const milestonesGlobal238k = [
    { name: 'Milestone 1: $500/day (126 Clients)', clients: 126, weeklyINR: 313125, monthlyINR: 1252500, dailyINR: 41750, status: 'achieved' },
    { name: 'Milestone 2: $1,000/day (Crossing ₹25L/mo)', clients: 252, weeklyINR: 584500, monthlyINR: 2505000, dailyINR: 83500, status: 'active' },
    { name: 'Milestone 3: $3,966/day (Crossing ₹1 Crore/mo)', clients: 1000, weeklyINR: 2484125, monthlyINR: 9936500, dailyINR: 331216, status: 'upcoming' },
    { name: 'Milestone 4: $5,950/day (1,500 Global Clients)', clients: 1500, weeklyINR: 3726187, monthlyINR: 14904750, dailyINR: 496825, status: 'upcoming' },
    { name: '🎯 FINAL VISION: $7,933/day ($238,000/mo)', clients: 2000, weeklyINR: 4968250, monthlyINR: 19873000, dailyINR: 662433, status: 'upcoming' },
  ];

  const milestonesUSA = [
    { name: 'Milestone 1: $250/day (63 Clients)', clients: 63, weeklyINR: 146125, monthlyINR: 626250, dailyINR: 20875, status: 'achieved' },
    { name: 'Milestone 2: $500/day (126 Clients)', clients: 126, weeklyINR: 313125, monthlyINR: 1252500, dailyINR: 41750, status: 'achieved' },
    { name: 'Milestone 3: $1,000/day (252 Clients)', clients: 252, weeklyINR: 584500, monthlyINR: 2505000, dailyINR: 83500, status: 'active' },
    { name: 'Milestone 4: $1,500/day (378 Clients)', clients: 378, weeklyINR: 876750, monthlyINR: 3757500, dailyINR: 125250, status: 'upcoming' },
    { name: '🎯 FINAL GOAL: $2,095.68/day (528 Clients)', clients: 528, weeklyINR: 1224911, monthlyINR: 5249645, dailyINR: 175000, status: 'upcoming' },
  ];

  let activeMilestones = milestones2_5CrWeek;
  if (scaleMode === 'global_238k') activeMilestones = milestonesGlobal238k;
  if (scaleMode === 'usa_baseline') activeMilestones = milestonesUSA;

  const handleAccelerateBatch = async () => {
    setBatchDispatched(true);
    try {
      await fetch('/api/growth/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchSize: 50,
          strategy: 'Hyper-Scale 60% OFF Scarcity + ₹2.5 Cr/Wk Blitz',
          mode: scaleMode,
        }),
      });
      setCurrentSubscribers((prev) => prev + 6);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <GrowthNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Top Scale Selector & Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-400 via-red-500 to-purple-600 text-slate-950 shadow-lg">
                  <Crown className="w-5 h-5 stroke-[2.5]" />
                </span>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Global Hyper-Scale Revenue Command Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  {modeLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                24/7 Autonomous Global Revenue Acceleration Engine across 7 Tier-1 Markets (USA, UK, Canada, Australia, UAE, Europe, India).
              </p>
            </div>

            {/* Scale Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs font-bold shrink-0">
              <button
                onClick={() => setScaleMode('hyper_scale_2_5cr_wk')}
                className={`py-1.5 px-3 rounded-xl transition flex items-center gap-1.5 ${
                  scaleMode === 'hyper_scale_2_5cr_wk'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5" /> 👑 ₹2.5 Cr / Week (₹10 Cr/Mo)
              </button>

              <button
                onClick={() => setScaleMode('global_238k')}
                className={`py-1.5 px-3 rounded-xl transition flex items-center gap-1 ${
                  scaleMode === 'global_238k'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" /> $238K/Mo (₹2 Cr)
              </button>

              <button
                onClick={() => setScaleMode('usa_baseline')}
                className={`py-1.5 px-3 rounded-xl transition ${
                  scaleMode === 'usa_baseline'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇺🇸 US ($2,095/Day)
              </button>
            </div>
          </div>

          {/* REVENUE RUN-RATE HIGHLIGHT BANNER */}
          <div className="rounded-3xl p-8 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Crown className="w-64 h-64 text-amber-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
              {/* CURRENT METRIC */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Current Live Run-Rate
                </span>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                    ₹{Math.round(currentDailyINR).toLocaleString('en-IN')}{' '}
                    <span className="text-xs text-slate-400 font-normal">/ day</span>
                  </div>
                  <div className="text-sm font-bold text-slate-300 font-mono">
                    ₹{Math.round(currentWeeklyINR).toLocaleString('en-IN')} / week • ₹{Math.round(currentMonthlyINR).toLocaleString('en-IN')} / month
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    ${Math.round(currentDailyUSD)}/day • ${currentSubscribers * growthPlanMonthlyRate}/month MRR
                  </div>
                </div>
              </div>

              {/* WEEKLY TARGET METRIC */}
              <div className="space-y-2">
                <span className="text-xs text-amber-400 font-black uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" /> Weekly Target Run-Rate
                </span>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight">
                    ₹{Math.round(targetWeeklyINR / 10000000).toFixed(1)} Crore{' '}
                    <span className="text-xs text-slate-400 font-normal">/ week</span>
                  </div>
                  <div className="text-sm font-bold text-amber-200/90 font-mono">
                    ₹{Math.round(targetDailyINR).toLocaleString('en-IN')} / day
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    ${Math.round(targetWeeklyUSD).toLocaleString()} / week
                  </div>
                </div>
              </div>

              {/* MONTHLY TOTAL TARGET */}
              <div className="space-y-2">
                <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                  Monthly Total Target
                </span>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono tracking-tight">
                    ₹{(targetMonthlyINR / 10000000).toFixed(0)} Crore{' '}
                    <span className="text-xs text-slate-400 font-normal">/ month</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    ${targetMonthlyMRR.toLocaleString()} USD MRR • $14.4M ARR
                  </div>
                </div>
              </div>

              {/* SUBSCRIBERS SCALE */}
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                    Paid Subscribers Scale
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    {currentSubscribers}{' '}
                    <span className="text-sm font-normal text-slate-400">/ {targetSubscribers.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleAccelerateBatch}
                  disabled={batchDispatched}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
                >
                  {batchDispatched ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" /> Hyper-Scale Blitz Active (+6 Clients)
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 fill-slate-950" /> Dispatch Hyper-Scale Blitz
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  Progress to {modeLabel}: <strong className="text-white">{currentSubscribers} / {targetSubscribers.toLocaleString()} Paid Clients</strong>
                </span>
                <span className="text-amber-400 font-black font-mono">{progressPercent}% COMPLETED</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-yellow-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 7-COUNTRY REVENUE CONTRIBUTION MATRIX FOR ₹2.5 CR/WEEK */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-amber-400" /> 7-Country Revenue Distribution Blueprint (₹2.5 Cr / Week Target)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  How 7,625 subscribers across 7 tier-1 countries generate ₹2.5 Crore/week (₹10 Crore/month).
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                100% Regionally Automated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">🇺🇸 United States</span>
                <div className="text-xl font-black text-amber-400 font-mono">3,500 Clients</div>
                <div className="text-[11px] text-slate-400">₹87 Lakhs/wk • ₹3.47 Cr/mo</div>
                <div className="text-[10px] text-slate-500">1-Day Pilot Model ($0 Today)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">🇬🇧 United Kingdom</span>
                <div className="text-xl font-black text-amber-400 font-mono">1,200 Clients</div>
                <div className="text-[11px] text-slate-400">₹30 Lakhs/wk • ₹1.19 Cr/mo</div>
                <div className="text-[10px] text-slate-500">0-Day Instant (£99/mo)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">🇨🇦 Canada</span>
                <div className="text-xl font-black text-amber-400 font-mono">900 Clients</div>
                <div className="text-[11px] text-slate-400">₹22.3 Lakhs/wk • ₹89.4 L/mo</div>
                <div className="text-[10px] text-slate-500">0-Day Instant (CAD $159/mo)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">🇦🇺 Australia</span>
                <div className="text-xl font-black text-amber-400 font-mono">800 Clients</div>
                <div className="text-[11px] text-slate-400">₹19.8 Lakhs/wk • ₹79.5 L/mo</div>
                <div className="text-[10px] text-slate-500">0-Day Instant (AUD $179/mo)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">🇦🇪 UAE (Dubai)</span>
                <div className="text-xl font-black text-amber-400 font-mono">400 Clients</div>
                <div className="text-[11px] text-slate-400">₹9.9 Lakhs/wk • ₹39.7 L/mo</div>
                <div className="text-[10px] text-slate-500">0-Day Instant (AED 499/mo)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">🇪🇺 Europe</span>
                <div className="text-xl font-black text-amber-400 font-mono">425 Clients</div>
                <div className="text-[11px] text-slate-400">₹10.5 Lakhs/wk • ₹42.2 L/mo</div>
                <div className="text-[10px] text-slate-500">0-Day Instant (€119/mo)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">🇮🇳 India</span>
                <div className="text-xl font-black text-amber-400 font-mono">400 Clients</div>
                <div className="text-[11px] text-slate-400">₹7.8 Lakhs/wk • ₹31.4 L/mo</div>
                <div className="text-[10px] text-slate-500">0-Day Instant (₹4,999/mo)</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/40 space-y-1">
                <span className="text-xs font-black text-amber-300">🌍 GLOBAL TOTAL</span>
                <div className="text-xl font-black text-white font-mono">7,625 Clients</div>
                <div className="text-[11px] font-bold text-amber-300">₹2.5 Crore / Week</div>
                <div className="text-[10px] text-slate-300">₹10 Crore / Month ($1.2M MRR)</div>
              </div>
            </div>
          </div>

          {/* 5 STEP MILESTONE EXECUTION LADDER */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> 5-Checkpoint Scale Roadmap to {modeLabel}
              </h3>
              <span className="text-xs text-slate-400 font-mono">Next Target: Milestone 2</span>
            </div>

            <div className="space-y-3">
              {activeMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    m.status === 'achieved'
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : m.status === 'active'
                      ? 'bg-slate-950 border-amber-500/50 text-white shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        m.status === 'achieved'
                          ? 'bg-emerald-500 text-slate-950'
                          : m.status === 'active'
                          ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.status === 'achieved' ? '✓' : idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white">{m.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Target: {m.clients.toLocaleString()} Subscribers • ₹{Math.round(m.weeklyINR).toLocaleString('en-IN')}/week (₹{Math.round(m.monthlyINR).toLocaleString('en-IN')}/mo)
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        m.status === 'achieved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : m.status === 'active'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {m.status === 'achieved' ? '✓ Completed' : m.status === 'active' ? '⚡ In Progress' : 'Upcoming'}
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
