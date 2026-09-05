'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { Lock, Zap, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function InteractiveDemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center space-y-8">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-xl">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            🔒 Paid Subscriber Access Only
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Free Demo Mode is Closed
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            To guarantee 100% server capacity for our active contractors, all free trials and public demo sandboxes have been closed.
            Subscribe to the Growth Plan today for instant 45-second AI recovery + 150–200 local leads on Day 1.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 max-w-md mx-auto space-y-6 shadow-2xl text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs text-slate-400">Official License</div>
              <div className="text-lg font-black text-white">Growth Plan</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-400 font-mono">$119<span className="text-xs text-slate-400">/mo</span></div>
              <div className="text-[10px] text-slate-400">USD via PayPal</div>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>45-Second AI Missed-Call Auto Text-Back</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>150–200 Verified Local Homeowner Leads</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full Contractor Leads Command Center Access</span>
            </li>
          </ul>

          <Link
            href="https://www.paypal.com/ncp/payment/GFXAWMG4S227E"
            className="w-full block text-center py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition"
          >
            ⚡ Unlock Growth Access — $119/mo
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
