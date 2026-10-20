'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, LoaderCircle, TrendingUp } from 'lucide-react';

export default function AuthConfirmedPage() {
  const [message, setMessage] = useState('Checking the email confirmation result…');
  const [hasError, setHasError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const errorDescription = fragment.get('error_description') || fragment.get('error');
    const errorCode = fragment.get('error_code');

    if (errorDescription || errorCode) {
      setHasError(true);
      setMessage((errorDescription || 'The confirmation link could not be verified.').slice(0, 240));
    } else {
      setMessage(
        fragment.has('access_token')
          ? 'The confirmation link returned successfully. Sign in with your email and password to continue.'
          : 'You have returned from the confirmation link. Try signing in; if confirmation failed, request a fresh link.'
      );
    }

    // Supabase may return session tokens in the URL fragment. This app asks
    // the user to sign in again, so discard the fragment immediately.
    window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    setReady(true);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <section className="w-full max-w-md space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <Link href="/" className="mx-auto inline-flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
            <TrendingUp className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-white">RevenueRecover<span className="text-emerald-400">AI</span></span>
        </Link>

        <div className="flex justify-center">
          {!ready ? (
            <LoaderCircle className="h-10 w-10 animate-spin text-emerald-300" />
          ) : hasError ? (
            <AlertCircle className="h-10 w-10 text-rose-300" />
          ) : (
            <CheckCircle2 className="h-10 w-10 text-emerald-300" />
          )}
        </div>

        <h1 className="text-center text-2xl font-bold text-white">
          {hasError ? 'Confirmation link issue' : 'Email confirmation'}
        </h1>
        <p role="status" className="text-center text-sm leading-6 text-slate-300">{message}</p>
        <p className="text-center text-xs leading-5 text-slate-500">
          For safety, this page does not store the URL tokens in the browser session. Sign in again after confirming your address.
        </p>
        <Link href="/login" className="flex w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 hover:bg-emerald-300">
          Go to sign in
        </Link>
      </section>
    </main>
  );
}
