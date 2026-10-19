import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { eventBus } from '@/lib/event-bus';

export const runtime = 'nodejs';

function verifyRazorpaySignature(rawBody: string, signature: string, secret: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest();
  const supplied = Buffer.from(signature, 'hex');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  const signature = req.headers.get('x-razorpay-signature');
  if (!secret) return NextResponse.json({ error: 'Razorpay webhook is not configured.' }, { status: 503 });
  if (!signature) return NextResponse.json({ error: 'Missing Razorpay signature.' }, { status: 400 });

  try {
    const rawBody = await req.text();
    if (!verifyRazorpaySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid Razorpay signature.' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as {
      event?: string;
      payload?: { payment?: { entity?: Record<string, unknown> } };
    };
    if (typeof payload.event !== 'string') {
      return NextResponse.json({ error: 'Invalid Razorpay event payload.' }, { status: 400 });
    }

    const event = payload.event;
    const entity = payload.payload?.payment?.entity || {};
    if (event !== 'payment.captured' && event !== 'order.paid') {
      return NextResponse.json({ received: true, event, status: 'ignored' });
    }

    const amountPaise = Number(entity.amount);
    const paymentId = typeof entity.id === 'string' ? entity.id : null;
    if (!paymentId || !Number.isFinite(amountPaise) || amountPaise <= 0) {
      return NextResponse.json({ error: 'Captured payment data is incomplete.' }, { status: 400 });
    }

    const amount = amountPaise / 100;
    const email = typeof entity.email === 'string' ? entity.email : 'payment_event_without_email';
    eventBus.logAudit({
      channel: 'email',
      recipient: email,
      consent_basis: 'Verified Razorpay payment webhook',
      message_snippet: `Razorpay event ${event}: ₹${amount.toFixed(2)} captured`,
      status: 'approved',
      agent: 'BillingAgent',
      organization_id: 'webhook_unassigned',
    });

    await eventBus.emit('opportunity.recovered', {
      amountINR: amount,
      paymentId,
      gateway: 'Razorpay',
      status: 'captured',
    }, { actorAgent: 'BillingAgent' });

    return NextResponse.json({ received: true, signatureVerified: true, event, amount, status: 'processed' });
  } catch {
    return NextResponse.json({ success: false, error: 'Webhook payload could not be processed.' }, { status: 400 });
  }
}
