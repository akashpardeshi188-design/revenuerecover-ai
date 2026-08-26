'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { PipelineStage, ProspectLead } from '@/lib/types';
import {
  Users,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Send,
  Building,
  Phone,
  Globe,
  Tag,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export default function PipelinePage() {
  const { state, updateLeadStage } = useAppStore();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(state.prospectLeads[0]?.id || null);

  const stages: { key: PipelineStage; label: string }[] = [
    { key: 'new_lead', label: 'New Lead' },
    { key: 'qualified', label: 'Qualified' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'engaged', label: 'Engaged' },
    { key: 'demo', label: 'Demo / Sandbox' },
    { key: 'trial', label: '14-Day Trial' },
    { key: 'won', label: 'Won / Customer' },
  ];

  const selectedLead = state.prospectLeads.find((l) => l.id === selectedLeadId) || state.prospectLeads[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <GrowthNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Sales Pipeline (CRM)</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage prospect stage transitions, view AI intelligence dossiers, and trigger sales follow-up.
              </p>
            </div>
          </div>

          {/* Kanban Stage Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto pb-2">
            {stages.map((st) => {
              const count = state.prospectLeads.filter((l) => l.stage === st.key).length;
              return (
                <div
                  key={st.key}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs space-y-1 shrink-0"
                >
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{st.label}</div>
                  <div className="text-lg font-black text-white font-mono">{count}</div>
                </div>
              );
            })}
          </div>

          {/* Pipeline Lead Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Leads List */}
            <div className="lg:col-span-6 space-y-3">
              {state.prospectLeads.map((lead) => {
                const isSelected = lead.id === selectedLead?.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`p-5 rounded-3xl border cursor-pointer transition shadow-xl space-y-3 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base">{lead.business_name}</h4>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        ${lead.estimated_leakage.toLocaleString()}/mo
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>{lead.city}, {lead.state}</span>
                      <span>•</span>
                      <span>Score: <strong className="text-cyan-400">{lead.lead_score}</strong> ({lead.tier.toUpperCase()})</span>
                    </div>

                    {/* Stage Selector */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-400 font-mono">Stage: <strong className="text-white uppercase">{lead.stage.replace('_', ' ')}</strong></span>

                      <select
                        value={lead.stage}
                        onChange={(e) => updateLeadStage(lead.id, e.target.value as PipelineStage)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-cyan-300 focus:outline-none"
                      >
                        {stages.map((s) => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Lead Dossier & Pitch */}
            <div className="lg:col-span-6">
              {selectedLead && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl sticky top-24">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedLead.business_name}</h3>
                      <p className="text-xs text-slate-400">{selectedLead.city}, {selectedLead.state} • {selectedLead.industry}</p>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                      Score: {selectedLead.lead_score}/100
                    </span>
                  </div>

                  {/* AI Research Signals */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Observable Business Signals
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {selectedLead.research_dossier?.signals.map((sig, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Personalized Outreach Pitch */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="text-xs font-bold text-cyan-400">Personalized Sales Pitch Angle</div>
                    <p className="text-slate-300 font-mono leading-relaxed">
                      &quot;{selectedLead.research_dossier?.recommended_pitch}&quot;
                    </p>
                  </div>

                  {/* Quick Action Button */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-xs text-slate-400">
                      Next Action: <strong className="text-white">{selectedLead.next_action}</strong>
                    </div>

                    <button
                      onClick={() => updateLeadStage(selectedLead.id, 'won')}
                      className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
                    >
                      Convert to Paid Customer ($149 MRR)
                    </button>
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
