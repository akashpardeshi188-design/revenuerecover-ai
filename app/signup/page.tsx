'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { TrendingUp, ArrowRight, Lock, Mail, UserRound } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmationRequired, setConfirmationRequired] = useState(false);
  const [requestedPlan, setRequestedPlan] = useState('');

  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get('plan');
    if (plan === 'starter' || plan === 'growth' || plan === 'revenue_partner') {
      setRequestedPlan(plan);
    }
  }, []);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        confirmationRequired?: boolean;
      };

      if (!response.ok) {
        setError(payload.error || 'Account could not be created. Please try again.');
        return;
      }

      if (payload.confirmationRequired) {
        setConfirmationRequired(true);
        return;
      }

      router.replace(requestedPlan ? `/onboarding?plan=${requestedPlan}` : '/onboarding');
      router.refresh();
    } catch {
      setError('Unable to connect right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg text-white">
                RevenueRecover<span className="text-emerald-400">AI</span>
              </span>
            </Link>
            <h1 className="text-xl font-bold text-white pt-2">Create your account</h1>
            <p className="text-xs text-slate-400">Secure account creation powered by Supabase Auth.</p>
          </div>

          {confirmationRequired ? (
            <div className="space-y-4">
              <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-200">
                Account created. Check your email to confirm it, then sign in to continue onboarding.
              </p>
              <Link href={requestedPlan ? `/login?plan=${requestedPlan}` : "/login"} className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2">
                Go to Sign In <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <UserRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input id="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required minLength={2} maxLength={120}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-300">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required maxLength={254}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-slate-300">Password (8+ characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required minLength={8} maxLength={1024}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="text-xs font-semibold text-slate-300">Confirm Password</label>
                <input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required maxLength={1024}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>

              {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

              <button type="submit" disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 disabled:opacity-60 text-slate-950 font-bold text-sm flex items-center justify-center gap-2">
                {isSubmitting ? 'Creating account…' : 'Create Account'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 font-bold hover:underline">Sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
