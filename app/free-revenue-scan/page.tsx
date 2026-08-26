'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
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
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Progress Ribbon */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800 text-xs font-semibold text-slate-400">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-400' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                1
              </span>
              <span>Business Profile</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-800" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-400' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                2
              </span>
              <span>Volume & Workflow</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-800" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-400' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                3
              </span>
              <span>Recovery Report</span>
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Step 1: Tell us about your service business</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Austin Premier Plumbing"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. austinpremierplumbing.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Industry / Primary Trade</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="HVAC & AC Repair">HVAC & AC Repair</option>
                    <option value="Plumbing">Plumbing Services</option>
                    <option value="Electrical">Electrical Contractors</option>
                    <option value="Roofing">Roofing & Solar</option>
                    <option value="General Contractor">General Contractors / Remodeling</option>
                    <option value="Dental">Dental Clinic</option>
                    <option value="Med Spa">Med Spa & Aesthetic</option>
                    <option value="Auto Repair">Auto Repair & Collision</option>
                    <option value="Cleaning">Commercial / Residential Cleaning</option>
                    <option value="Other Service">Other Local Service Business</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">City & State</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dallas, TX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold flex items-center gap-2 transition"
                >
                  Continue to Volume & Workflow <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
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
                    <option value="None / Paper / Spreadsheets">None / Paper / Spreadsheets</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@yourbusiness.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                  <div className="text-[11px] text-slate-400">Where to send your confidential report</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Mobile Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                  <div className="text-[11px] text-slate-400">For SMS report link notification</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to Step 1
                </button>

                <button
                  type="submit"
                  disabled={isScanning}
                  className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Analyzing Revenue Leakage...
                    </>
                  ) : (
                    <>
                      Run Free Revenue Scan <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SCAN RESULTS */}
          {step === 3 && scanResult && (
            <div className="space-y-8 animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI Diagnostic Complete
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {scanResult.business_name} May Have{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    ${scanResult.total_estimated_leakage.toLocaleString()}/Month
                  </span>{' '}
                  in Recoverable Revenue
                </h2>
                <p className="text-xs text-slate-400 max-w-xl mx-auto">
                  *This diagnostic is an engineering estimate based on {scanResult.monthly_leads} monthly inquiries in {scanResult.industry} at an average ticket of ${scanResult.avg_job_value.toLocaleString()}.
                </p>
              </div>

              {/* Opportunity Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Missed Leads</span>
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    ${scanResult.breakdown.missed_leads.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Unanswered calls & forms</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Abandoned Quotes</span>
                    <FileText className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    ${scanResult.breakdown.abandoned_quotes.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Unaccepted estimates</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Dormant Clients</span>
                    <Flame className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    ${scanResult.breakdown.dormant_customers.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Due for annual service</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Failed Payments</span>
                    <CreditCard className="w-4 h-4 text-rose-400" />
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

              {/* Action Buttons */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-lg">Ready to Recover This Revenue?</h4>
                  <p className="text-xs text-slate-400">
                    Activate your 14-day free trial on RevenueRecover AI. Setup takes less than 3 minutes.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/onboarding"
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
                  >
                    Recover My Revenue <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-center text-xs transition"
                  >
                    Watch Simulation
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
