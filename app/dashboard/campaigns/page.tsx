'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import {
  Zap,
  Sparkles,
  Plus,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  Mail,
  Flame,
} from 'lucide-react';

export default function CampaignsPage() {
  const { state } = useAppStore();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(state.campaigns[0]?.id || '');

  const activeCamp = state.campaigns.find((c) => c.id === selectedCampaignId) || state.campaigns[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <DashboardNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Automated Recovery Campaigns</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-channel trigger sequences that re-engage lost leads and unaccepted quotes on autopilot.
              </p>
            </div>

            <button className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition">
              <Plus className="w-4 h-4" /> Create New Sequence
            </button>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Campaign List */}
            <div className="lg:col-span-5 space-y-3">
              {state.campaigns.map((camp) => {
                const isSelected = camp.id === activeCamp?.id;
                return (
                  <div
                    key={camp.id}
                    onClick={() => setSelectedCampaignId(camp.id)}
                    className={`p-6 rounded-3xl border cursor-pointer transition shadow-xl space-y-4 ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base">{camp.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                        {camp.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Dispatched</div>
                        <div className="text-white font-bold font-mono mt-0.5">{camp.stats.sent}</div>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Replies</div>
                        <div className="text-emerald-400 font-bold font-mono mt-0.5">{camp.stats.replied}</div>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Recovered</div>
                        <div className="text-white font-bold font-mono mt-0.5">
                          ${camp.stats.recovered_revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Interactive Sequence Flow Builder */}
            <div className="lg:col-span-7">
              {activeCamp && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl sticky top-24">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold text-white">{activeCamp.name}</h3>
                      <p className="text-xs text-slate-400">Trigger: {activeCamp.type.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Total Recovered: ${activeCamp.stats.recovered_revenue.toLocaleString()}
                    </span>
                  </div>

                  {/* Flow Steps */}
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Sequence Workflow Steps ({activeCamp.steps.length})
                    </div>

                    <div className="space-y-3">
                      {activeCamp.steps.map((step, idx) => (
                        <div
                          key={step.id}
                          className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 relative"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[11px]">
                                {idx + 1}
                              </span>
                              <span>Delay: {step.delay_days === 0 ? 'Instant (45 sec)' : `${step.delay_days} days after trigger`}</span>
                            </span>
                            <span className="uppercase text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-300 border border-slate-800">
                              {step.channel}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                            {step.template}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
