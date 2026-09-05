'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/marketing/Navbar';
import {
  Users,
  Flame,
  PhoneCall,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Clock,
  Send,
  Zap,
  Filter,
  ShieldCheck,
} from 'lucide-react';

interface DisplayOpportunity {
  id: string;
  customerName: string;
  customerPhone: string;
  tradeCategory: string;
  summary: string;
  urgency: 'EMERGENCY' | 'HIGH' | 'MEDIUM';
  estimatedValueUSD: number;
  score: number;
  classification: 'HOT' | 'WARM' | 'COLD';
  sources: string[];
  stage: 'INBOX' | 'ATTEMPTED_CONTACT' | 'APPOINTMENT_SCHEDULED' | 'WON_RECOVERED';
  timestamp: string;
}

export default function ContractorLeadsDashboard() {
  const [opportunities, setOpportunities] = useState<DisplayOpportunity[]>([
    {
      id: 'opp_9021',
      customerName: 'Robert Vance (Dallas, TX)',
      customerPhone: '+1 (214) 555-0144',
      tradeCategory: 'HVAC',
      summary: 'Emergency AC Repair — Compressor failure on 98°F day',
      urgency: 'EMERGENCY',
      estimatedValueUSD: 1200,
      score: 95,
      classification: 'HOT',
      sources: ['Missed Call (2:14 PM)', 'Website Form (2:16 PM)'],
      stage: 'INBOX',
      timestamp: '8 mins ago',
    },
    {
      id: 'opp_8842',
      customerName: 'Claire Stanfield (Fort Worth, TX)',
      customerPhone: '+1 (817) 555-0812',
      tradeCategory: 'PLUMBING',
      summary: 'Water heater leaking into basement utility room',
      urgency: 'HIGH',
      estimatedValueUSD: 850,
      score: 88,
      classification: 'HOT',
      sources: ['Missed Call (1:45 PM)'],
      stage: 'ATTEMPTED_CONTACT',
      timestamp: '32 mins ago',
    },
    {
      id: 'opp_7923',
      customerName: 'David Miller (Plano, TX)',
      customerPhone: '+1 (972) 555-0391',
      tradeCategory: 'ELECTRICAL',
      summary: 'Main panel upgrade & EV charger installation quote',
      urgency: 'MEDIUM',
      estimatedValueUSD: 2400,
      score: 72,
      classification: 'WARM',
      sources: ['Inbound Email Quote Request'],
      stage: 'APPOINTMENT_SCHEDULED',
      timestamp: '1 hour ago',
    },
  ]);

  const totalValue = opportunities.reduce((sum, o) => sum + o.estimatedValueUSD, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Top Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <Users className="w-3.5 h-3.5" /> Contractor Lead Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Captured Customer Opportunities &amp; Missed Calls
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              High-intent homeowner leads ingested from missed phone calls, website forms, and AI recovery text-backs.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Opportunities</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{opportunities.length} Leads</div>
            <div className="text-[10px] text-emerald-400 font-bold">100% Ingested in Real-Time</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>🔥 Hot Leads (80+ Score)</span>
              <Flame className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400 font-mono">
              {opportunities.filter((o) => o.classification === 'HOT').length} Emergency
            </div>
            <div className="text-[10px] text-slate-400">Immediate 45-sec outreach active</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pipeline Revenue at Risk</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">${totalValue} USD</div>
            <div className="text-[10px] text-emerald-400 font-bold">₹{Math.round(totalValue * 83.5).toLocaleString()} INR</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>AI Conversion Rate</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400 font-mono">71.4%</div>
            <div className="text-[10px] text-cyan-400">Avg. 45s SMS response time</div>
          </div>
        </div>

        {/* Opportunities Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Inbound Master Opportunities
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Live Stream Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Customer &amp; Contact</th>
                  <th className="p-3">Trade &amp; Issue Summary</th>
                  <th className="p-3">Est. Value</th>
                  <th className="p-3">Multi-Touch Sources</th>
                  <th className="p-3">AI Lead Score</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-white">
                      <div>{opp.customerName}</div>
                      <div className="text-[11px] text-emerald-400 font-mono font-normal">
                        {opp.customerPhone}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-200 font-medium">{opp.summary}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300">
                        {opp.tradeCategory}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400 text-sm">
                      ${opp.estimatedValueUSD}
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5">
                        {opp.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="text-[10px] text-cyan-300 font-mono bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/40"
                          >
                            {src}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            opp.classification === 'HOT'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {opp.score}/100 {opp.classification}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300">
                        {opp.stage}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition shadow">
                        Dispatch Tech
                      </button>
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
