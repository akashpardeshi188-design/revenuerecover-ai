'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner, KillSwitchButton } from '@/components/shared/ModeBanner';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { complianceEngine } from '@/lib/compliance';
import {
  Settings,
  ShieldAlert,
  Clock,
  Sliders,
  CheckCircle2,
  Trash2,
  Plus,
  Lock,
} from 'lucide-react';

export default function DashboardSettingsPage() {
  const { state, updateBusinessRules, toggleKillSwitch } = useAppStore();

  const [autopilotMode, setAutopilotMode] = useState(state.businessRules.autopilot_mode);
  const [startQuiet, setStartQuiet] = useState(state.businessRules.quiet_hours.start);
  const [endQuiet, setEndQuiet] = useState(state.businessRules.quiet_hours.end);
  const [dailyLimit, setDailyLimit] = useState(state.businessRules.daily_message_limit);
  const [suppressionList, setSuppressionList] = useState<string[]>(complianceEngine.getSuppressionList());
  const [newOptOut, setNewOptOut] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessRules({
      autopilot_mode: autopilotMode,
      quiet_hours: { start: startQuiet, end: endQuiet },
      daily_message_limit: dailyLimit,
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  const handleAddOptOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptOut.trim()) return;
    complianceEngine.addOptOut(newOptOut);
    setSuppressionList(complianceEngine.getSuppressionList());
    setNewOptOut('');
  };

  const handleRemoveOptOut = (item: string) => {
    complianceEngine.removeOptOut(item);
    setSuppressionList(complianceEngine.getSuppressionList());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <DashboardNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-5xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Business Rules & Safety Controls</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure AI autopilot autonomy, TCPA quiet hours, daily contact limits, and emergency kill switches.
              </p>
            </div>

            <KillSwitchButton />
          </div>

          {savedBanner && (
            <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* AUTOPILOT MODE SELECTOR */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" /> AI Autopilot Execution Mode
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div
                  onClick={() => setAutopilotMode('copilot')}
                  className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition ${
                    autopilotMode === 'copilot'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-emerald-400 font-bold text-sm">Copilot Mode</div>
                  <p className="text-[11px] leading-relaxed">
                    AI generates recommendations and message drafts. All actions require 1-click human approval.
                  </p>
                </div>

                <div
                  onClick={() => setAutopilotMode('supervised')}
                  className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition ${
                    autopilotMode === 'supervised'
                      ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-cyan-400 font-bold text-sm">Supervised Autopilot</div>
                  <p className="text-[11px] leading-relaxed">
                    Standard low-risk follow-ups execute automatically; sensitive replies are escalated to staff.
                  </p>
                </div>

                <div
                  onClick={() => setAutopilotMode('autopilot')}
                  className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition ${
                    autopilotMode === 'autopilot'
                      ? 'bg-purple-500/20 border-purple-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-purple-400 font-bold text-sm">Full Autopilot</div>
                  <p className="text-[11px] leading-relaxed">
                    Autonomous dispatch within strict compliance rules and daily frequency limits.
                  </p>
                </div>
              </div>
            </div>

            {/* QUIET HOURS & LIMITS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> TCPA Quiet Hours & Frequency Caps
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Quiet Hours Start</label>
                  <input
                    type="time"
                    value={startQuiet}
                    onChange={(e) => setStartQuiet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                  <div className="text-[10px] text-slate-500">Default: 21:00 (9 PM)</div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Quiet Hours End</label>
                  <input
                    type="time"
                    value={endQuiet}
                    onChange={(e) => setEndQuiet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                  <div className="text-[10px] text-slate-500">Default: 08:00 (8 AM)</div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Max Messages Per Customer/Day</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                  <div className="text-[10px] text-slate-500">Anti-spam cap</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
              >
                Save Business Rules
              </button>
            </div>
          </form>

          {/* SUPPRESSION & OPT-OUT MANAGER */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" /> Opt-out & Suppression List (TCPA / CAN-SPAM)
            </h3>
            <p className="text-xs text-slate-400">
              Numbers and emails on this list are permanently blocked from all outgoing automated messaging.
            </p>

            <form onSubmit={handleAddOptOut} className="flex gap-2">
              <input
                type="text"
                value={newOptOut}
                onChange={(e) => setNewOptOut(e.target.value)}
                placeholder="Add phone or email to suppress (e.g. (555) 019-9999)..."
                className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Suppressed Contact
              </button>
            </form>

            <div className="space-y-1.5 pt-2">
              {suppressionList.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveOptOut(item)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
