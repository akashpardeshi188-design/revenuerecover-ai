'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import {
  Users,
  Search,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Tag,
} from 'lucide-react';

export default function CustomersPage() {
  const { state } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(state.customers[0]?.id || null);

  const filteredCustomers = state.customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const selectedCustomer = state.customers.find((c) => c.id === selectedCustomerId) || state.customers[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <DashboardNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Customer Database & CRM</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Full customer lifecycle, lifetime value, and historical AI recovery records.
              </p>
            </div>

            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Customer List */}
            <div className="lg:col-span-6 space-y-3">
              {filteredCustomers.map((cust) => {
                const isSelected = cust.id === selectedCustomer?.id;
                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`p-5 rounded-3xl border cursor-pointer transition shadow-lg ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-base">{cust.name}</h4>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        LTV: ${cust.lifetime_value.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1 font-mono">{cust.phone}</span>
                      <span>•</span>
                      <span className="truncate max-w-[180px]">{cust.email}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {cust.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold text-slate-300 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Customer Dossier */}
            <div className="lg:col-span-6">
              {selectedCustomer && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl sticky top-24">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedCustomer.name}</h3>
                      <p className="text-xs text-slate-400">{selectedCustomer.address || 'Dallas, TX'}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                      {selectedCustomer.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <div className="text-slate-400">Lifetime Value</div>
                      <div className="text-lg font-black text-white mt-0.5">
                        ${selectedCustomer.lifetime_value.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <div className="text-slate-400">Total Completed Jobs</div>
                      <div className="text-lg font-black text-white mt-0.5">
                        {selectedCustomer.total_purchases} past jobs
                      </div>
                    </div>
                  </div>

                  {/* AI Intelligence Summary */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> AI Customer Intelligence Summary
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      {selectedCustomer.ai_summary}
                    </p>
                  </div>

                  {/* Next Recommended Action */}
                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-emerald-400">Next Recommended Action</div>
                    <p className="text-xs text-white font-medium">
                      {selectedCustomer.next_recommended_action}
                    </p>
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
