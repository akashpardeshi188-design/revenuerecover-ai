'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, PhoneCall, MessageSquare, CalendarCheck, DollarSign } from 'lucide-react';

const steps = [
  ['Missed call detected', 'A contractor misses an inbound service call.', PhoneCall],
  ['AI text-back in ~45 seconds', 'The customer receives a helpful response with STOP opt-out language.', MessageSquare],
  ['Customer replies', 'The AI qualifies the request and moves toward an appointment.', CheckCircle2],
  ['Appointment + recovered revenue', 'The workflow records the booked job and modeled recovered value.', CalendarCheck],
] as const;

export default function V2Page() {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState('Dallas');
  const [state, setState] = useState('TX');
  const [industry, setIndustry] = useState<'hvac' | 'plumbing'>('hvac');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);

  async function findLeads() {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/v2/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ city, state, industry, limit: 10 }),
      });
      setResult(await response.json());
    } catch {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  }

  const Icon = steps[step][2];

  return (
    <main className="min-h-screen bg-slate-950 text-white px-5 py-12">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="space-y-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">RevenueRecover AI V2</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Recover missed-call revenue before the customer calls your competitor.</h1>
          <p className="mx-auto max-w-3xl text-slate-300">A focused 6-module growth operating system for US HVAC and plumbing contractors.</p>
        </header>

        <section className="grid gap-5 md:grid-cols-4">
          {steps.map(([title, text], index) => (
            <button key={title} onClick={() => setStep(index)} className={`rounded-2xl border p-5 text-left transition ${step === index ? 'border-emerald-400 bg-emerald-400/10' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'}`}>
              <div className="mb-4 text-sm font-bold text-emerald-400">0{index + 1}</div>
              <h2 className="font-bold">{title}</h2>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </button>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 shadow-2xl">
          <div className="flex items-start gap-5">
            <div className="rounded-2xl bg-emerald-400/10 p-4 text-emerald-400"><Icon /></div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Interactive demo</p>
              <h2 className="mt-2 text-2xl font-extrabold">{steps[step][0]}</h2>
              <p className="mt-2 text-slate-300">{step === 1 ? 'Hi, this is the team. We saw your call and want to help. What do you need help with? Reply STOP to opt out.' : steps[step][1]}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="rounded-xl border border-slate-700 px-4 py-2 disabled:opacity-40">Back</button>
                <button onClick={() => setStep((s) => Math.min(3, s + 1))} className="rounded-xl bg-emerald-400 px-5 py-2 font-bold text-slate-950">Next <ArrowRight className="ml-1 inline h-4 w-4" /></button>
                {step === 3 && <span className="rounded-xl bg-emerald-400/10 px-4 py-2 font-bold text-emerald-300"><DollarSign className="mr-1 inline h-4 w-4" />$350 modeled job value</span>}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Agent 1 — Lead Engine</p>
            <h2 className="mt-2 text-2xl font-extrabold">Find qualified HVAC & plumbing prospects</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none" />
              <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"><option>TX</option><option>FL</option></select>
              <select value={industry} onChange={(e) => setIndustry(e.target.value as 'hvac' | 'plumbing')} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"><option value="hvac">HVAC</option><option value="plumbing">Plumbing</option></select>
            </div>
            <button onClick={findLeads} disabled={loading} className="mt-4 w-full rounded-xl bg-white px-5 py-3 font-bold text-slate-950 disabled:opacity-50">{loading ? 'Finding qualified leads…' : 'Find Qualified Leads'}</button>
            <p className="mt-3 text-xs text-slate-500">Requires GOOGLE_PLACES_API_KEY and/or YELP_FUSION_API_KEY in Vercel. Results are filtered and modeled; they are not guaranteed lost revenue.</p>
            {result !== null && <pre className="mt-5 max-h-72 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-300">{JSON.stringify(result, null, 2)}</pre>}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">6-module operating system</p>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              {['Lead Engine', 'Personalization Engine', 'Outreach Engine', 'Sales & Demo Engine', 'Onboarding Engine', 'Retention Engine'].map((name, i) => <div key={name} className="flex items-center gap-3 rounded-xl border border-slate-800 p-4"><span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">{i + 1}</span><span className="font-semibold">{name}</span><span className="ml-auto text-xs text-emerald-400">V2</span></div>)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
