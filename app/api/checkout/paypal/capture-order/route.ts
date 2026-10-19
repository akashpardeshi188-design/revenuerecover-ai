import { NextResponse } from 'next/server';

export async function POST() {
  // Captures must be tied to a trusted, server-created order owned by the caller.
  // That order/tenant mapping is not yet implemented, so fail closed.
  return NextResponse.json({
    success: false,
    error: 'PayPal capture is disabled until order ownership and subscription persistence are implemented.',
    code: 'BILLING_NOT_READY',
  }, { status: 503 });
}
