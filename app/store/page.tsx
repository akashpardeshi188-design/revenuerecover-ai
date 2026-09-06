'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Star,
  Flame,
  Crown,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  Calculator,
  HelpCircle,
  X,
  MessageCircle,
  FileText
} from 'lucide-react';

export default function OfficialStorefrontPage() {
  const [billingPlan, setBillingPlan] = useState<'monthly' | 'annual'>('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ROI Calculator state
  const [missedCalls, setMissedCalls] = useState(5);
  const [avgTicket, setAvgTicket] = useState(1500);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const monthlyPaypalUrl = 'https://www.paypal.com/ncp/payment/GFXAWMG4S227E';
  const annualPaypalUrl = 'https://www.paypal.com/ncp/payment/ZKXHXXNDN4D7J';
  const shopifyStoreUrl = 'https://0u14pb-fd.myshopify.com';

  const currentPaypalUrl = billingPlan === 'annual' ? annualPaypalUrl : monthlyPaypalUrl;

  // ROI calculations
  const monthlyLost = useMemo(() => {
    return Math.round(missedCalls * 4.333 * avgTicket);
  }, [missedCalls, avgTicket]);

  const monthlyRecovered = useMemo(() => {
    return Math.round(monthlyLost * 0.65);
  }, [monthlyLost]);

  const roiMultiplier = useMemo(() => {
    const cost = billingPlan === 'annual' ? 82.5 : 119;
    return Math.round(monthlyRecovered / cost);
  }, [monthlyRecovered, billingPlan]);

  // Launch PayPal in a dedicated secure popup window
  const launchPayPalPopup = (e: React.MouseEvent) => {
    e.preventDefault();
    const width = 580;
    const height = 750;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      currentPaypalUrl,
      'PayPalCheckout',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = currentPaypalUrl;
    }
  };

  const faqs = [
    {
      q: '🎁 How and when do I receive my 200 verified local leads?',
      a: 'Immediately after checkout, our onboarding intake form collects your exact trade (HVAC, Plumbing, Roofing, Electrical) and target ZIP codes. Within 24 hours, 150–200 fresh, verified homeowner inquiries are loaded into your portal and dispatched via CSV/CRM sync.'
    },
    {
      q: '⚡ How fast is the onboarding and setup?',
      a: 'Setup takes less than 10 minutes. You simply configure call forwarding from your business line to your assigned AI recovery number, or connect your existing Twilio / CRM account. Zero coding or complex software installation required.'
    },
    {
      q: '🛡️ Is this compliant with US TCPA & Canadian Anti-Spam laws?',
      a: 'Yes, 100%. Our platform strictly respects statutory quiet hours (no automated texts between 9:00 PM and 8:00 AM local recipient time), manages automated STOP opt-outs, and utilizes carrier-registered A2P 10DLC routes.'
    },
    {
      q: '💳 What happens immediately after my PayPal checkout?',
      a: 'You will receive an instant digital receipt and VIP activation confirmation containing your dashboard credentials, setup guide, and 1-on-1 concierge onboarding link.'
    },
    {
      q: '🔄 Can I cancel or change plans anytime?',
      a: 'Yes. There are zero long-term lock-in contracts for the Monthly Growth plan ($119/mo). You can cancel anytime with 1-click in your PayPal subscription settings or by contacting support.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-28">
      {/* Top Trust Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold text-center py-2 px-4 flex items-center justify-center gap-3 flex-wrap shadow-md">
        <span>⭐ Rated 4.9/5 by 120+ Contractors in USA, UK &amp; Canada</span>
        <span>•</span>
        <span>💳 100% Secure Checkout (PayPal &amp; Major Cards)</span>
        <span>•</span>
        <span>⚡ Instant Digital Activation in 3 Minutes</span>
      </div>

      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
        {/* Main Product Hero Section */}
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
                <div className="text-xs font-bold text-white mt-1">TCPA Certified</div>
                <div className="text-[10px] text-slate-400">100% Compliant</div>
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
                <span><strong>Dedicated VIP Onboarding:</strong> 1-on-1 setup and direct account provisioning included.</span>
              </li>
            </ul>

            {/* CTA Buttons - Triggers Inline Modal */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full text-center py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition cursor-pointer"
              >
                ⚡ Instant Checkout with PayPal / Card ({billingPlan === 'annual' ? '$990/yr' : '$119/mo'})
              </button>

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

        {/* INTERACTIVE ROI CALCULATOR */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider inline-block">
              Interactive Financial Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Calculate How Much Lost Revenue You Will Recover</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Adjust the sliders below based on your weekly missed calls and average ticket size to see real-world recovered revenue:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Missed Calls Per Week:</span>
                  <span className="text-emerald-400 font-mono text-sm font-black">{missedCalls} calls</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={missedCalls}
                  onChange={(e) => setMissedCalls(parseInt(e.target.value) || 1)}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Average Job Ticket Value ($):</span>
                  <span className="text-emerald-400 font-mono text-sm font-black">${avgTicket.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(parseInt(e.target.value) || 200)}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5">
                <div className="text-[11px] text-red-400 uppercase font-black tracking-wider">
                  💸 Your Monthly Lost Revenue:
                </div>
                <div className="text-3xl font-black text-red-400 font-mono mt-1">
                  ${monthlyLost.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Revenue lost to local competitors while crew is on job sites
                </div>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5">
                <div className="text-[11px] text-emerald-400 uppercase font-black tracking-wider">
                  🛡️ Monthly Revenue Recovered (65%):
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                  ${monthlyRecovered.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ mo</span>
                </div>
                <div className="text-xs text-slate-300 font-bold mt-2 flex items-center gap-1.5">
                  ⚡ <strong>{roiMultiplier}x Return</strong> on your subscription plan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">Trusted by 120+ Home Service Contractors</h2>
            <p className="text-xs text-slate-400">Verified results from HVAC, Plumbing, and Electrical contractors:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;We were losing 10-15 calls every weekend in Dallas heatwaves. RevenueRecover AI booked $34,200 in recovered jobs in our first 30 days alone.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">MM</div>
                <div>
                  <div className="text-xs font-bold text-white">Mike Miller</div>
                  <div className="text-[10px] text-slate-400">Owner, Summit HVAC (Dallas, TX)</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;The 200 local trade leads on day 1 landed us 2 emergency sewer jobs right away ($11,000 revenue). The auto text-back engine paid for the whole year.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center">DR</div>
                <div>
                  <div className="text-xs font-bold text-white">Dave Reynolds</div>
                  <div className="text-[10px] text-slate-400">Master Plumber, Apex Plumbing (Denver, CO)</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;We upgraded to the Annual VIP plan. Setup took under 15 minutes. It automatically syncs with our Google Calendar and handles quiet hours perfectly.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-slate-950 font-black text-xs flex items-center justify-center">CM</div>
                <div>
                  <div className="text-xs font-bold text-white">Carlos Mendez</div>
                  <div className="text-[10px] text-slate-400">Owner, SunBelt Commercial Roofing (Phoenix, AZ)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know before getting started:</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex justify-between items-center gap-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PITCH DECK CALLOUT */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-black text-white">Need a Commercial Proposal for Your Business Partner?</h3>
            <p className="text-xs text-slate-400">Review our full technical architecture, ROI case studies, and SLA guarantees.</p>
          </div>
          <Link
            href="/docs"
            className="py-3 px-6 rounded-xl bg-slate-950 border border-slate-700 hover:border-emerald-400 text-white font-bold text-xs flex items-center gap-2 transition whitespace-nowrap"
          >
            <FileText className="w-4 h-4 text-emerald-400" /> View Pitch Deck &amp; Docs
          </Link>
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-6 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 transition cursor-pointer"
          >
            ⚡ Buy Now with PayPal
          </button>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/918208057237?text=Hi%20RevenueRecover%20AI%20Team%2C%20I%20have%20a%20question%20before%20ordering"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 bg-[#25d366] text-slate-950 font-black text-xs py-2.5 px-4 rounded-full shadow-xl flex items-center gap-2 z-40 hover:scale-105 transition"
      >
        <MessageCircle className="w-4 h-4 fill-slate-950" />
        <span>Chat with Founder</span>
      </a>

      {/* ==========================================================================
           HIGH-TRUST INLINE CHECKOUT MODAL OVERLAY
           ========================================================================== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider inline-block">
                ⚡ INSTANT COMMERCIAL ACTIVATION
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                RevenueRecover AI — {billingPlan === 'annual' ? 'VIP Annual License' : 'Monthly Growth Plan'}
              </h3>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                {billingPlan === 'annual' ? '$990.00' : '$119.00'}
                <span className="text-xs font-normal text-slate-400 ml-2">
                  {billingPlan === 'annual' ? 'USD / Year (Save $438)' : 'USD / Month (Cancel Anytime)'}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>{billingPlan === 'annual' ? '500+ Local Trade Leads' : '200 Local Trade Leads'}</strong> dispatched on Day 1</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>45-Second AI Text-Back Engine</strong> active 24/7/365</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>100% TCPA Legal Compliance</strong> with quiet hours guard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Dedicated VIP Onboarding:</strong> 1-on-1 setup &amp; direct account provisioning</span>
              </div>
            </div>

            {/* DIRECT PAYPAL EXPRESS POPUP CTA */}
            <a
              href={currentPaypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={launchPayPalPopup}
              className="w-full block text-center py-4 rounded-2xl bg-[#ffc439] hover:bg-[#f4b400] text-[#003087] font-black text-base shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition"
            >
              <div className="flex items-center justify-center gap-2">
                <span>🔒 Pay with</span>
                <span className="bg-white text-[#003087] px-2 py-0.5 rounded font-black italic">PayPal</span>
                <span>/ Credit Card</span>
              </div>
            </a>

            <div className="flex justify-center gap-4 text-[11px] text-slate-500 pt-1">
              <span>🔒 256-Bit SSL Encrypted</span>
              <span>⚡ Instant Access Email</span>
              <span>💳 Major Cards Accepted</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
