'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { LeadGenerationAgent } from '@/lib/agents/lead-generation-agent';
import {
  Target,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Globe,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export default function LeadGenPage() {
  const { state, addNewProspectLead } = useAppStore();

  const [industry, setIndustry] = useState('HVAC');
  const [targetState, setTargetState] = useState('Texas');
  const [city, setCity] = useState('Dallas');
  const [isSearching, setIsSearching] = useState(false);
  const [discoveredPool, setDiscoveredPool] = useState<ReturnType<typeof LeadGenerationAgent.discoverProspects> extends Promise<infer T> ? T : never>([]);

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    const results = await LeadGenerationAgent.discoverProspects({
      industry,
      state: targetState,
      city,
    });

    setDiscoveredPool(results);
    setIsSearching(false);
  };

  const handleAddLead = (lead: (typeof discoveredPool)[0]) => {
    addNewProspectLead(lead);
    setDiscoveredPool((prev) => prev.filter((p) => p.id !== lead.id));
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
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Lead Generation Center</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Discover and score verified US service businesses based on publicly observable business signals.
              </p>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Public Directory & Verified API Sources Only (No Private Scraping)</span>
            </div>
          </div>

          {/* Search Query Form */}
          <form
            onSubmit={handleDiscover}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
          >
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" /> AI Prospect Discovery Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="HVAC">HVAC & AC Repair</option>
                  <option value="Plumbing">Plumbing Services</option>
                  <option value="Electrical">Electrical Contractors</option>
                  <option value="Roofing">Roofing & Solar</option>
                  <option value="Dental">Dental Clinic</option>
                  <option value="Med Spa">Med Spa & Aesthetic</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">State</label>
                <select
                  value={targetState}
                  onChange={(e) => setTargetState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Texas">Texas</option>
                  <option value="Florida">Florida</option>
                  <option value="Arizona">Arizona</option>
                  <option value="California">California</option>
                  <option value="Ohio">Ohio</option>
                  <option value="North Carolina">North Carolina</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Metro / City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dallas, Fort Worth, Phoenix"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSearching}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" /> Scanning Approved Directories...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Discover & Score Prospects
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Discovered Pool Results */}
          {discoveredPool.length > 0 && (
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base">Discovered Verified Prospects ({discoveredPool.length})</h3>
                  <p className="text-xs text-slate-400">Calculated AI Lead Scores (0–100) and revenue leak estimates</p>
                </div>
              </div>

              <div className="space-y-3">
                {discoveredPool.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-base">{lead.business_name}</span>
                        <span className="text-xs text-slate-400">{lead.city}, {lead.state}</span>
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {lead.industry}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          Score: {lead.lead_score}/100 ({lead.tier.toUpperCase()})
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-mono">
                        Leakage: <strong className="text-emerald-400">${lead.estimated_leakage.toLocaleString()}/mo</strong> • Pitch: &quot;{lead.research_dossier?.recommended_pitch}&quot;
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddLead(lead)}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Add to Sales Pipeline
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Saved Pipeline Leads */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base">Active Prospect Database ({state.prospectLeads.length})</h3>

            <div className="divide-y divide-slate-800/80">
              {state.prospectLeads.map((lead) => (
                <div key={lead.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{lead.business_name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {lead.city}, {lead.state}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        Score: {lead.lead_score}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-1">
                      Stage: <strong className="text-white uppercase font-mono">{lead.stage.replace('_', ' ')}</strong> • Next: {lead.next_action}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-emerald-400 font-mono text-sm">
                      ${lead.estimated_leakage.toLocaleString()}/mo
                    </div>
                    <div className="text-[10px] text-slate-500">Estimated Opportunity</div>
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
