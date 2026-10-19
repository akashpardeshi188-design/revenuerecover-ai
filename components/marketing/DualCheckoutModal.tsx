'use client';

import { AlertTriangle, X } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="checkout-unavailable-title">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative">
        <button type="button" onClick={onClose} aria-label="Close checkout notice" className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300">
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-amber-300" />
        </div>
        <div className="space-y-2">
          <h2 id="checkout-unavailable-title" className="text-xl font-bold text-white">Checkout temporarily unavailable</h2>
          <p className="text-sm text-slate-300">
            Secure billing is being configured and verified for the selected plan. This screen will not create an order, collect money, or activate a subscription.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm space-y-2">
          <div className="flex justify-between gap-4"><span className="text-slate-400">Selected plan</span><span className="font-semibold text-white text-right">{planName}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-400">Displayed amount</span><span className="font-semibold text-white">${amountUSD} USD</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-400">Business</span><span className="font-semibold text-white text-right">{businessName}</span></div>
        </div>
        <p className="text-xs text-slate-400">
          No payment has been initiated. Billing will reopen after server-side prices, provider verification, and subscription activation are tested end to end.
        </p>
        <button type="button" onClick={onClose} className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm">Close</button>
      </div>
    </div>
  );
}
