'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowRight,
  PhoneCall,
  FileText,
  CreditCard,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { state, triggerOpportunityAction, markOpportunityRecovered } = useAppStore();

  const activeOpportunities = state.opportunities.filter((o) => o.status !== 'recovered' && o.status !== 'dismissed');
  const recoveredOpportunities = state.opportunities.filter((o) => o.status === 'recovered');

  const totalAtRisk = activeOpportunities.reduce((acc, curr) => acc + curr.estimated_value, 0);
  const totalIdentified = state.opportunities.reduce((acc, curr) => acc + curr.estimated_value, 0);
  const recoveryRate = state.opportunities.length > 0
    ? Math.round((recoveredOpportunities.length / state.opportunities.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <DashboardNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Revenue Recovery Dashboard</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI Employee Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time financial leakage diagnostics and automated follow-ups for {state.organization.name}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/opportunities"
                className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" /> View All Opportunities ({activeOpportunities.length})
              </Link>
            </div>
          </div>

          {/* KPI CARDS RIBBON */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: CONFIRMED REVENUE RECOVERED */}
            <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span className="text-emerald-400">CONFIRMED RECOVERED</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mt-2">
                ${state.organization.monthly_recovered.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Verified Stripe / CRM transactions</span>
              </div>
            </div>

            {/* KPI 2: REVENUE AT RISK */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>REVENUE AT RISK</span>
                <AlertCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-2">
                ${totalAtRisk.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">
                Across {activeOpportunities.length} pending unbooked quotes & calls
              </div>
            </div>

            {/* KPI 3: ESTIMATED RECOVERY OPPORTUNITY */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>EST. RECOVERY POTENTIAL</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-2">
                ${totalIdentified.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">
                Lifetime identified pipeline upside
              </div>
            </div>

            {/* KPI 4: RECOVERY RATE */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>RECOVERY RATE</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                {recoveryRate}%
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                {recoveredOpportunities.length} jobs saved from leaving
              </div>
            </div>
          </div>

          {/* SECONDARY METRICS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="text-slate-400">AI Follow-ups Sent</div>
              <div className="text-lg font-bold text-white mt-0.5">142 actions</div>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="text-slate-400">Customer Responses</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">68 replies (48%)</div>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="text-slate-400">Appointments Recovered</div>
              <div className="text-lg font-bold text-cyan-400 mt-0.5">19 booked</div>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="text-slate-400">AI Mode & Safety</div>
              <div className="text-lg font-bold text-purple-400 mt-0.5 capitalize">
                {state.businessRules.autopilot_mode}
              </div>
            </div>
          </div>

          {/* ACTIVE OPPORTUNITY FEED WITH 1-CLICK ACTION */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Active High-Priority Opportunities</h3>
                <p className="text-xs text-slate-400">
                  AI automatically detected these leaks. Click 1-Click Follow-up to dispatch or test message.
                </p>
              </div>
              <Link
                href="/dashboard/opportunities"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                Manage All ({activeOpportunities.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {activeOpportunities.slice(0, 4).map((opp) => (
                <div
                  key={opp.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">{opp.customer_name}</span>
                      <span className="text-xs text-slate-400">{opp.customer_phone}</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                        {opp.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                        Score: {opp.recovery_score}/100
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                      &quot;{opp.recommended_action}&quot;
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span>Source: {opp.source}</span>
                      <span>•</span>
                      <span>Channel: {opp.recommended_channel.toUpperCase()}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{opp.score_reasons[0]}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    <div className="text-right sm:mr-3">
                      <div className="text-base font-black text-white">${opp.estimated_value.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">Estimated Ticket</div>
                    </div>

                    <button
                      onClick={() => triggerOpportunityAction(opp.id)}
                      className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                    >
                      <Send className="w-3 h-3" /> 1-Click Follow-up
                    </button>

                    <button
                      onClick={() => markOpportunityRecovered(opp.id)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                      title="Mark as confirmed recovered in CRM"
                    >
                      Confirm Recovered
                    </button>
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
