'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = new URL('/auth/callback?next=/auth/update-password', window.location.origin).toString();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (resetError) setError(resetError.message);
      else setNotice('If an account exists for this email, password reset instructions will be sent.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to request a reset right now.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4"><main className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6"><h1 className="text-xl font-bold">Reset your password</h1><p className="text-sm text-slate-400">Enter the email used for your RevenueRecover account.</p>{error && <p role="alert" className="text-sm text-rose-200">{error}</p>}{notice && <p role="status" className="text-sm text-emerald-200">{notice}</p>}<form onSubmit={submit} className="space-y-4"><label htmlFor="email" className="block text-xs font-semibold">Work Email</label><input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" /><button disabled={loading} className="w-full py-3 rounded-xl bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold">{loading ? 'Sending…' : 'Send reset link'}</button></form><Link href="/login" className="block text-center text-emerald-400 text-sm hover:underline">Back to sign in</Link></main></div>;
}
