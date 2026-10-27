'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe2,
  X,
} from 'lucide-react';

interface DualCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planKey?: 'growth' | 'revenue_partner';
  amountUSD?: number;
  businessName?: string;
}

export function DualCheckoutModal({
  isOpen,
  onClose,
  planName = 'Growth Plan',
  planKey = 'growth',
  amountUSD = 999,
  businessName = 'Your Business',
}: DualCheckoutModalProps) {
  const router = useRouter();
  const [selectedGateway, setSelectedGateway] = useState<'razorpay' | 'paypal'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExecutePayment = () => {
    setIsProcessing(true);
    // Direct users to secure authenticated registration and subscription onboarding
    onClose();
    router.push(`/signup?plan=${planKey}&gateway=${selectedGateway}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-black uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> MONTHLY RECURRING SUBSCRIPTION
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Activate Subscription: {planName}
          </h3>
          <p className="text-xs text-slate-300">
            For <strong>{businessName}</strong>. Select your payment gateway to initiate verified recurring billing. Cancel anytime from your dashboard.
          </p>
        </div>

        {/* Price Summary */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Subscription Tier</span>
            <span className="text-sm font-bold text-white">{planName} (Monthly)</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400 font-mono">${amountUSD}</span>
            <span className="text-xs text-slate-400">/mo USD</span>
          </div>
        </div>

        {/* GATEWAY SELECTOR (RAZORPAY #1 PRIMARY VS PAYPAL #2 SECONDARY) */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block flex items-center justify-between">
            <span>Select Billing Gateway:</span>
            <span className="text-[10px] text-emerald-400 font-bold">RECURRING MONTHLY</span>
          </span>

          <div className="grid grid-cols-2 gap-3">
            {/* Razorpay Primary Gateway */}
            <button
              type="button"
              onClick={() => setSelectedGateway('razorpay')}
              className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-2 relative overflow-hidden ${
                selectedGateway === 'razorpay'
                  ? 'bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-slate-900 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" /> Razorpay
                </span>
                <span className="text-[9px] bg-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                  Primary
                </span>
              </div>
              <span className="text-[10px] text-slate-300 leading-tight">
                Cards, International Credit/Debit &amp; NetBanking
              </span>
            </button>

            {/* PayPal Secondary Gateway */}
            <button
              type="button"
              onClick={() => setSelectedGateway('paypal')}
              className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-2 relative overflow-hidden ${
                selectedGateway === 'paypal'
                  ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-cyan-400" /> PayPal
                </span>
                <span className="text-[9px] bg-cyan-500/30 text-cyan-300 font-bold px-1.5 py-0.5 rounded">
                  Secondary
                </span>
              </div>
              <span className="text-[10px] text-slate-300 leading-tight">
                PayPal Wallet &amp; Saved Cards
              </span>
            </button>
          </div>
        </div>

        {/* Action CTA */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleExecutePayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition active:scale-95 ${
              selectedGateway === 'razorpay'
                ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" /> Preparing Checkout...
              </span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-slate-950" /> Continue to Secure Subscription ($
                {amountUSD}/mo) <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span>Verified Server-Side Recurring Subscription</span>
          </div>
        </div>
      </div>
    </div>
  );
}
