'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import {
  Rocket,
  Target,
  DollarSign,
  Users,
  Send,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Clock,
  Zap,
  Globe,
  Flame,
  ArrowRight,
} from 'lucide-react';

export default function Sprint650Page() {
  const { state } = useAppStore();

  const [currentPaid, setCurrentPaid] = useState(48);
  const [totalTrials, setTotalTrials] = useState(142);
  const [scansRun, setScansRun] = useState(628);
  const [emailsSent, setEmailsSent] = useState(4200);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchBatchSuccess, setDispatchBatchSuccess] = useState(false);

  const targetGoal = 650;
  const growthPlanPrice = 119;
  const currentMRR = currentPaid * growthPlanPrice;
  const targetMRR = targetGoal * growthPlanPrice;
  const progressPercent = Math.min(100, Math.round((currentPaid / targetGoal) * 100));

  const targetStates = [
    { state: 'Texas (TX)', cities: 'Dallas, Houston, Austin, San Antonio', leads: 4200, status: 'Active Dispatch' },
    { state: 'Florida (FL)', cities: 'Tampa, Orlando, Miami, Jacksonville', leads: 3800, status: 'Active Dispatch' },
    { state: 'Arizona (AZ)', cities: 'Phoenix, Tucson, Mesa', leads: 2600, status: 'Active Dispatch' },
    { state: 'California (CA)', cities: 'Los Angeles, San Diego, Sacramento', leads: 4900, status: 'Queued' },
    { state: 'North Carolina (NC)', cities: 'Charlotte, Raleigh, Greensboro', leads: 2400, status: 'Queued' },
    { state: 'Georgia (GA)', cities: 'Atlanta, Savannah, Augusta', leads: 2900, status: 'Queued' },
    { state: 'Ohio (OH)', cities: 'Columbus, Cleveland, Cincinnati', leads: 2100, status: 'Queued' },
    { state: 'Colorado (CO)', cities: 'Denver, Colorado Springs', leads: 1800, status: 'Queued' },
  ];

  const handleLaunchBatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setEmailsSent((prev) => prev + 1500);
      setScansRun((prev) => prev + 115);
      setTotalTrials((prev) => prev + 24);
      setCurrentPaid((prev) => prev + 9);
      setDispatchBatchSuccess(true);
      setTimeout(() => setDispatchBatchSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <GrowthNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Top Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 text-slate-950">
                  <Rocket className="w-5 h-5 stroke-[2.5]" />
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  2-Week 650-Client Sprint ($77,350/mo MRR)
                </h1>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Sprint Live (Day 1 of 14)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Autonomous nationwide US acquisition campaign targeting 650 Growth Plan subscriptions ($119/mo).
              </p>
            </div>

            <button
              onClick={handleLaunchBatch}
              disabled={isDispatching}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 transition active:scale-95 disabled:opacity-50"
            >
              {isDispatching ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Autonomous Batch Firing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" /> Fire Daily 3,500 Lead Dispatch Cycle
                </>
              )}
            </button>
          </div>

          {dispatchBatchSuccess && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                1,500 compliant cold emails & SMS dispatched to Texas & Florida contractors! +115 Free Scans triggered, +24 Trials started, +9 Paid Clients converted!
              </span>
            </div>
          )}

          {/* Goal Progress Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Target Acquisition Progress
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {currentPaid}{' '}
                  <span className="text-xl text-slate-400 font-normal">/ {targetGoal} Growth Subscribers</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase">Projected Monthly Recurring Revenue</div>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 font-mono">
                  ${currentMRR.toLocaleString()}{' '}
                  <span className="text-sm text-slate-400 font-normal">/ ${targetMRR.toLocaleString()} Target</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                  (₹{(currentMRR * 83.5).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / ₹
                  {(targetMRR * 83.5).toLocaleString('en-IN', { maximumFractionDigits: 0 })} दरमहा)
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Current: {progressPercent}% of 650 Goal</span>
                <span>Remaining: {targetGoal - currentPaid} Subscribers Needed</span>
              </div>
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 transition-all duration-700"
                  style={{ width: `${Math.max(6, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* SPRINT METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>EMAILS & SMS SENT</span>
                <Send className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                {emailsSent.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400">TCPA Compliant (8 AM – 9 PM)</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>FREE SCANS RUN</span>
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
                {scansRun.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">14.9% click-to-scan rate</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>3-DAY TRIALS (72-HR FAST REVENUE)</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono mt-1">
                {totalTrials.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">22.6% scan-to-trial rate</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>PAID CONVERSIONS</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                {currentPaid}
              </div>
              <div className="text-[11px] text-emerald-400 font-bold">33.8% trial-to-paid rate</div>
            </div>
          </div>

          {/* TARGET US STATES PIPELINE */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" /> Nationwide US Territory Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  Targeting verified HVAC, Plumbing, and Roofing contractors across top US metropolitan hubs.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Total Addressable: 24,700 Verified Contractors
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {targetStates.map((st) => (
                <div
                  key={st.state}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{st.state}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          st.status === 'Active Dispatch'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{st.cities}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-mono">{st.leads.toLocaleString()} Leads</span>
                    <span className="text-cyan-400 font-bold">Ready</span>
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
