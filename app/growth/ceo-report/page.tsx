'use client';

import React, { useState } from 'react';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { CeoReportEngine, DailyCeoReport } from '@/lib/growth-brain/ceo-report-engine';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Flame,
  Zap,
} from 'lucide-react';

export default function CeoReportPage() {
  const report = CeoReportEngine.generateDailyReport();
  const [actions, setActions] = useState(report.top5Actions);
  const [executedBanner, setExecutedBanner] = useState<string | null>(null);

  const handleExecuteAction = (id: string, name: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'in_progress' } : a))
    );
    setExecutedBanner(`Action "${name}" queued for autonomous execution!`);
    setTimeout(() => setExecutedBanner(null), 3000);
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
                <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950">
                  <FileText className="w-5 h-5 stroke-[2.5]" />
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">Daily AI CEO Report & Executive Brief</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Generated {report.generatedDate} • Autonomous daily business intelligence, pipeline velocity, and ICE-ranked priorities.
              </p>
            </div>

            <div className="text-xs font-mono text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              Pacing: <strong className="text-white">${report.revenue.projectedEndMonthMRR.toLocaleString()}</strong> Target MRR
            </div>
          </div>

          {executedBanner && (
            <div className="p-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {executedBanner}
            </div>
          )}

          {/* Executive Summary Card */}
          <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Executive Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
              {report.executiveSummary}
            </p>
          </div>

          {/* KPI Snapshot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
              <div className="text-slate-400 font-semibold uppercase">Yesterday Recovered</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                ${report.revenue.yesterdayRecovered.toLocaleString()}
              </div>
              <div className="text-slate-500">Summit HVAC customer portal</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
              <div className="text-slate-400 font-semibold uppercase">Total Pipeline Leads</div>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                {report.pipeline.newLeads.toLocaleString()}
              </div>
              <div className="text-slate-500">Across 8 top US metropolitan hubs</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
              <div className="text-slate-400 font-semibold uppercase">Active Free Trials</div>
              <div className="text-2xl font-black text-purple-400 font-mono mt-1">
                {report.pipeline.activeTrials}
              </div>
              <div className="text-emerald-400 font-semibold">{report.salesPerformance.trialToPaidRate}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
              <div className="text-slate-400 font-semibold uppercase">Current Paid MRR</div>
              <div className="text-2xl font-black text-white font-mono mt-1">
                ${report.revenue.thisWeekMRR.toLocaleString()}
              </div>
              <div className="text-cyan-400 font-semibold">{report.pipeline.paidSubscribers} Growth Subscribers</div>
            </div>
          </div>

          {/* TOP 5 ICE-RANKED ACTIONS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" /> Top 5 High-Impact Business Actions
                </h3>
                <p className="text-xs text-slate-400">
                  Prioritized by ICE Formula: (Expected Revenue Impact × Confidence) ÷ Effort.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {actions.map((act, idx) => (
                <div
                  key={act.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white text-sm">{act.action}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span>Category: <strong className="text-cyan-400 uppercase">{act.category}</strong></span>
                      <span>•</span>
                      <span>Impact: <strong className="text-emerald-400">{act.expectedImpact}/100</strong></span>
                      <span>•</span>
                      <span>Confidence: <strong className="text-white">{act.confidence}%</strong></span>
                      <span>•</span>
                      <span>Effort: <strong className="text-slate-300">{act.effort}/100</strong></span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">ICE Score: {act.score}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleExecuteAction(act.id, act.action)}
                    disabled={act.status === 'in_progress'}
                    className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shrink-0 ${
                      act.status === 'in_progress'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 shadow-md'
                    }`}
                  >
                    {act.status === 'in_progress' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Queued for Execution
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" /> Execute Action
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC 7-DAY MARKETING CALENDAR */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" /> Dynamic 7-Day Autonomous Marketing Calendar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs">
              {report.weeklyCalendar.map((day) => (
                <div
                  key={day.day}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-cyan-400 text-xs">{day.day}</div>
                    <div className="font-semibold text-white text-[11px]">{day.focus}</div>
                  </div>

                  <ul className="space-y-1 text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-900">
                    {day.channelTasks.map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
