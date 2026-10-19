import { NextResponse } from 'next/server';

export async function POST() {
  // The existing frontend uses hosted links and has no trusted server-side plan
  // mapping or recurring subscription provisioning. Avoid arbitrary amount orders.
  return NextResponse.json({
    success: false,
    error: 'PayPal order creation is disabled until pricing and subscription lifecycle are configured.',
    code: 'BILLING_NOT_READY',
  }, { status: 503 });
}
