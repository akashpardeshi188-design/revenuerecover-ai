import { NextRequest, NextResponse } from 'next/server';

/**
 * RevenueRecover AI — Failed Payment Telemetry & Dunning Recovery API
 * Captures all declined, failed, or abandoned checkout attempts for instant recovery.
 */

export interface FailedPaymentRecord {
  id: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  amountUSD: number;
  gateway: 'razorpay' | 'paypal' | 'cards' | 'skydo';
  failureReason: string;
  timestamp: string;
  recoveryStatus: 'PENDING_RETRY' | 'RECOVERY_SENT' | 'RECOVERED';
  suggestedAction: string;
}

// Global In-Memory Store for Failed Payments
export const failedPaymentsStore: FailedPaymentRecord[] = [
  {
    id: 'FAIL-9021',
    businessName: 'Apex Plumbing & Rooter LLC (Texas)',
    contactEmail: 'billing@apexplumbing-tx.com',
    contactPhone: '+1 (817) 555-0144',
    amountUSD: 999,
    gateway: 'razorpay',
    failureReason: 'Card issuer 3DS verification timeout',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    recoveryStatus: 'PENDING_RETRY',
    suggestedAction: 'Send direct 1-click Razorpay retry link via SMS',
  },
  {
    id: 'FAIL-8842',
    businessName: 'Summit Air & Mechanical (Florida)',
    contactEmail: 'owner@summitairfl.com',
    contactPhone: '+1 (305) 555-0812',
    amountUSD: 1299,
    gateway: 'cards',
    failureReason: 'Daily international card transaction limit exceeded',
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    recoveryStatus: 'RECOVERY_SENT',
    suggestedAction: 'Sent secondary PayPal retry subscription link',
  },
  {
    id: 'FAIL-7923',
    businessName: 'BlueWave Heating & Cooling (California)',
    contactEmail: 'accounts@bluewavehvac.com',
    contactPhone: '+1 (415) 555-0391',
    amountUSD: 999,
    gateway: 'paypal',
    failureReason: 'Insufficient PayPal wallet balance (Prompted card backup)',
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    recoveryStatus: 'PENDING_RETRY',
    suggestedAction: 'Trigger automated 24-hr payment re-engagement',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    totalFailed: failedPaymentsStore.length,
    failedValueUSD: failedPaymentsStore.reduce((acc, curr) => acc + curr.amountUSD, 0),
    records: failedPaymentsStore,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRecord: FailedPaymentRecord = {
      id: `FAIL-${Math.floor(1000 + Math.random() * 9000)}`,
      businessName: body.businessName || 'Anonymous Contractor',
      contactEmail: body.contactEmail || 'unregistered@checkout.com',
      contactPhone: body.contactPhone || 'Unknown Phone',
      amountUSD: body.amountUSD || 999,
      gateway: body.gateway || 'razorpay',
      failureReason: body.failureReason || 'Declined by payment partner',
      timestamp: new Date().toISOString(),
      recoveryStatus: 'PENDING_RETRY',
      suggestedAction: 'Send direct WhatsApp / SMS subscription retry link',
    };

    failedPaymentsStore.unshift(newRecord);
    return NextResponse.json({ success: true, record: newRecord });
  } catch {
    return NextResponse.json({ error: 'Failed to record failed payment' }, { status: 500 });
  }
}
