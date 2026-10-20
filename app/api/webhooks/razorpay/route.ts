import { NextResponse } from 'next/server';

// Razorpay is not the configured payment provider for this application.
export async function POST() {
  return NextResponse.json(
    { received: false, error: 'Razorpay billing is not enabled for this application.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  );
}
