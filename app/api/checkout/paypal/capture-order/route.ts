import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'One-time PayPal order capture is disabled. Use the authenticated monthly subscription flow.',
      code: 'LEGACY_CHECKOUT_DISABLED',
    },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  );
}
