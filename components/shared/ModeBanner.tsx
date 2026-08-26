'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ShieldAlert, Sparkles, Database, RefreshCw } from 'lucide-react';

export function ModeBanner() {
  const { state, setMode, resetToDemo } = useAppStore();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-400">OPERATING ENVIRONMENT:</span>
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setMode('demo')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
              state.mode === 'demo'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            DEMO MODE (Summit HVAC)
          </button>
          <button
            onClick={() => setMode('mock')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
              state.mode === 'mock'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3 h-3 text-amber-400" />
            MOCK ADAPTERS
          </button>
          <button
            onClick={() => setMode('live')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
              state.mode === 'live'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            LIVE MODE
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-400">
        <span className="hidden sm:inline">
          {state.mode === 'demo' && 'Showing fictional Summit HVAC & Plumbing dataset (Dallas, TX)'}
          {state.mode === 'mock' && 'Connected to deterministic simulation endpoints for all 8 AI Agents'}
          {state.mode === 'live' && 'Active production environment with real customer tenant isolation'}
        </span>
        <button
          onClick={resetToDemo}
          title="Reset back to initial pristine demo dataset"
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2 py-1 rounded border border-slate-700 transition"
        >
          <RefreshCw className="w-3 h-3" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
}

export function KillSwitchButton() {
  const { state, toggleKillSwitch } = useAppStore();
  const isActive = state.businessRules.kill_switch_active;

  return (
    <button
      onClick={() => toggleKillSwitch()}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ${
        isActive
          ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
      }`}
      title={isActive ? 'Kill switch active: All outgoing AI actions blocked' : 'Engage Emergency Global Kill Switch'}
    >
      <ShieldAlert className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-rose-400'}`} />
      {isActive ? 'EMERGENCY STOP ACTIVE' : 'Kill Switch (Ready)'}
    </button>
  );
}
