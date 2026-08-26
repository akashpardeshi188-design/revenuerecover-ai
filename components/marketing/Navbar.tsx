'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Sparkles,
  ChevronDown,
  Shield,
  Layers,
  Wrench,
  Flame,
  Zap,
  Home,
  CheckCircle2,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);

  const industries = [
    { name: 'HVAC & AC Repair', href: '/industries/hvac', icon: Flame, desc: 'Recover missed calls & high-ticket heat pump estimates' },
    { name: 'Plumbing Services', href: '/industries/plumbing', icon: Wrench, desc: 'Capture 24/7 emergency calls & water heater quotes' },
    { name: 'Electrical Contractors', href: '/industries/electrical', icon: Zap, desc: 'EV charger & panel upgrade estimate follow-up' },
    { name: 'Roofing & Solar', href: '/industries/roofing', icon: Home, desc: 'Automate 30-day storm damage insurance claim bids' },
    { name: 'Dental & Med Spa', href: '/industries/dental', icon: Sparkles, desc: 'Reactivate overdue hygiene & elective procedure leads' },
    { name: 'All 12+ Industries', href: '/industries', icon: Layers, desc: 'Explore customized recovery templates for your niche' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-[37px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
            <TrendingUp className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight leading-none">
              RevenueRecover<span className="text-emerald-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              AI Revenue Recovery Employee
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <div
            className="relative"
            onMouseEnter={() => setIndustriesOpen(true)}
            onMouseLeave={() => setIndustriesOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-white transition py-2">
              Industries <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {industriesOpen && (
              <div className="absolute top-full left-0 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {industries.map((ind) => {
                  const Icon = ind.icon;
                  return (
                    <Link
                      key={ind.name}
                      href={ind.href}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 transition group"
                    >
                      <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 group-hover:bg-emerald-500/10 transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 transition">
                          {ind.name}
                        </div>
                        <div className="text-xs text-slate-400 leading-snug">{ind.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link href="/free-revenue-scan" className="hover:text-emerald-400 transition flex items-center gap-1 text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Free Revenue Scan
          </Link>
          <Link href="/demo" className="hover:text-white transition">
            Interactive Demo
          </Link>
          <Link href="/how-it-works" className="hover:text-white transition">
            How It Works
          </Link>
          <Link href="/pricing" className="hover:text-white transition">
            Pricing
          </Link>
          <Link href="/integrations" className="hover:text-white transition">
            Integrations
          </Link>
          <Link href="/security" className="hover:text-white transition flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Security
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/growth"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-900/40 transition"
          >
            Growth Engine (Admin)
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            Customer Login
          </Link>
          <Link
            href="/free-revenue-scan"
            className="text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition active:scale-95"
          >
            Find My Lost Revenue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-5 space-y-3">
          <Link
            href="/free-revenue-scan"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-emerald-400 font-semibold py-2"
          >
            ⚡ Free Revenue Scanner
          </Link>
          <Link
            href="/demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-medium py-2"
          >
            Interactive Demo Sandbox
          </Link>
          <Link
            href="/industries"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-medium py-2"
          >
            Industries (HVAC, Plumbing, etc.)
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-medium py-2"
          >
            How It Works
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-medium py-2"
          >
            Pricing Plans
          </Link>
          <Link
            href="/integrations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-medium py-2"
          >
            Integrations (ServiceTitan, Stripe, etc.)
          </Link>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold"
            >
              Customer Dashboard (Summit HVAC)
            </Link>
            <Link
              href="/growth"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold"
            >
              Growth Engine Command Center
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Col 1 Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg text-white">
              RevenueRecover<span className="text-emerald-400">AI</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            The AI Revenue Recovery Employee for US home service businesses. We detect missed leads, unbooked quotes, failed payments, and dormant customers — then recover them automatically with intelligent multi-channel follow-up.
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>TCPA & CAN-SPAM quiet hours compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-tenant encrypted data isolation</span>
            </div>
          </div>
        </div>

        {/* Col 2 Product */}
        <div>
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Product</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/free-revenue-scan" className="hover:text-emerald-400 transition">Free Revenue Scan</Link></li>
            <li><Link href="/demo" className="hover:text-white transition">Interactive Demo</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition">Pricing & Plans</Link></li>
            <li><Link href="/integrations" className="hover:text-white transition">Integrations Hub</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition">Customer Portal</Link></li>
          </ul>
        </div>

        {/* Col 3 Industries */}
        <div>
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Industries</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/industries/hvac" className="hover:text-white transition">HVAC & AC Repair</Link></li>
            <li><Link href="/industries/plumbing" className="hover:text-white transition">Plumbing Pros</Link></li>
            <li><Link href="/industries/electrical" className="hover:text-white transition">Electricians</Link></li>
            <li><Link href="/industries/roofing" className="hover:text-white transition">Roofing & Solar</Link></li>
            <li><Link href="/industries/dental" className="hover:text-white transition">Dental Clinics</Link></li>
            <li><Link href="/industries" className="hover:text-white transition">All 12+ Niches</Link></li>
          </ul>
        </div>

        {/* Col 4 Growth & Compliance */}
        <div>
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Ecosystem & Trust</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/growth" className="hover:text-cyan-400 transition">Growth Command Center</Link></li>
            <li><Link href="/security" className="hover:text-white transition">Security & Compliance</Link></li>
            <li><Link href="/faq" className="hover:text-white transition">Knowledge Base & FAQ</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">Growth Playbook Blog</Link></li>
            <li><Link href="/onboarding" className="hover:text-white transition">Customer Onboarding</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          © {new Date().getFullYear()} RevenueRecover AI Inc. All rights reserved. Registered in Delaware, USA.
        </div>
        <div className="text-[11px] text-slate-400 text-center sm:text-right max-w-xl">
          *Legal notice: Revenue estimates generated by the scanner are mathematical projections based on industry averages and not a guarantee of specific business income. Businesses remain responsible for maintaining their own marketing consents.
        </div>
      </div>
    </footer>
  );
}
