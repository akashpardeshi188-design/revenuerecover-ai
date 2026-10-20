import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Razorpay checkout is not enabled. Use the approved PayPal monthly subscription flow.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  );
}
