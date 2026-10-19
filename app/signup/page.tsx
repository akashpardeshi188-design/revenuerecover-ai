'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { TrendingUp, ArrowRight, Mail, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = new URL('/auth/callback?next=/onboarding', window.location.origin).toString();
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: redirectTo, data: { full_name: name.trim() } },
      });
      if (signupError) {
        setError(signupError.message);
        return;
      }
      if (data.session) {
        router.replace('/onboarding');
        router.refresh();
        return;
      }
      setNotice('Account request created. Check your email and confirm the link before signing in.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create an account right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-slate-950" /></div>
            <span className="font-bold text-lg text-white">RevenueRecover<span className="text-emerald-400">AI</span></span>
          </Link>
          <h1 className="text-xl font-bold text-white pt-3">Create your customer account</h1>
          <p className="text-xs text-slate-400">Register first; then connect your business profile during onboarding.</p>
        </div>
        {error && <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5"><label htmlFor="name" className="text-xs font-semibold text-slate-300">Full Name</label><input id="name" value={name} onChange={e=>setName(e.target.value)} autoComplete="name" required maxLength={120} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500" /></div>
          <div className="space-y-1.5"><label htmlFor="email" className="text-xs font-semibold text-slate-300">Work Email</label><div className="relative"><Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" /><input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white focus:outline-none focus:border-emerald-500" /></div></div>
          <div className="space-y-1.5"><label htmlFor="password" className="text-xs font-semibold text-slate-300">Password</label><div className="relative"><Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" /><input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" required minLength={8} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white focus:outline-none focus:border-emerald-500" /></div><p className="text-[11px] text-slate-500">Use at least 8 characters.</p></div>
          <button type="submit" disabled={loading} className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 disabled:opacity-60 text-slate-950 font-bold text-sm flex items-center justify-center gap-2">{loading ? 'Creating account…' : <>Create Account <ArrowRight className="w-4 h-4" /></>}</button>
        </form>
        <p className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">Already registered? <Link href="/login" className="text-emerald-400 font-bold hover:underline">Sign in</Link></p>
      </main>
    </div>
  );
}
