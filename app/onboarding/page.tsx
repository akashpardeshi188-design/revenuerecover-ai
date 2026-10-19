'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  PhoneCall,
  Calendar,
  CreditCard,
  Zap,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('HVAC & Plumbing Services');
  const [website, setWebsite] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');
  const [selectedCrm, setSelectedCrm] = useState('ServiceTitan');
  const [autopilotMode, setAutopilotMode] = useState<'copilot' | 'supervised' | 'autopilot'>('supervised');
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.getUser();
        if (!active) return;
        if (authError || !data.user) {
          router.replace('/login');
          return;
        }
        setBusinessEmail(data.user.email ?? '');
      } catch {
        if (active) setError('Authentication is not configured. Contact support before onboarding.');
      }
    };
    void loadUser();
    return () => { active = false; };
  }, [router]);

  const handleCompleteOnboarding = async () => {
    setError('');
    if (businessName.trim().length < 2) {
      setError('Enter your company name before finishing onboarding.');
      setStep(1);
      return;
    }
    if (!/^https?:\/\/[^\s]+$/i.test(website.trim())) {
      setError('Enter a valid website that starts with https:// or http://.');
      setStep(3);
      return;
    }
    setIsActivating(true);
    try {
      const supabase = createClient();
      const typeText = industry.toLowerCase();
      const businessType =
        typeText.includes('hvac') && typeText.includes('plumbing') ? 'hvac_plumbing' :
        typeText.includes('hvac') ? 'hvac' :
        typeText.includes('plumbing') ? 'plumbing' :
        typeText.includes('electrical') ? 'electrical' :
        typeText.includes('general contractor') ? 'general_contractor' : 'other';

      const { data: companyId, error: companyError } = await supabase.rpc('complete_client_onboarding', {
        p_company_name: businessName.trim(),
        p_website: website.trim(),
        p_business_type: businessType,
        p_city: city.trim(),
        p_state: stateCode.trim(),
        p_phone: businessPhone.trim() || null,
        p_email: businessEmail.trim() || null,
      });
      if (companyError) throw companyError;

      const serviceAreas = city.trim() || stateCode.trim()
        ? [`${city.trim()}${city.trim() && stateCode.trim() ? ', ' : ''}${stateCode.trim()}`]
        : [];
      const { error: detailsError } = await supabase.rpc('save_client_onboarding_details', {
        p_primary_contact_phone: businessPhone.trim() || null,
        p_service_areas: serviceAreas,
        p_emergency_hours: `${startTime}-${endTime} America/Chicago`,
        p_primary_services: [industry],
        p_booking_software_name: selectedCrm || null,
        p_ninety_day_revenue_goal: null,
      });
      if (detailsError) throw detailsError;

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch {
        // Decorative only; data has already been saved.
      }
      router.replace('/dashboard');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save onboarding. Check your fields and try again.');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full flex flex-col justify-center">
        {/* Onboarding Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <TrendingUp className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Welcome to RevenueRecover AI</h1>
                <p className="text-xs text-slate-400">8-Step Interactive Customer Onboarding Wizard</p>
              </div>
            </div>

            <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
              Step <span className="text-emerald-400 font-bold">{step}</span> of 8
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>

          {error && <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}

          {/* STEP 1: BUSINESS PROFILE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Step 1: Business Profile</h3>
                <p className="text-xs text-slate-400">Confirm your company legal identity and operating name.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300">Company Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} placeholder="Dallas" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">State</label>
                  <input type="text" value={stateCode} onChange={(e) => setStateCode(e.target.value)} maxLength={100} placeholder="TX" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 text-sm"
                >
                  Next: Industry Selection <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: INDUSTRY */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Step 2: Primary Industry & Trade</h3>
                <p className="text-xs text-slate-400">This configures trade-specific recovery playbooks and pricing scripts.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="HVAC & Plumbing Services">HVAC & Plumbing Services</option>
                  <option value="Plumbing">Plumbing Services</option>
                  <option value="Electrical">Electrical Contractors</option>
                  <option value="Roofing">Roofing & Solar</option>
                  <option value="General Contractors">General Contractors / Remodeling</option>
                  <option value="Dental">Dental Clinic</option>
                  <option value="Med Spa">Med Spa & Aesthetic</option>
                </select>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white">← Back</button>
                <button
                  onClick={() => setStep(3)}
                  className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 text-sm"
                >
                  Next: Website Setup <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: WEBSITE */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Step 3: Company Website URL</h3>
                <p className="text-xs text-slate-400">Used for online service request lead capture webhooks.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300">Website</label>
                <input
                  type="url"
                  value={website}
                  placeholder="https://yourcompany.com"
                  required
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="text-xs text-slate-400 hover:text-white">← Back</button>
                <button
                  onClick={() => setStep(4)}
                  className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 text-sm"
                >
                  Next: Business Phone <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: BUSINESS PHONE */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Step 4: Business Dispatch Phone</h3>
                <p className="text-xs text-slate-400">The line where missed calls trigger automated 45-second SMS text-backs.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300">Dispatch Phone Number</label>
                <input
                  type="text"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className="text-xs text-slate-400 hover:text-white">← Back</button>
                <button
                  onClick={() => setStep(5)}
                  className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 text-sm"
                >
                  Next: Business Email <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: EMAIL */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Step 5: Admin Email</h3>
                <p className="text-xs text-slate-400">For daily recovery summary reports and escalation alerts.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(4)} className="text-xs text-slate-400 hover:text-white">← Back</button>
                <button
                  onClick={() => setStep(6)}
                  className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 text-sm"
                >
                  Next: Operating Hours <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: BUSINESS & QUIET HOURS */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Step 6: Business Hours & TCPA Quiet Hours</h3>
                <p className="text-xs text-slate-400">Automated SMS will only be delivered during compliant local hours.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Dispatch Opens</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Dispatch Closes</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Quiet hours strictly enforced from 9:00 PM to 8:00 AM automatically.</span>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(5)} className="text-xs text-slate-400 hover:text-white">← Back</button>
                <button
                  onClick={() => setStep(7)}
                  className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 text-sm"
                >
                  Next: Connect Integrations <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: CONNECT INTEGRATIONS */}
          {step === 7 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Step 7: Select Primary CRM & Field Software</h3>
                <p className="text-xs text-slate-400">Pre-connected with certified adapters (Demo mode active).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {['ServiceTitan', 'Housecall Pro', 'Jobber'].map((crmOption) => (
                  <button
                    key={crmOption}
                    type="button"
                    onClick={() => setSelectedCrm(crmOption)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition ${
                      selectedCrm === crmOption
                        ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-sm">{crmOption}</div>
                    <div className="text-[10px] text-emerald-400">✓ Adapter Connected</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(6)} className="text-xs text-slate-400 hover:text-white">← Back</button>
                <button
                  onClick={() => setStep(8)}
                  className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 text-sm"
                >
                  Next: Autopilot & Activation <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: ACTIVATE AI AGENT */}
          {step === 8 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Step 8: Choose AI Autopilot Mode & Activate</h3>
                <p className="text-xs text-slate-400">You can change this setting at any time with 1 click in your dashboard.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div
                  onClick={() => setAutopilotMode('copilot')}
                  className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition ${
                    autopilotMode === 'copilot'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-sm text-emerald-400">Copilot Mode</div>
                  <p className="text-[11px] leading-relaxed">AI drafts all replies; you approve each one with 1 click.</p>
                </div>

                <div
                  onClick={() => setAutopilotMode('supervised')}
                  className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition ${
                    autopilotMode === 'supervised'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-sm text-cyan-400">Supervised Autopilot</div>
                  <p className="text-[11px] leading-relaxed">AI handles standard bookings; sensitive cases are escalated.</p>
                </div>

                <div
                  onClick={() => setAutopilotMode('autopilot')}
                  className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition ${
                    autopilotMode === 'autopilot'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-sm text-purple-400">Full Autopilot</div>
                  <p className="text-[11px] leading-relaxed">Autonomous execution within strict business rules.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button onClick={() => setStep(7)} className="text-xs text-slate-400 hover:text-white">← Back</button>
                <button
                  onClick={handleCompleteOnboarding}
                  disabled={isActivating}
                  className="py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-base flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition active:scale-95 disabled:opacity-50"
                >
                  {isActivating ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" /> Activating AI Agent...
                    </>
                  ) : (
                    <>
                      Activate Revenue Recovery Agent <Zap className="w-5 h-5 fill-slate-950" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
