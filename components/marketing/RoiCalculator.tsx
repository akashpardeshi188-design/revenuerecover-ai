'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export function RoiCalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState(80);
  const [avgJobValue, setAvgJobValue] = useState(1400);
  const [missedRate, setMissedRate] = useState(20);

  const missedLeadsCount = Math.round(monthlyLeads * (missedRate / 100));
  const totalLostMonthly = missedLeadsCount * avgJobValue;
  const recoveredMonthly = Math.round(totalLostMonthly * 0.42);
  const recoveredAnnual = recoveredMonthly * 12;
  const growthPlanCost = 149;
  const roiMultiple = Math.round(recoveredMonthly / growthPlanCost);

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Interactive ROI Simulator
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Calculate Your Recoverable Revenue in 10 Seconds
          </h3>
          <p className="text-sm text-slate-400">
            Most home-service businesses lose 15–30% of their inbound inquiries to missed calls, delayed quotes, and uncontacted leads. Adjust the sliders below to see your potential upside.
          </p>

          <div className="space-y-5 pt-2">
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">Monthly Inbound Leads / Inquiries</span>
                <span className="text-emerald-400 font-bold">{monthlyLeads} leads/mo</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>10 leads</span>
                <span>150 leads</span>
                <span>300 leads</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">Average Job / Invoice Value</span>
                <span className="text-emerald-400 font-bold">${avgJobValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="200"
                max="6000"
                step="100"
                value={avgJobValue}
                onChange={(e) => setAvgJobValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>$200 (Service call)</span>
                <span>$2,500 (Repair/Install)</span>
                <span>$6,000+ (Full system)</span>
              </div>
            </div>

            {/* Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">Estimated Missed / Delayed Follow-up Rate</span>
                <span className="text-amber-400 font-bold">{missedRate}% missed</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={missedRate}
                onChange={(e) => setMissedRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>5% (Very tight)</span>
                <span>20% (Industry avg)</span>
                <span>40% (High leak)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Estimated Monthly Leakage
              </span>
              <span className="text-xs font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                -${totalLostMonthly.toLocaleString()}/mo
              </span>
            </div>

            <div className="pt-2 border-t border-slate-900">
              <div className="text-xs text-slate-400 mb-1">Estimated Recoverable Revenue</div>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                ${recoveredMonthly.toLocaleString()}
                <span className="text-lg font-semibold text-slate-400">/mo</span>
              </div>
              <div className="text-sm text-emerald-400 font-medium mt-1">
                ≈ ${recoveredAnnual.toLocaleString()} annually in recovered sales
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-900 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400">Software Cost</div>
                <div className="text-base font-bold text-white mt-0.5">$149/mo</div>
                <div className="text-[10px] text-slate-400">Growth Plan</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/20">
                <div className="text-slate-400">Projected ROI</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{roiMultiple}x Multiple</div>
                <div className="text-[10px] text-emerald-400/80">Pays for itself on Day 3</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              href="/free-revenue-scan"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-98"
            >
              Scan My Real Business <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>No credit card required • Instant 60-second diagnostic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlywheelVisualizer() {
  const steps = [
    { title: '1. AI Prospecting', subtitle: 'Target verified businesses in US service niches' },
    { title: '2. Free Revenue Scan', subtitle: 'Interactive diagnostic shows exact leakage $' },
    { title: '3. AI Sales SDR', subtitle: 'Instant 24/7 lead qualification & simulation' },
    { title: '4. Stripe Checkout', subtitle: 'Frictionless 14-day trial & plan activation' },
    { title: '5. AI Revenue Recovery', subtitle: 'Reactivates missed calls & abandoned quotes' },
    { title: '6. Confirmed ROI', subtitle: 'Customer sees real recovered revenue in CRM' },
    { title: '7. Viral Referrals', subtitle: 'Satisfied owners invite local peers for free months' },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-4 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" /> Self-Reinforcing Flywheel
        </div>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          How the Self-Selling Business System Operates
        </h3>
        <p className="text-slate-400 text-sm">
          A continuous autonomous loop where Product B (Growth Engine) sells Product A (RevenueRecover AI), which delivers massive customer ROI that fuels expansion and organic referral loops.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition hover:-translate-y-1 ${
              idx === 4
                ? 'bg-emerald-950/40 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                {idx === 4 && (
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                    Core Product
                  </span>
                )}
              </div>
              <div className="font-bold text-slate-200 text-sm">{step.title}</div>
              <div className="text-xs text-slate-400 leading-relaxed">{step.subtitle}</div>
            </div>
          </div>
        ))}

        <div className="p-5 rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-950/20 text-left flex flex-col justify-center items-center text-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            ↻
          </div>
          <div className="text-sm font-bold text-emerald-400">Continuous Growth Loop</div>
          <div className="text-xs text-slate-400">Compounding MRR & Customer Value</div>
        </div>
      </div>
    </div>
  );
}
