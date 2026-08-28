'use client';

import React from 'react';
import Link from 'next/link';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { GrowthMemory } from '@/lib/growth-brain/growth-memory';
import { AutonomousDecisionEngine } from '@/lib/growth-brain/decision-engine';
import {
  Cpu,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export default function GrowthBrainPage() {
  const learnings = GrowthMemory.getLearnings();
  const winningCopy = GrowthMemory.getWinningCopy();

  const coreQuestions = [
    { q: '1. What happened yesterday?', a: '+115 Free Revenue Scans completed, +24 Trials initiated, 8 automated cold outreach dispatches delivered.' },
    { q: '2. Why did it happen?', a: 'High interest in Texas & Florida after-hours missed call textback feature ($18K - $25K estimated leakage).' },
    { q: '3. What changed?', a: 'Free Revenue Scanner conversion increased from 11.2% to 15.4% following the 3-step interactive overhaul.' },
    { q: '4. What is working?', a: 'Cold email Variant B with mathematical leakage estimate (+34.2% open rate). Direct ServiceTitan integration mention.' },
    { q: '5. What is failing?', a: 'Generic ads without dollar calculations have lower CTR. Paused in favor of interactive calculator ads.' },
    { q: '6. What opportunity exists?', a: 'Expanding into North Carolina & Georgia metro areas (Charlotte, Raleigh, Atlanta) represents 5,300 untapped contractor leads.' },
    { q: '7. What action should be taken?', a: 'Scale daily batch dispatches to 3,500 leads/day and retarget trial signups with Day 7 value realization SMS.' },
    { q: '8. What experiment should run next?', a: 'Test $2,000 Revenue Guarantee badge placement on checkout page to increase trial-to-paid conversion.' },
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
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Brain className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">Central AI Growth Brain</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Meta-Learning Loop Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Centralized autonomous intelligence synthesizing CRM, analytics, campaigns, and customer feedback.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/growth/ceo-report"
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Cpu className="w-3.5 h-3.5" /> View Daily AI CEO Report
              </Link>
            </div>
          </div>

          {/* The 8 Daily Core Meta-Questions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Daily Autonomous Synthesis (The 8 Growth Questions)
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-semibold">Real-time Feed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {coreQuestions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 hover:border-cyan-500/40 transition"
                >
                  <div className="font-bold text-cyan-300 text-sm">{item.q}</div>
                  <p className="text-slate-300 font-mono leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Memory & Winning Copy Champions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Validated Learnings */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Validated Growth Learnings ({learnings.length})
              </h3>

              <div className="space-y-3">
                {learnings.map((l) => (
                  <div key={l.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">
                        {l.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Impact: <strong className="text-cyan-400">{l.impactScore}/100</strong> • Conf: {l.confidenceScore}%
                      </span>
                    </div>
                    <p className="font-semibold text-white leading-snug">{l.insight}</p>
                    <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-900">
                      Applied: {l.appliedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Winning Copy Champions */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" /> Active Copy Champions (A/B Winners)
              </h3>

              <div className="space-y-3">
                {winningCopy.map((wc, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 uppercase text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded">
                        {wc.channel} • {wc.hookType}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {wc.conversionRate}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed">
                      &quot;{wc.subjectOrHeadline}&quot;
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Sample Size: {wc.sampleSize.toLocaleString()} impressions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
