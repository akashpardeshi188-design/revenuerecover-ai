'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { ModeBanner } from '@/components/shared/ModeBanner';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  Building,
  Lock,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function TrialIntelligencePage() {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'DENIED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Live state tracking trial abuse metrics
  const [queue, setQueue] = useState([
    {
      id: 'REV-1049',
      businessId: 'BIZ-83920',
      businessName: 'Lone Star Climate Pros',
      userEmail: 'manager@lonestarheating.example.com',
      userPhone: '(817) 555-0192',
      riskScore: 65,
      identityConfidence: 0.88,
      reason: 'Multiple email signups under same verified phone and domain.',
      status: 'PENDING',
      signals: ['Same verified business phone: +18175550192', 'Matching domain: lonestarheating.example.com'],
      createdAt: '2026-09-02T22:15:00Z',
    },
    {
      id: 'REV-1050',
      businessId: 'BIZ-94112',
      businessName: 'Apex Plumbing & Rooter',
      userEmail: 'tech@apexplumbingpros.com',
      userPhone: '(214) 555-0142',
      riskScore: 92,
      identityConfidence: 0.95,
      reason: 'Existing Paid Customer attempted secondary free trial signup.',
      status: 'DENIED',
      signals: ['Existing Paid Customer ($119/mo Growth)', 'Exact domain match: apexplumbingpros.com'],
      createdAt: '2026-09-02T23:30:00Z',
    },
    {
      id: 'REV-1051',
      businessId: 'BIZ-11082',
      businessName: 'Sun Valley AC & Heating',
      userEmail: 'owner@sunvalleyair.com',
      userPhone: '(480) 555-0911',
      riskScore: 12,
      identityConfidence: 0.98,
      reason: 'New verified business entity in Phoenix, AZ.',
      status: 'APPROVED',
      signals: ['New verified domain', 'Clean IP & Device telemetry'],
      createdAt: '2026-09-03T00:10:00Z',
    },
  ]);

  const handleResolve = (id: string, action: 'APPROVED' | 'DENIED') => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  };

  const filteredQueue = queue.filter((item) => {
    const matchesFilter = filter === 'ALL' || item.status === filter;
    const matchesSearch =
      item.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.businessId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />
      <GrowthNav />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Canonical Business Identity Protection
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Trial Intelligence & Abuse Prevention Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Enforcing <strong>ONE VERIFIED BUSINESS = ONE FREE TRIAL</strong> across 150–200 lead allocations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              Active Protection: 100% Online
            </span>
          </div>
        </div>

        {/* Top 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Trial Requests</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">1,420</div>
            <div className="text-[10px] text-emerald-400 font-semibold">92.4% Auto-Approved</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Abuse Attempts Blocked</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400 font-mono">108</div>
            <div className="text-[10px] text-slate-400">Duplicate domain / phone matches</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Lead Quota Protected</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">21,600 Leads</div>
            <div className="text-[10px] text-slate-400">Saved from repeated trial ingestion</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Trial-to-Paid Conversion</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">28.8%</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Healthy Unit Economics</div>
          </div>
        </div>

        {/* 30-DAY 25% DECAYING TRIAL QUOTA ENGINE BREAKDOWN */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase">
                <Sparkles className="w-3 h-3" /> Founder Innovation: 30-Day 25% Decaying Quota Engine
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Dynamic Urgency & Progressive Trial Monetization Model
              </h3>
            </div>
            <span className="text-xs text-slate-400">Enforced Server-Side</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Month 1 (Days 1–30)</span>
              <div className="text-xl font-black text-white font-mono">200 Leads <span className="text-xs text-emerald-400 font-normal">(100% Quota)</span></div>
              <p className="text-[10px] text-slate-400 leading-tight">Full initial introductory trial capacity unlocked on 1-click.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/40 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Month 2 (Days 31–60)</span>
              <div className="text-xl font-black text-white font-mono">150 Leads <span className="text-xs text-amber-400 font-normal">(25% Decayed)</span></div>
              <p className="text-[10px] text-slate-400 leading-tight">Capacity naturally reduces by 25% if not upgraded to $119/mo.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-orange-500/40 space-y-1">
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Month 3 (Days 61–90)</span>
              <div className="text-xl font-black text-white font-mono">100 Leads <span className="text-xs text-orange-400 font-normal">(50% Decayed)</span></div>
              <p className="text-[10px] text-slate-400 leading-tight">Contractor sees diminishing capacity; high urgency to upgrade.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-red-500/40 space-y-1">
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Month 4 (Days 91–120)</span>
              <div className="text-xl font-black text-white font-mono">50 Leads <span className="text-xs text-red-400 font-normal">(75% Decayed)</span></div>
              <p className="text-[10px] text-slate-400 leading-tight">Final 50 leads before full trial expiration (Day 121+: 0 leads).</p>
            </div>
          </div>
        </div>

        {/* Manual Review Queue Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> Trial Eligibility & Review Queue
              </h3>
              <p className="text-xs text-slate-400">
                Flagged signups requiring identity validation or admin override.
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search business or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl text-[11px] font-semibold">
                {(['ALL', 'PENDING', 'APPROVED', 'DENIED'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      filter === tab ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Business & Entity ID</th>
                  <th className="p-3.5">User Email & Phone</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Identity Reason</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Founder Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{item.businessName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.businessId}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-200">{item.userEmail}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.userPhone}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                          item.riskScore >= 80
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : item.riskScore >= 50
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {item.riskScore} / 100
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs text-slate-300 text-[11px]">
                      {item.reason}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : item.status === 'DENIED'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {item.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleResolve(item.id, 'APPROVED')}
                            className="py-1 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleResolve(item.id, 'DENIED')}
                            className="py-1 px-2.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-bold text-[10px] transition border border-red-500/40"
                          >
                            Deny
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Resolved</span>
                      )}
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
