'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { DualCheckoutModal } from '@/components/marketing/DualCheckoutModal';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  PhoneCall,
  Calendar,
  CreditCard,
  Flame,
  Wrench,
  Zap,
  Home,
  Building,
  Lock,
  Globe2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FreeRevenueScanPage() {
  const router = useRouter();
  const { runRevenueScanner } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [businessName, setBusinessName] = useState('Lone Star Heating & Air');
  const [website, setWebsite] = useState('https://lonestarheating.example.com');
  const [industry, setIndustry] = useState('HVAC & AC Repair');
  const [location, setLocation] = useState('Fort Worth, Texas');
  const [monthlyLeads, setMonthlyLeads] = useState(90);
  const [avgJobValue, setAvgJobValue] = useState(1450);
  const [currentProcess, setCurrentProcess] = useState('Manual follow-up by dispatch team');
  const [crm, setCrm] = useState('ServiceTitan');
  const [email, setEmail] = useState('owner@lonestarheating.example.com');
  const [phone, setPhone] = useState('(817) 555-0192');

  const [scanResult, setScanResult] = useState<ReturnType<typeof runRevenueScanner> | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleRunScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);

    setTimeout(() => {
      const result = runRevenueScanner({
        businessName,
        website,
        industry,
        location,
        monthlyLeads,
        avgJobValue,
        currentProcess,
        email,
        phone,
      });

      setScanResult(result);
      setIsScanning(false);
      setStep(3);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // confetti optional
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> 60-Second AI Revenue Leak Diagnostic
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Free Revenue Recovery Scan
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Discover exactly how much revenue your service business is leaving on the table from missed calls, unbooked quotes, and inactive customers.
          </p>
        </div>

        {/* Scan Wizard */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Stepper Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                {step}
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {step === 1 && 'Company Profile & Primary Trade'}
                  {step === 2 && 'Lead Volume & Current Operations'}
                  {step === 3 && 'Diagnostic Breakdown & Action Plan'}
                </h2>
                <span className="text-xs text-slate-400">Step {step} of 3</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 hidden sm:inline">
                {step === 3 ? 'Diagnostic Complete' : 'Estimated Time: 60 Seconds'}
              </span>
            </div>
          </div>

          {/* STEP 1: BUSINESS PROFILE */}
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white">Step 1: Tell Us About Your Business</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Business / Trade Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Mechanical Pros"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Primary Trade / Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="HVAC & AC Repair">HVAC & Air Conditioning</option>
                    <option value="Plumbing Services">Plumbing & Drain Services</option>
                    <option value="Electrical Contractors">Electrical & Solar</option>
                    <option value="Roofing & Siding">Roofing & Storm Restoration</option>
                    <option value="Dental & Medical Spa">Dental & Healthcare</option>
                    <option value="General Home Services">Other Service Contracting</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Website or Google Maps URL</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourcontractorwebsite.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Primary Operating City / State</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dallas-Fort Worth, TX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Owner / Manager Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@yourcompany.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Dispatch / Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-8 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
                >
                  Continue to Step 2 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: LEAD VOLUME & ESTIMATES */}
          {step === 2 && (
            <form onSubmit={handleRunScan} className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Step 2: Monthly Lead Volume & Follow-up Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Estimated Inbound Inquiries / Calls Per Month
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    value={monthlyLeads}
                    onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                  <div className="text-[11px] text-slate-400">Total website form fills + phone calls</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Average Job / Ticket Value ($ USD)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="20000"
                    step="50"
                    value={avgJobValue}
                    onChange={(e) => setAvgJobValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                  <div className="text-[11px] text-slate-400">Average price across repairs and installs</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Current Lead Follow-up Process</label>
                  <select
                    value={currentProcess}
                    onChange={(e) => setCurrentProcess(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Manual follow-up by dispatch team">Manual phone calls & emails by office staff</option>
                    <option value="Technicians call when free">Technicians call customers when free in field</option>
                    <option value="Standard email autoresponder">Basic email autoresponder only (no SMS)</option>
                    <option value="No formal follow-up system">No formal follow-up system in place</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Current CRM / Field Software (Optional)</label>
                  <select
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="ServiceTitan">ServiceTitan</option>
                    <option value="Housecall Pro">Housecall Pro</option>
                    <option value="Jobber">Jobber</option>
                    <option value="QuickBooks Online">QuickBooks Online</option>
                    <option value="HubSpot">HubSpot</option>
                    <option value="Other / Spreadsheets">Other / Spreadsheets</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition"
                >
                  Back to Step 1
                </button>

                <button
                  type="submit"
                  disabled={isScanning}
                  className="py-3 px-8 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
                >
                  {isScanning ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" /> AI Diagnosing Revenue Leaks...
                    </span>
                  ) : (
                    <>
                      Run Instant Diagnostic <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SCAN RESULTS & DIAGNOSTIC REPORT */}
          {step === 3 && scanResult && (
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              {/* Top Banner Metric */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-950 border-2 border-red-500/30 text-center space-y-3 relative overflow-hidden shadow-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" /> Identified Revenue Leakage for {businessName}
                </span>

                <div className="space-y-1">
                  <div className="text-4xl sm:text-6xl font-black text-red-400 font-mono tracking-tight">
                    ${scanResult.estimated_monthly_leakage.toLocaleString()}{' '}
                    <span className="text-lg sm:text-2xl text-slate-400 font-sans font-normal">/ month</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-300">
                    Annual Leakage: ${(scanResult.estimated_monthly_leakage * 12).toLocaleString()} / year
                  </div>
                </div>

                <p className="text-xs text-slate-400 max-w-xl mx-auto">
                  Based on {monthlyLeads} monthly leads at ${avgJobValue} avg ticket in the {industry} sector with {currentProcess.toLowerCase()}.
                </p>
              </div>

              {/* 4 Pillars Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Missed Calls Loss</span>
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    ${scanResult.breakdown.missed_call_loss.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Unanswered caller drop-off</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Unclosed Quotes</span>
                    <FileText className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    ${scanResult.breakdown.unclosed_quote_loss.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Pending estimates with no follow-up</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Overdue Payments</span>
                    <CreditCard className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    ${scanResult.breakdown.failed_payments.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Expired cards & invoices</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>No-Shows / Cancels</span>
                    <Calendar className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    ${scanResult.breakdown.no_show_loss.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Unrescheduled slots</div>
                </div>
              </div>

              {/* Recommended Action Plan */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Recommended AI Recovery Roadmap
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scanResult.action_plan.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DUAL CHECKOUT ACTION CALLOUT */}
              <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/50 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase mb-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" /> 60% FOUNDING DISCOUNT APPLIED
                    </div>
                    <h4 className="font-extrabold text-white text-xl sm:text-2xl">
                      Recover ${scanResult.estimated_monthly_leakage.toLocaleString()}/mo with AI Autopilot
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Setup your pre-configured AI employee in 3 minutes. Zero risk 30-day money-back guarantee.
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-slate-500 line-through font-mono">$297.50</span>
                      <span className="text-3xl font-black text-emerald-400 font-mono">$119</span>
                      <span className="text-xs text-slate-400">/ mo</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Save $178.50/mo forever</span>
                  </div>
                </div>

                {/* Instant Checkout Trigger Buttons */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition"
                  >
                    <CreditCard className="w-4 h-4" /> 1-Click Checkout with Razorpay / Cards ($119/mo)
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 hover:from-cyan-300 hover:to-blue-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 active:scale-95 transition"
                  >
                    <Globe2 className="w-4 h-4" /> 1-Click Checkout with PayPal ($119/mo)
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ✓ Razorpay Live Gateway Verified
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> ✓ PayPal 1-Click Instant Active
                  </span>
                  <span>•</span>
                  <span>✓ 100% 30-Day Money Back Guarantee</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Dual Checkout Modal */}
      <DualCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName="Growth Plan"
        amountUSD={119}
        businessName={businessName}
      />

      <Footer />
    </div>
  );
}
