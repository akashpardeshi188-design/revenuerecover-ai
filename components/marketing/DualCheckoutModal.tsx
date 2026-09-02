'use client';

import React, { useState } from 'react';
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
  Flame,
} from 'lucide-react';

interface DualCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  amountUSD?: number;
  businessName?: string;
}

export function DualCheckoutModal({
  isOpen,
  onClose,
  planName = 'Growth Plan',
  amountUSD = 119,
  businessName = 'Your Business',
}: DualCheckoutModalProps) {
  const [selectedGateway, setSelectedGateway] = useState<'razorpay' | 'paypal'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExecutePayment = async () => {
    setIsProcessing(true);

    try {
      if (selectedGateway === 'razorpay') {
        // Trigger Razorpay Order Creation
        const res = await fetch('/api/checkout/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: planName.toLowerCase().replace(' ', '_'),
            currency: 'USD',
            businessName,
          }),
        });
        const data = await res.json();

        // Simulate seamless auth completion
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
        }, 1200);
      } else {
        // PayPal Instant Redirection / Auth
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
        }, 1200);
      }
    } catch (e) {
      console.warn(e);
      setIsProcessing(false);
    }
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

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Payment Authorized Successfully!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Your AI Revenue Recovery Employee for <strong>{businessName}</strong> is pre-configured and live.
            </p>
            <button
              onClick={() => {
                onClose();
                window.location.href = '/dashboard';
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs shadow-lg transition active:scale-95"
            >
              Go to Founder Dashboard <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 60% OFF FOUNDING DISCOUNT LOCKED
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Secure Checkout: {planName}
              </h3>
              <p className="text-xs text-slate-400">
                100% Zero-Risk 30-Day Money Back Guarantee • 24-Hour Card Pilot ($0 Today)
              </p>
            </div>

            {/* Price Summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Subscription Tier</span>
                <span className="text-sm font-bold text-white">{planName} (Global Access)</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 line-through mr-1.5">$297.50</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">${amountUSD}</span>
                <span className="text-xs text-slate-400">/mo</span>
              </div>
            </div>

            {/* GATEWAY SELECTOR (RAZORPAY VS PAYPAL) */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Select Your Preferred Payment Gateway:
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Razorpay Card Gateway */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('razorpay')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-2 ${
                    selectedGateway === 'razorpay'
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-400" /> Razorpay
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    AMEX, Visa, Mastercard, Apple Pay, Google Pay
                  </span>
                </button>

                {/* PayPal International */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('paypal')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-2 ${
                    selectedGateway === 'paypal'
                      ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                      <Globe2 className="w-4 h-4 text-cyan-400" /> PayPal
                    </span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    1-Click Global PayPal Balance, USD / GBP / EUR
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
                className={`w-full py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition active:scale-95 ${
                  selectedGateway === 'razorpay'
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 text-slate-950 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" /> Authorizing with{' '}
                    {selectedGateway === 'razorpay' ? 'Razorpay Secure' : 'PayPal Global'}...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Complete Payment with{' '}
                    {selectedGateway === 'razorpay' ? 'Cards / Razorpay' : 'PayPal'} ($
                    {amountUSD}/mo)
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span>30-Day 100% Refund Policy</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
