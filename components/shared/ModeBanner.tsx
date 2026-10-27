'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ShieldAlert } from 'lucide-react';

/**
 * This app branch is a staging MVP. Never offer client-side switches that
 * claim demo/mock data is production or that customer actions are live.
 */
export function ModeBanner() {
  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/20 bg-slate-900 px-4 py-2 text-xs shadow-md">
      <span className="font-semibold text-amber-200">STAGING ENVIRONMENT</span>
      <span className="text-slate-300">
        Staging preview · secondary screens still being connected · no live customer outreach or payments
      </span>
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
      title={isActive ? 'Kill switch active: All outgoing AI actions blocked' : 'Emergency stop control'}
    >
      <ShieldAlert className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-rose-400'}`} />
      {isActive ? 'EMERGENCY STOP ACTIVE' : 'Kill Switch (UI only)'}
    </button>
  );
}
