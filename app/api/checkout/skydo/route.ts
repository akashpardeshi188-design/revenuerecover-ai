import { NextResponse } from 'next/server';

export async function POST() {
  // Do not fabricate invoices or banking details. Connect the verified provider
  // API and beneficiary configuration before enabling this checkout path.
  return NextResponse.json({
    success: false,
    error: 'Skydo checkout is not configured. No invoice or payment instructions were created.',
    code: 'PAYMENT_PROVIDER_NOT_CONFIGURED',
  }, { status: 503 });
}
