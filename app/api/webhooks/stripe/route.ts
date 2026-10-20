import { NextResponse } from 'next/server';

// RevenueRecover AI uses PayPal for recurring billing. Stripe is not enabled;
// do not accept unverified test or production events on this endpoint.
export async function POST() {
  return NextResponse.json(
    { received: false, error: 'Stripe billing is not enabled for this application.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  );
}
