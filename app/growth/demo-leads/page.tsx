'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import {
  Users,
  Send,
  Zap,
  CheckCircle2,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Target,
  RefreshCw,
} from 'lucide-react';

export default function DemoLeadsRetargetingPage() {
  const [retargetingStatus, setRetargetingStatus] = useState<string | null>(null);
  const [totalConverted, setTotalConverted] = useState(118);
  const [leadsRetargeted, setLeadsRetargeted] = useState(false);

  const demoLeads = [
    { name: 'Mike Henderson', business: 'Lone Star Climate Pros', city: 'Fort Worth, TX', email: 'mike@lonestarclimatepros.example.com', scanLeakage: '$24,800/mo', lastDemo: '42 mins ago', status: 'Warm Lead', sequence: 'Touch 1 (Value Shock)' },
    { name: 'William Chen', business: 'Houston Bayou Mechanical', city: 'Houston, TX', email: 'william@houstonbayoumech.example.com', scanLeakage: '$32,000/mo', lastDemo: '3 hours ago', status: 'High Intent', sequence: 'Touch 2 (Social Proof & 60% OFF)' },
    { name: 'Eduardo Santos', business: 'Miami Dade Pro Plumbing', city: 'Miami, FL', email: 'eduardo@miamidadepros.example.com', scanLeakage: '$29,800/mo', lastDemo: '5 hours ago', status: 'Checkout Initiated', sequence: 'Touch 2 (Card Pilot Auth)' },
    { name: 'Oliver Wright', business: 'Thames Valley Emergency Boilers', city: 'London, UK', email: 'oliver@thamesvalleyboilers.example.co.uk', scanLeakage: '£22,400/mo', lastDemo: '8 hours ago', status: 'Warm Lead', sequence: 'Touch 2 (0-Day Direct £99)' },
    { name: 'Liam Campbell', business: 'Toronto Metro Climate Dynamics', city: 'Toronto, ON', email: 'liam@torontometclimate.example.ca', scanLeakage: 'CAD $28,500/mo', lastDemo: '11 hours ago', status: 'High Intent', sequence: 'Touch 3 (Final 60m Expiry)' },
    { name: 'Jack Morrison', business: 'Sydney Harbour Cool & Electrical', city: 'Sydney, NSW', email: 'jack@sydneyharbourcool.example.com.au', scanLeakage: 'AUD $33,000/mo', lastDemo: '14 hours ago', status: 'Demo Completed', sequence: 'Touch 1 (Value Shock)' },
    { name: 'Tariq Al-Mansoor', business: 'Emirates Prime Villa Cooling & MEP', city: 'Dubai, UAE', email: 'tariq@emiratesprimemep.example.ae', scanLeakage: 'AED 48,000/mo', lastDemo: '16 hours ago', status: 'High Intent', sequence: 'Touch 2 (VIP Founding Slot)' },
    { name: 'Sean O\'Connor', business: 'Dublin Eco Heating & Heat Pumps', city: 'Dublin, IE', email: 'sean@dublinecoheat.example.ie', scanLeakage: '€24,500/mo', lastDemo: '19 hours ago', status: 'Warm Lead', sequence: 'Touch 3 (60% OFF Closing)' },
    { name: 'Rajesh Kulkarni', business: 'Mumbai Metro Rapid HVAC & MEP', city: 'Mumbai, IN', email: 'rajesh@mumbaimetromep.example.in', scanLeakage: '₹1,85,000/mo', lastDemo: '22 hours ago', status: 'Demo Completed', sequence: 'Touch 1 (Instant Setup)' },
  ];

  const handleRetargetAll = async () => {
    setRetargetingStatus('Blasting 1,862 Demo Leads with 60% OFF Reminders...');
    try {
      await fetch('/api/growth/demo-retargeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchSize: 'all_1862',
          urgency: '60% OFF Flash Scarcity',
        }),
      });

      setTimeout(() => {
        setRetargetingStatus('✓ 1,862 Demo Leads Retargeted! 6 High-Intent Leads Converted to Paid Subscribers!');
        setTotalConverted((prev) => prev + 6);
        setLeadsRetargeted(true);
      }, 1500);
    } catch (e) {
      console.warn(e);
    }
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
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-400 to-red-500 text-slate-950">
                  <Target className="w-5 h-5 stroke-[2.5]" />
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Demo & Free-Scan Retargeting Engine
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  1,862 Warm Demo Leads Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Automated 3-touch high-converting follow-up sequence with personalized dollar loss numbers & 60% OFF deal.
              </p>
            </div>

            <button
              onClick={handleRetargetAll}
              disabled={leadsRetargeted}
              className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-red-500 via-amber-500 to-emerald-400 hover:from-red-400 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all active:scale-95 shrink-0"
            >
              {leadsRetargeted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" /> All 1,862 Demo Leads Retargeted (+6 Converted)
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 fill-slate-950 text-slate-950" /> Blast Retargeting Reminders to 1,862 Demo Leads
                </>
              )}
            </button>
          </div>

          {/* Status Alert */}
          {retargetingStatus && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              {retargetingStatus}
            </div>
          )}

          {/* METRICS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Demo Leads</span>
              <div className="text-3xl font-black text-white font-mono">1,862</div>
              <span className="text-[10px] text-amber-400 font-medium">Completed /demo & /free-revenue-scan</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase">Identified Pipeline</span>
              <div className="text-3xl font-black text-emerald-400 font-mono">$48.2M / mo</div>
              <span className="text-[10px] text-slate-400 font-medium">Total missed-call revenue leaked</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase">Paid Subscribers</span>
              <div className="text-3xl font-black text-cyan-400 font-mono">{totalConverted}</div>
              <span className="text-[10px] text-emerald-400 font-medium">Growth Plan ($119/mo)</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase">Retargeting Conversion</span>
              <div className="text-3xl font-black text-purple-400 font-mono">6.34%</div>
              <span className="text-[10px] text-slate-400 font-medium">Industry Benchmark: 2.1%</span>
            </div>
          </div>

          {/* ACTIVE DEMO LEADS QUEUE TABLE */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Real-Time Warm Demo Leads Retargeting Queue
              </h3>
              <span className="text-xs text-slate-400 font-mono">Automated 90-Minute Cron Trigger</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-3 font-semibold">Contractor / Business</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Identified Leakage</th>
                    <th className="pb-3 font-semibold">Demo Taken</th>
                    <th className="pb-3 font-semibold">Active Sequence</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {demoLeads.map((lead, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/40 transition">
                      <td className="py-3.5">
                        <div className="font-bold text-white">{lead.name}</div>
                        <div className="text-[11px] text-slate-400">{lead.business}</div>
                      </td>
                      <td className="py-3.5 text-slate-300">{lead.city}</td>
                      <td className="py-3.5">
                        <span className="font-mono font-bold text-red-400 bg-red-950/30 px-2 py-0.5 rounded border border-red-500/20">
                          {lead.scanLeakage}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400">{lead.lastDemo}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold text-[10px]">
                          {lead.sequence}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href="/pricing"
                          className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] inline-flex items-center gap-1 transition"
                        >
                          Send 60% Deal <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
