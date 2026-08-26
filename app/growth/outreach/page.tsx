'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { FollowUpAgent } from '@/lib/agents/followup-agent';
import {
  Send,
  Sparkles,
  Mail,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export default function OutreachSequencerPage() {
  const { state } = useAppStore();
  const [selectedProspectId, setSelectedProspectId] = useState<string>(state.prospectLeads[0]?.id || '');
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  const selectedProspect = state.prospectLeads.find((p) => p.id === selectedProspectId) || state.prospectLeads[0];
  const sequenceSteps = selectedProspect ? FollowUpAgent.generateSequence(selectedProspect) : [];

  const handleDispatchCampaign = () => {
    setDispatchedSuccess(true);
    setTimeout(() => setDispatchedSuccess(false), 2500);
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
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Outreach & Sales Sequencer</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate and dispatch hyper-personalized 5-touch outreach sequences based on verified public business signals.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Target Prospect:</span>
              <select
                value={selectedProspectId}
                onChange={(e) => setSelectedProspectId(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {state.prospectLeads.map((p) => (
                  <option key={p.id} value={p.id}>{p.business_name} ({p.city})</option>
                ))}
              </select>
            </div>
          </div>

          {dispatchedSuccess && (
            <div className="p-3.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Sequence step #1 scheduled and dispatched via compliance gateway!
            </div>
          )}

          {/* Sequence Steps Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                5-Touch Sequence for {selectedProspect?.business_name}
              </h3>

              <button
                onClick={handleDispatchCampaign}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch Outreach Sequence
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sequenceSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white text-sm">
                        Day {step.day}: {step.type}
                      </span>
                    </div>

                    <span className="uppercase text-[10px] font-mono font-bold bg-slate-950 px-2 py-0.5 rounded text-slate-300 border border-slate-800">
                      Channel: {step.channel}
                    </span>
                  </div>

                  {step.subject && (
                    <div className="text-xs font-semibold text-slate-300">
                      Subject: <span className="text-white font-normal">{step.subject}</span>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {step.body}
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
