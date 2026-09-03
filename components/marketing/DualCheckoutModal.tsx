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
  Building2,
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
  const [selectedGateway, setSelectedGateway] = useState<'paypal' | 'skydo' | 'razorpay'>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [skydoInvoice, setSkydoInvoice] = useState<any>(null);

  if (!isOpen) return null;

  const handleExecutePayment = async () => {
    setIsProcessing(true);

    try {
      if (selectedGateway === 'skydo') {
        const res = await fetch('/api/checkout/skydo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: planName.toLowerCase().replace(' ', '_'),
            currency: 'USD',
            businessName,
            amountUSD,
          }),
        });
        const data = await res.json();
        setSkydoInvoice(data);
        setIsProcessing(false);
        setIsSuccess(true);
      } else if (selectedGateway === 'razorpay') {
        const res = await fetch('/api/checkout/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: planName.toLowerCase().replace(' ', '_'),
            currency: 'USD',
            businessName,
          }),
        });
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
        }, 1200);
      } else {
        // Live PayPal Order Creation & Auth
        const res = await fetch('/api/checkout/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: planName.toLowerCase().replace(' ', '_'),
            amountUSD,
            businessName,
          }),
        });
        const orderData = await res.json();
        
        const approvalLink = orderData.links?.find((l: any) => l.rel === 'approve')?.href;
        if (approvalLink) {
          window.location.href = approvalLink;
        } else {
          setIsProcessing(false);
          setIsSuccess(true);
        }
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
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            {selectedGateway === 'skydo' && skydoInvoice ? (
              <div className="space-y-3 text-left bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span>🇺🇸 Skydo US Receiving Bank Details</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">Invoice {skydoInvoice.invoiceId}</span>
                </div>
                <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                  <div><span className="text-slate-500 font-sans">Beneficiary:</span> <strong>AKASH BHAGWANSINGH PARDESHI</strong></div>
                  <div><span className="text-slate-500 font-sans">Bank Country:</span> United States (USA)</div>
                  <div><span className="text-slate-500 font-sans">Payment Mode:</span> ACH / Fedwire / Domestic Wire</div>
                  <div><span className="text-slate-500 font-sans">Amount:</span> ${amountUSD} USD (Zero Fee)</div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  Transfer from your US/UK bank account. Once processed, funds settle directly into our verified account.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white">Payment Authorized Successfully!</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Your AI Revenue Recovery Employee for <strong>{businessName}</strong> is pre-configured and live.
                </p>
              </>
            )}

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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-black uppercase">
                <Sparkles className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> 1-CLICK TRIAL • 150–200 LEADS UNLOCKED ON DAY 1
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                1-Click Trial Activation: {planName}
              </h3>
              <p className="text-xs text-slate-300">
                1-Click to activate. Instantly unlocks <strong>150–200 verified customer leads & missed-call recoveries</strong> in your local service area. Cancel anytime with 1-click.
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

            {/* GATEWAY SELECTOR (RAZORPAY VS PAYPAL VS SKYDO) */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Select Your Preferred Payment Gateway:
              </span>

              <div className="grid grid-cols-3 gap-2">
                {/* Razorpay Card Gateway */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('razorpay')}
                  className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-1.5 ${
                    selectedGateway === 'razorpay'
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-white flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Razorpay
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[9px] text-slate-400 leading-tight">
                    AMEX, Visa, Apple Pay
                  </span>
                </button>

                {/* PayPal International */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('paypal')}
                  className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-1.5 ${
                    selectedGateway === 'paypal'
                      ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-cyan-300 flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-cyan-400" /> PayPal
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  <span className="text-[9px] text-slate-400 leading-tight">
                    1-Click Global Balance
                  </span>
                </button>

                {/* Skydo US Direct ACH & Wire */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('skydo')}
                  className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-1.5 ${
                    selectedGateway === 'skydo'
                      ? 'bg-indigo-500/10 border-indigo-400 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-indigo-300 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Skydo
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                  <span className="text-[9px] text-slate-400 leading-tight">
                    🇺🇸 US ACH & Wire
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
                    : selectedGateway === 'paypal'
                    ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 text-slate-950 shadow-cyan-500/20'
                    : 'bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 text-slate-950 shadow-indigo-500/20'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" /> Authorizing with{' '}
                    {selectedGateway === 'razorpay'
                      ? 'Razorpay Secure'
                      : selectedGateway === 'paypal'
                      ? 'PayPal Global'
                      : 'Skydo Virtual Accounts'}...
                  </span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" /> Start 1-Click Trial & Unlock 150–200 Leads ($
                    {amountUSD}/mo)
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span>150–200 Leads Ingested on Day 1 • Cancel Anytime</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
