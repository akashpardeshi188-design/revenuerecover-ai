'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { GrowthAnalystAgent } from '@/lib/agents/growth-analyst-agent';
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

export default function GrowthAnalystPage() {
  const { state } = useAppStore();
  const analysis = GrowthAnalystAgent.analyzePerformance(state.growthMetrics, state.prospectLeads);
  const [insights, setInsights] = useState(analysis.insights);

  const handleApply = (id: string) => {
    setInsights((prev) =>
      prev.map((ins) => (ins.id === id ? { ...ins, reviewed: true } : ins))
    );
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
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Growth Analyst & Optimization Loop</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Autonomous meta-analysis evaluating conversion metrics across industries, channels, and copy variants.
              </p>
            </div>

            <div className="text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              CAC:LTV Ratio: <strong className="text-emerald-400">{analysis.cacLtvRatio}x</strong>
            </div>
          </div>

          {/* Funnel Conversion Rates */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base">Funnel Step Conversion Velocity</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Visitor → Scan</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {analysis.funnelConversionRates.visitorToScan}%
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Scan → Lead</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {analysis.funnelConversionRates.scanToLead}%
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Lead → Qualified</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {analysis.funnelConversionRates.leadToQualified}%
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Qual → Demo</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {analysis.funnelConversionRates.qualifiedToDemo}%
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Demo → Trial</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {analysis.funnelConversionRates.demoToTrial}%
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Trial → Paid</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                  {analysis.funnelConversionRates.trialToPaid}%
                </div>
              </div>
            </div>
          </div>

          {/* Self-Improvement Insights List */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Actionable Self-Improvement Recommendations ({insights.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((ins) => (
                <div
                  key={ins.id}
                  className={`bg-slate-900 border rounded-3xl p-6 space-y-4 shadow-xl transition flex flex-col justify-between ${
                    ins.reviewed ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                        {ins.category}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        Impact: <strong className="text-emerald-400">{ins.impactScore}/100</strong>
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base">{ins.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      {ins.finding}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] max-w-[240px] truncate">{ins.recommendedAction}</span>
                    {ins.reviewed ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed & Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(ins.id)}
                        className="py-1.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
                      >
                        Apply Recommendation
                      </button>
                    )}
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
