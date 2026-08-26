'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import {
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bot,
  Zap,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function GrowthCommandCenterPage() {
  const { state } = useAppStore();
  const m = state.growthMetrics;

  const funnelSteps = [
    { name: 'Website Visitors', count: m.visitors, rate: '100%', color: 'from-blue-500 to-cyan-500' },
    { name: 'Revenue Scans', count: m.scans, rate: `${((m.scans / m.visitors) * 100).toFixed(1)}%`, color: 'from-cyan-500 to-teal-500' },
    { name: 'Leads Captured', count: m.leads, rate: `${((m.leads / m.scans) * 100).toFixed(1)}%`, color: 'from-teal-500 to-emerald-500' },
    { name: 'Qualified (Hot/Warm)', count: m.qualified_leads, rate: `${((m.qualified_leads / m.leads) * 100).toFixed(1)}%`, color: 'from-emerald-500 to-green-500' },
    { name: 'Demo Interactive Runs', count: m.demos, rate: `${((m.demos / m.qualified_leads) * 100).toFixed(1)}%`, color: 'from-green-500 to-amber-500' },
    { name: '14-Day Free Trials', count: m.trials, rate: `${((m.trials / m.demos) * 100).toFixed(1)}%`, color: 'from-amber-500 to-orange-500' },
    { name: 'Paying Customers', count: m.paid_customers, rate: `${((m.paid_customers / m.trials) * 100).toFixed(1)}%`, color: 'from-orange-500 to-purple-500' },
  ];

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
                <h1 className="text-2xl font-bold text-white tracking-tight">Growth Command Center</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Self-Selling Engine Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time tracking of autonomous prospect discovery, lead qualification, demo conversion, and MRR.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/growth/lead-gen"
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Target className="w-3.5 h-3.5" /> Launch AI Prospect Discovery
              </Link>
            </div>
          </div>

          {/* PRIMARY GROWTH METRICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span className="text-cyan-400">MONTHLY RECURRING REVENUE</span>
                <DollarSign className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 mt-2">
                ${m.mrr.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
                +{m.paid_customers} active SaaS subscribers ($149/mo avg)
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>CUSTOMER ACQ. COST (CAC)</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                ${m.cac}
              </div>
              <div className="text-[11px] text-slate-400">
                LTV: <strong className="text-emerald-400">${m.ltv.toLocaleString()}</strong> (22.5x CAC:LTV ratio)
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>AI-GENERATED LEADS</span>
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-2">
                {m.ai_generated_leads}
              </div>
              <div className="text-[11px] text-slate-400">
                {m.ai_qualified_leads} qualified by AI Sales Agent
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>AI COMPUTE COST</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                ${m.ai_compute_cost.toFixed(2)}
              </div>
              <div className="text-[11px] text-emerald-400">
                Extremely high efficiency ($0.05 / lead)
              </div>
            </div>
          </div>

          {/* FULL ACQUISITION FUNNEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Full Self-Selling Acquisition Funnel</h3>
                <p className="text-xs text-slate-400">
                  Step-by-step conversion drop-off from visitor to Free Scanner to paying subscriber.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                Overall Visitor-to-Paid: {((m.paid_customers / m.visitors) * 100).toFixed(2)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {funnelSteps.map((step, idx) => (
                <div
                  key={step.name}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Stage {idx + 1}
                    </div>
                    <div className="text-xs font-semibold text-slate-300 leading-tight">
                      {step.name}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-900">
                    <div className="text-xl font-black text-white">{step.count.toLocaleString()}</div>
                    <div className="text-[11px] text-emerald-400 font-bold font-mono">
                      {step.rate} conv
                    </div>
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
