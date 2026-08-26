'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import {
  Layers,
  CheckCircle2,
  RefreshCw,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export default function DashboardIntegrationsPage() {
  const { state } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <DashboardNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Active Integrations Hub</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Connected data pipelines syncing quotes, missed calls, dispatched calendars, and customer records.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-time webhook sync active</span>
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.integrations.map((int) => (
              <div
                key={int.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                      {int.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        int.status === 'connected'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {int.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{int.name}</h3>

                  <div className="space-y-1 text-xs text-slate-400 font-mono">
                    <div>Mode: <strong className="text-white uppercase">{int.mode}</strong></div>
                    {int.last_sync_at && (
                      <div>Last Sync: {new Date(int.last_sync_at).toLocaleTimeString()}</div>
                    )}
                    {int.sync_count && (
                      <div>Total Synced Records: {int.sync_count.toLocaleString()}</div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => alert(`Syncing ${int.name}... Complete!`)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Test & Sync Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
