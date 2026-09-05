'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Star,
  Flame,
  Crown,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export default function OfficialStorefrontPage() {
  const [billingPlan, setBillingPlan] = useState<'monthly' | 'annual'>('monthly');

  const monthlyPaypalUrl = 'https://www.paypal.com/ncp/payment/GFXAWMG4S227E';
  const annualPaypalUrl = 'https://www.paypal.com/ncp/payment/ZKXHXXNDN4D7J';
  const shopifyStoreUrl = 'https://0u14pb-fd.myshopify.com';

  const currentPaypalUrl = billingPlan === 'annual' ? annualPaypalUrl : monthlyPaypalUrl;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24">
      {/* Top Trust Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold text-center py-2 px-4 flex items-center justify-center gap-3 flex-wrap shadow-md">
        <span>⭐ Rated 4.9/5 by 120+ Contractors in USA, UK &amp; Canada</span>
        <span>•</span>
        <span>💳 100% Secure Checkout (PayPal &amp; Major Cards)</span>
        <span>•</span>
        <span>⚡ Instant Digital Activation in 3 Minutes</span>
      </div>

      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Mockup */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> AI ENGINE ACTIVE
              </span>
              <span className="text-[11px] text-slate-400 font-mono">v2.4 Production</span>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                ⚡ 45-Second Auto Text-Back Preview:
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-sm p-3.5 text-xs text-slate-200 leading-relaxed">
                <strong className="text-emerald-400">RevenueRecover AI:</strong> &ldquo;Hi, this is Summit HVAC. We just missed your call regarding emergency AC repair. We have a technician on standby in your ZIP code. Reply here to confirm your slot!&rdquo;
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/60 rounded-xl p-2.5 text-xs">
                <span className="text-slate-300 font-bold">📍 Local Homeowner (Dallas, TX)</span>
                <span className="text-emerald-400 font-mono font-black">HOT 95/100</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4 text-center">
              <div>
                <div className="text-xl">🎁</div>
                <div className="text-xs font-bold text-white mt-1">200 Leads</div>
                <div className="text-[10px] text-slate-400">Day 1 Delivery</div>
              </div>
              <div>
                <div className="text-xl">⚡</div>
                <div className="text-xs font-bold text-white mt-1">45 Seconds</div>
                <div className="text-[10px] text-slate-400">Response Time</div>
              </div>
              <div>
                <div className="text-xl">🛡️</div>
                <div className="text-xs font-bold text-white mt-1">Quiet Hours</div>
                <div className="text-[10px] text-slate-400">100% Legal</div>
              </div>
            </div>
          </div>

          {/* Right Column: Buy Details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">
                OFFICIAL COMMERCIAL LICENSE
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white mt-1 leading-tight">
                RevenueRecover AI — Autonomous Missed-Call Recovery &amp; 200 Trade Leads
              </h1>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-slate-300 font-bold">4.9 / 5.0</span>
                <span className="text-slate-500">(124 Verified Contractor Reviews)</span>
              </div>
            </div>

            {/* Plan Switcher */}
            <div className="grid grid-cols-2 gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
              <button
                onClick={() => setBillingPlan('monthly')}
                className={`py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                  billingPlan === 'monthly'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4" /> Monthly Growth ($119/mo)
              </button>
              <button
                onClick={() => setBillingPlan('annual')}
                className={`py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                  billingPlan === 'annual'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4" /> Annual VIP ($990/yr · Best Value)
              </button>
            </div>

            {/* Price Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-xl">
              <div>
                <div className="text-xs text-slate-400 font-bold">
                  {billingPlan === 'annual' ? 'VIP Annual Commercial License' : 'Monthly Growth Subscription'}
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-emerald-400 font-mono">
                    {billingPlan === 'annual' ? '$990' : '$119'}
                  </span>
                  <span className="text-sm text-slate-500 line-through">
                    {billingPlan === 'annual' ? '$1,428' : '$299'}
                  </span>
                </div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black">
                  {billingPlan === 'annual' ? 'SAVE $438/YEAR • VIP ACCESS' : 'SAVE 60% TODAY • 1-CLICK SETUP'}
                </span>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>{billingPlan === 'annual' ? 'USD / Year' : 'USD / Month'}</div>
                <div className="text-emerald-400 font-bold">Cancel Anytime</div>
              </div>
            </div>

            {/* Feature List */}
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>45-Second AI Text-Back Engine:</strong> Never lose an emergency customer call while on a job site.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{billingPlan === 'annual' ? '500+ Verified Local Leads' : '150–200 Verified Local Leads'}:</strong> Pre-loaded homeowner inquiries in your specific service ZIP codes.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>24/7 Autonomous Customer Reactivation:</strong> Re-engages past clients for seasonal maintenance tune-ups.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>1-Click CRM Sync:</strong> Works with ServiceTitan, Housecall Pro, Jobber, and Google Calendar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Full Compliance Guard:</strong> Built-in 8 PM–8 AM quiet hours compliant with TCPA (USA), UK GDPR, and CASL.</span>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={currentPaypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition"
              >
                ⚡ Instant Checkout with PayPal / Card ({billingPlan === 'annual' ? '$990/yr' : '$119/mo'})
              </a>

              <a
                href={shopifyStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" /> Order on Official Shopify Store (0u14pb-fd.myshopify.com)
              </a>
            </div>

            <div className="text-center text-[11px] text-slate-500">
              🔒 256-Bit SSL Encrypted Checkout • Instant Digital License Delivery
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">Trusted by 120+ Home Service Contractors</h2>
            <p className="text-xs text-slate-400">Verified results from HVAC, Plumbing, and Electrical contractors:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;We were losing 10-15 calls every weekend. RevenueRecover AI booked a $4,850 heat pump quote in our first 48 hours.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">DS</div>
                <div>
                  <div className="text-xs font-bold text-white">Dave Stanfield</div>
                  <div className="text-[10px] text-slate-400">Owner, Dallas Pro HVAC (Dallas, TX)</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;The 200 local leads alone paid for 6 months of the software. The 45-second text-back is like having a full-time dispatcher.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center">MR</div>
                <div>
                  <div className="text-xs font-bold text-white">Marcus Rodriguez</div>
                  <div className="text-[10px] text-slate-400">Master Plumber, Apex Plumbing (Miami, FL)</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;Setup took literally 3 minutes. Connected our phone line and appointments started booking automatically.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-slate-950 font-black text-xs flex items-center justify-center">GB</div>
                <div>
                  <div className="text-xs font-bold text-white">Graham Bennett</div>
                  <div className="text-[10px] text-slate-400">Director, Royal Borough Electrical (London, UK)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* STICKY BOTTOM BUY BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 py-3 px-4 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-black text-emerald-400 font-mono">
              {billingPlan === 'annual' ? '$990 / yr' : '$119 / mo'}
            </div>
            <div className="text-[11px] text-slate-400">
              {billingPlan === 'annual' ? 'VIP Annual License • 500+ Leads' : 'Growth Plan • 200 Leads Included'}
            </div>
          </div>
          <a
            href={currentPaypalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-6 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 transition"
          >
            ⚡ Buy Now with PayPal
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
