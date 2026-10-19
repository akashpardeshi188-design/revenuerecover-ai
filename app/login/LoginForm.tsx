'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingUp, ArrowRight, Lock, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function LoginForm({ initialError = '' }: { initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError('Sign-in failed. Check your email and password, then try again.');
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      const safeNext = next && next.startsWith('/') && !next.startsWith('//') &&
        !next.includes(String.fromCharCode(92)) ? next : '/dashboard';
      router.replace(safeNext);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
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
            <h2 className="text-xl font-bold text-white pt-2">Sign in to your Customer Portal</h2>
            <p className="text-xs text-slate-400">Use your registered work email and password.</p>
          </div>

          {error && <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="password" className="font-semibold text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-emerald-400 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 disabled:opacity-60 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition">
              {loading ? 'Signing in…' : <>Sign In to Dashboard <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>Need an account?</span>
            <Link href="/signup" className="text-emerald-400 font-bold hover:underline">Start 14-Day Free Trial</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
