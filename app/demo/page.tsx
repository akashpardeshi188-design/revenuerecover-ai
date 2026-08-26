'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { DemoAgent, DemoSimulationResult } from '@/lib/agents/demo-agent';
import {
  Sparkles,
  Play,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Calendar,
  CreditCard,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export default function InteractiveDemoPage() {
  const [industry, setIndustry] = useState('HVAC & AC Repair');
  const [monthlyLeads, setMonthlyLeads] = useState(100);
  const [avgJobValue, setAvgJobValue] = useState(1200);
  const [missedPercent, setMissedPercent] = useState(15);

  const [simulation, setSimulation] = useState<DemoSimulationResult>(() =>
    DemoAgent.runSimulation({
      industry: 'HVAC & AC Repair',
      monthlyLeads: 100,
      avgJobValue: 1200,
      missedFollowUpPercent: 15,
    })
  );

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleRecalculate = () => {
    const sim = DemoAgent.runSimulation({
      industry,
      monthlyLeads,
      avgJobValue,
      missedFollowUpPercent: missedPercent,
    });
    setSimulation(sim);
    setActiveStepIndex(0);
  };

  const handlePlayFlow = () => {
    setIsPlaying(true);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= simulation.flywheelSteps.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setActiveStepIndex(current);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Sandbox Simulation
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            See the AI Revenue Recovery Employee in Action
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Simulate your exact business parameters and watch how RevenueRecover AI turns missed calls, abandoned quotes, and dormant clients into booked revenue.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Box */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Simulation Inputs</h3>
              <button
                onClick={handleRecalculate}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Recalculate
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Industry / Niche</label>
                <select
                  value={industry}
                  onChange={(e) => {
                    setIndustry(e.target.value);
                    if (e.target.value.includes('Roofing')) setAvgJobValue(4800);
                    else if (e.target.value.includes('Plumbing')) setAvgJobValue(1100);
                    else if (e.target.value.includes('Electrical')) setAvgJobValue(1800);
                    else setAvgJobValue(1400);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="HVAC & AC Repair">HVAC & AC Repair</option>
                  <option value="Plumbing">Plumbing Services</option>
                  <option value="Electrical">Electrical Contractors</option>
                  <option value="Roofing">Roofing & Solar</option>
                  <option value="General Contractors">General Contractors</option>
                  <option value="Dental Clinic">Dental Clinic</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Monthly Inquiries</span>
                  <span className="text-emerald-400 font-bold">{monthlyLeads} leads/mo</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Average Job Value</span>
                  <span className="text-emerald-400 font-bold">${avgJobValue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="8000"
                  step="100"
                  value={avgJobValue}
                  onChange={(e) => setAvgJobValue(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Missed / Uncontacted Rate</span>
                  <span className="text-amber-400 font-bold">{missedPercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={missedPercent}
                  onChange={(e) => setMissedPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* Opportunity Summary Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulated Opportunity
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Missed leads at risk:</span>
                  <span className="text-rose-400 font-bold">{simulation.missedLeadsCount} leads</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total monthly lost revenue:</span>
                  <span className="text-rose-400 font-bold">-${simulation.estimatedLostRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-slate-900">
                  <span className="text-emerald-400 font-medium">Est. Recovered Monthly:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    +${simulation.estimatedRecoveredMonthlyRevenue.toLocaleString()}/mo
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlayFlow}
              disabled={isPlaying}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
            >
              {isPlaying ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Simulating Flow...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" /> Play Recovery Flow
                </>
              )}
            </button>
          </div>

          {/* Dynamic Flywheel Interactive Visualizer */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Live Lifecycle Recovery Walkthrough</h3>
                <p className="text-xs text-slate-400">Click any step or press Play to walk through the autonomous recovery loop</p>
              </div>
              <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-medium">
                Step <span className="text-emerald-400 font-bold">{activeStepIndex + 1}</span> of {simulation.flywheelSteps.length}
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {simulation.flywheelSteps.map((step, idx) => (
                <button
                  key={step.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    activeStepIndex === idx
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] text-slate-400">Phase {idx + 1}</div>
                  <div className="truncate font-semibold">{step.title.split(' ')[0]}</div>
                </button>
              ))}
            </div>

            {/* Active Step Details */}
            {(() => {
              const current = simulation.flywheelSteps[activeStepIndex];
              return (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                        {current.step}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-white">{current.title}</h4>
                        <span className="text-xs text-slate-400">{current.channel}</span>
                      </div>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 font-mono">
                      AI Active
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {current.description}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300">
                    <div className="text-[10px] uppercase text-slate-400 mb-1">Simulated Payload / Message</div>
                    {current.sampleData}
                  </div>
                </div>
              );
            })()}

            {/* Bottom CTA Box */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">Total Simulated Monthly Upside</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  +${simulation.estimatedRecoveredMonthlyRevenue.toLocaleString()}
                  <span className="text-sm font-normal text-slate-400"> / month</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/onboarding"
                  className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  Start 14-Day Free Trial <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/pricing"
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  View Plans ($49/mo)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
