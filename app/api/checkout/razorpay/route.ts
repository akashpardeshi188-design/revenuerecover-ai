import { NextResponse } from 'next/server';

export async function POST() {
  // Checkout is intentionally disabled until plan prices, INR conversion and
  // persistent order/subscription verification are reconciled and tested.
  return NextResponse.json({
    success: false,
    error: 'Razorpay checkout is not available yet. No payment was created.',
    code: 'BILLING_NOT_READY',
  }, { status: 503 });
}
