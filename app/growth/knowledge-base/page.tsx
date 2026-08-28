'use client';

import React from 'react';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { productKnowledgeBase } from '@/lib/growth-brain/product-knowledge-base';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Award,
  Layers,
} from 'lucide-react';

export default function ProductKnowledgeBasePage() {
  const p = productKnowledgeBase;

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
                  <BookOpen className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Central Product Intelligence & Knowledge Base
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Single source of verified truth: ICP, objection scripts, certified integrations, and benchmark metrics.
              </p>
            </div>

            <div className="text-xs font-mono text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Anti-Hallucination Protocol Active (FACT vs INFERENCE Demarcation)</span>
            </div>
          </div>

          {/* ICP & Target Persona */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Ideal Customer Profile (ICP) Definition
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300">Target Trades & Size</div>
                <p className="text-slate-300 font-mono">{p.icp.primaryTrades.join(', ')}</p>
                <div className="text-slate-400 text-[11px]">Size: {p.icp.companySize} ({p.icp.revenueRange})</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300">Decision Maker Roles</div>
                <p className="text-slate-300 font-mono">{p.icp.decisionMakerRoles.join(', ')}</p>
                <div className="text-slate-400 text-[11px]">Territories: {p.icp.targetStates.join(', ')}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300">Certified Integrations</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.certifiedIntegrations.map((int) => (
                    <span key={int} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[10px]">
                      {int}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Objections & Grounded Answers */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Grounded Sales Objection Scripts
            </h3>

            <div className="space-y-3">
              {p.objectionsAndAnswers.map((obj, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-white text-sm">Q: &quot;{obj.objection}&quot;</div>
                  <p className="text-slate-300 font-mono leading-relaxed pl-3 border-l-2 border-cyan-500">
                    {obj.answer}
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Verified Evidence: {obj.evidence}
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
