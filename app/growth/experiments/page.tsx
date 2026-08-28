'use client';

import React from 'react';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { ExperimentationEngine } from '@/lib/growth-brain/experimentation-engine';
import {
  FlaskConical,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sliders,
  ArrowRight,
  Flame,
  Zap,
} from 'lucide-react';

export default function ExperimentsLabPage() {
  const experiments = ExperimentationEngine.getExperiments();

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
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <FlaskConical className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  A/B Testing & Conversion Rate Optimization (CRO) Lab
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Scientific experimentation engine measuring statistical significance across copy, pricing, and CTAs.
              </p>
            </div>

            <div className="text-xs font-mono text-purple-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              Active Experiments: <strong>{experiments.length}</strong> (95%+ Confidence Threshold)
            </div>
          </div>

          {/* Experiments List */}
          <div className="space-y-6">
            {experiments.map((exp) => (
              <div
                key={exp.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-lg">{exp.name}</h3>
                      <span className="text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30">
                        {exp.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Hypothesis: {exp.hypothesis}</p>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shrink-0">
                    Confidence: {exp.statisticalConfidence}% (WINNER: SCALE)
                  </span>
                </div>

                {/* Control vs Variant Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Control Variant */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Control (Variant A)</span>
                      <span className="font-mono text-slate-400">{exp.controlVariant.impressions.toLocaleString()} views</span>
                    </div>
                    <p className="text-slate-200 font-mono text-xs">{exp.controlVariant.description}</p>
                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center font-mono">
                      <span className="text-slate-400">Conversion Rate:</span>
                      <span className="text-sm font-bold text-slate-200">{exp.controlVariant.conversionRate}%</span>
                    </div>
                  </div>

                  {/* Test Variant (Winner) */}
                  <div className="bg-emerald-950/20 p-5 rounded-2xl border border-emerald-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 uppercase text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Challenger (Variant B - Winner)
                      </span>
                      <span className="font-mono text-slate-400">{exp.testVariant.impressions.toLocaleString()} views</span>
                    </div>
                    <p className="text-white font-mono text-xs">{exp.testVariant.description}</p>
                    <div className="pt-2 border-t border-emerald-900/40 flex justify-between items-center font-mono">
                      <span className="text-slate-300">Conversion Rate:</span>
                      <span className="text-sm font-black text-emerald-400">
                        {exp.testVariant.conversionRate}% ({((exp.testVariant.conversionRate / exp.controlVariant.conversionRate - 1) * 100).toFixed(0)}% Lift)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actionable Recommendation */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{exp.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
