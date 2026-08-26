'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Filter,
  DollarSign,
  PhoneCall,
  FileText,
  CreditCard,
  Flame,
  Calendar,
  X,
  Edit,
} from 'lucide-react';

export default function OpportunitiesPage() {
  const { state, triggerOpportunityAction, markOpportunityRecovered } = useAppStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [editingOppId, setEditingOppId] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState<string>('');

  const filteredOpportunities = state.opportunities.filter((opp) => {
    if (filterType === 'all') return true;
    if (filterType === 'active') return opp.status !== 'recovered';
    if (filterType === 'recovered') return opp.status === 'recovered';
    return opp.type === filterType;
  });

  const handleStartEdit = (id: string, defaultAction: string) => {
    setEditingOppId(id);
    setCustomMsg(defaultAction);
  };

  const handleSendCustom = (id: string) => {
    triggerOpportunityAction(id, customMsg);
    setEditingOppId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <DashboardNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Revenue Opportunities Hub</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                All 16 detected leakage types with AI recovery scores, reasoning, and 1-click execution.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-semibold text-slate-400">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl transition ${filterType === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:text-white'}`}
              >
                All ({state.opportunities.length})
              </button>
              <button
                onClick={() => setFilterType('active')}
                className={`px-3 py-1.5 rounded-xl transition ${filterType === 'active' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:text-white'}`}
              >
                Active Leaks
              </button>
              <button
                onClick={() => setFilterType('abandoned_quote')}
                className={`px-3 py-1.5 rounded-xl transition ${filterType === 'abandoned_quote' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:text-white'}`}
              >
                Abandoned Quotes
              </button>
              <button
                onClick={() => setFilterType('missed_call')}
                className={`px-3 py-1.5 rounded-xl transition ${filterType === 'missed_call' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:text-white'}`}
              >
                Missed Calls
              </button>
              <button
                onClick={() => setFilterType('recovered')}
                className={`px-3 py-1.5 rounded-xl transition ${filterType === 'recovered' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:text-white'}`}
              >
                Recovered
              </button>
            </div>
          </div>

          {/* Opportunities List */}
          <div className="space-y-4">
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className={`bg-slate-900 border rounded-3xl p-6 space-y-4 shadow-xl transition ${
                  opp.status === 'recovered'
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-base text-white">{opp.customer_name}</span>
                    <span className="text-xs text-slate-400 font-mono">{opp.customer_phone}</span>
                    <span className="text-xs text-slate-400 font-mono">{opp.customer_email}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                      {opp.type.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      opp.status === 'recovered' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      Status: {opp.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-slate-400">
                      Score: <span className="font-bold text-emerald-400">{opp.recovery_score}/100</span>
                    </div>
                    <div className="text-slate-400">
                      Value: <span className="font-bold text-white text-sm">${opp.estimated_value.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Score Reasons & Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="md:col-span-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      AI Follow-up Strategy
                    </div>
                    {editingOppId === opp.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={customMsg}
                          onChange={(e) => setCustomMsg(e.target.value)}
                          className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingOppId(null)}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendCustom(opp.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold"
                          >
                            Send Custom Message
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-200 font-mono text-xs leading-relaxed">
                        &quot;{opp.recommended_action}&quot;
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Recovery Factors
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {opp.score_reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="text-slate-400 flex items-center gap-2">
                    <span>Source: {opp.source}</span>
                    <span>•</span>
                    <span>Channel: {opp.recommended_channel.toUpperCase()}</span>
                    <span>•</span>
                    <span>Created: {new Date(opp.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingOppId !== opp.id && (
                      <button
                        onClick={() => handleStartEdit(opp.id, opp.recommended_action)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit customized message"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {opp.status !== 'recovered' ? (
                      <>
                        <button
                          onClick={() => triggerOpportunityAction(opp.id)}
                          className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" /> 1-Click Follow-up
                        </button>
                        <button
                          onClick={() => markOpportunityRecovered(opp.id)}
                          className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
                        >
                          Mark Recovered
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Recovered +${opp.recovered_amount?.toLocaleString() || opp.estimated_value.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
