'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (password.length < 8) return setError('Use at least 8 characters for your password.');
    if (password !== confirmPassword) return setError('The passwords do not match.');
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setError('This reset link is invalid or expired. Request a new one.');
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) setError(updateError.message);
      else {
        await supabase.auth.signOut();
        router.replace('/login?reset=success');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update the password right now.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4"><main className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6"><h1 className="text-xl font-bold">Choose a new password</h1>{error && <p role="alert" className="text-sm text-rose-200">{error}</p>}<form onSubmit={submit} className="space-y-4"><div><label htmlFor="password" className="block text-xs font-semibold mb-2">New Password</label><input id="password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" /></div><div><label htmlFor="confirmPassword" className="block text-xs font-semibold mb-2">Confirm Password</label><input id="confirmPassword" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" /></div><button disabled={loading} className="w-full py-3 rounded-xl bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold">{loading ? 'Updating…' : 'Update Password'}</button></form><Link href="/login" className="block text-center text-emerald-400 text-sm hover:underline">Back to sign in</Link></main></div>;
}
