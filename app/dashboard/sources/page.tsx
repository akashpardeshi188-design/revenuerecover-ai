'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/marketing/Navbar';
import { GrowthNav } from '@/components/growth/GrowthNav';
import {
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  DollarSign,
  ShieldCheck,
  AlertOctagon,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { AISourceOptimizer, SourcePerformanceMetrics } from '@/lib/discovery/source-optimizer';

export default function SourceIntelligenceDashboard() {
  const [sourcesMetrics] = useState<SourcePerformanceMetrics[]>(AISourceOptimizer.evaluateSources());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <GrowthNav />

        {/* Top Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <Layers className="w-3.5 h-3.5" /> Source Intelligence &amp; AI Routing Optimizer
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Global Source Performance &amp; Unit Economics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Real-time monitoring of data yield, duplicate rates, verification accuracy, and automated AI source routing recommendations.
            </p>
          </div>
        </div>

        {/* Performance Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Active Global Sources Intelligence Matrix
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {sourcesMetrics.length} Evaluated Sources
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Source Name</th>
                  <th className="p-3">Discovered</th>
                  <th className="p-3">Duplicates</th>
                  <th className="p-3">Verified High Trust</th>
                  <th className="p-3">Avg. Latency</th>
                  <th className="p-3">Est. Cost</th>
                  <th className="p-3">Score</th>
                  <th className="p-3 text-right">AI Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sourcesMetrics.map((src) => (
                  <tr key={src.sourceId} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-white">
                      <div>{src.sourceName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{src.optimizationReason}</div>
                    </td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">
                      {src.businessesDiscovered}
                    </td>
                    <td className="p-3 font-mono text-cyan-400">
                      {src.duplicatesFound}
                    </td>
                    <td className="p-3 font-mono text-amber-400 font-bold">
                      {src.verifiedBusinesses}
                    </td>
                    <td className="p-3 font-mono text-slate-400">
                      {src.averageLatencyMs}ms
                    </td>
                    <td className="p-3 font-mono text-purple-400 font-bold">
                      ${src.totalCostUSD}
                    </td>
                    <td className="p-3">
                      <span className="font-mono font-black text-slate-100">
                        {src.performanceScore}/100
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          src.recommendation === 'ENABLE' || src.recommendation === 'KEEP'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : src.recommendation === 'REVIEW'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {src.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
