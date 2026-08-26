'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import {
  Gift,
  Sparkles,
  Share2,
  Copy,
  CheckCircle2,
  Users,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

export default function ReferralEnginePage() {
  const { state } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [inviteeName, setInviteeName] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const referralCode = 'SUMMIT-1FREE';
  const referralLink = `https://revenuerecover.ai/free-revenue-scan?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteeEmail.trim()) return;
    setInviteSuccess(true);
    setInviteeName('');
    setInviteeEmail('');
    setTimeout(() => setInviteSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <GrowthNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Viral Referral Engine</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Customers who recover revenue refer local trade peers. Every qualified signup earns 1 Free Month ($149 credit).
            </p>
          </div>

          {/* Referral Link Card */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-cyan-400" /> Your Active Referral Link
                </h3>
                <p className="text-xs text-slate-400">Share with peer contractors in HVAC, plumbing, or roofing.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                  {referralCode}
                </div>
                <button
                  onClick={handleCopy}
                  className="py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>

          {/* Send Invite Form */}
          <form
            onSubmit={handleSendInvite}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl"
          >
            <h3 className="font-bold text-white text-base">Invite a Peer Contractor Directly</h3>

            {inviteSuccess && (
              <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Invitation email and free scan voucher dispatched!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Contractor / Business Name</label>
                <input
                  type="text"
                  value={inviteeName}
                  onChange={(e) => setInviteeName(e.target.value)}
                  placeholder="e.g. Precision Plumbing Pros"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Owner Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteeEmail}
                  onChange={(e) => setInviteeEmail(e.target.value)}
                  placeholder="owner@precisionplumbing.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                Send Referral Invite <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Referral History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base">Referral Attribution Ledger ({state.referrals.length})</h3>

            <div className="divide-y divide-slate-800/80">
              {state.referrals.map((ref) => (
                <div key={ref.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{ref.referred_business}</span>
                      <span className="text-[10px] font-mono text-slate-400">{ref.referred_email}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-500/20 text-emerald-300">
                        {ref.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-1 font-mono text-[11px]">
                      Referrer: {ref.referrer_name} • Code: {ref.referral_code}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-400 font-mono text-xs">{ref.reward}</div>
                    <div className="text-[10px] text-slate-500">Credited: {new Date(ref.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
