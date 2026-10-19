import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { eventBus } from '@/lib/event-bus';

export const runtime = 'nodejs';

function verifyStripeSignature(rawBody: string, header: string, secret: string): boolean {
  const parts = header.split(',').map(value => value.trim());
  const timestamp = Number(parts.find(value => value.startsWith('t='))?.slice(2));
  const signatures = parts.filter(value => value.startsWith('v1=')).map(value => value.slice(3));

  if (!Number.isSafeInteger(timestamp) || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > 300) return false;

  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest();
  return signatures.some(signature => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
    const supplied = Buffer.from(signature, 'hex');
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
  });
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');
  if (!secret) return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });

  try {
    const rawBody = await req.text();
    if (!verifyStripeSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as {
      id?: string;
      type?: string;
      data?: { object?: Record<string, unknown> };
    };
    if (typeof payload.type !== 'string' || !payload.data?.object) {
      return NextResponse.json({ error: 'Invalid Stripe event payload.' }, { status: 400 });
    }

    const { type } = payload;
    const obj = payload.data.object;
    const customerDetails = obj.customer_details as Record<string, unknown> | undefined;
    const customerEmail = typeof obj.customer_email === 'string'
      ? obj.customer_email
      : typeof customerDetails?.email === 'string' ? customerDetails.email : undefined;

    switch (type) {
      case 'checkout.session.completed':
        await eventBus.emit('checkout.completed', {
          customerId: obj.customer,
          customerEmail,
          amountTotal: obj.amount_total,
          subscriptionId: obj.subscription,
        });
        break;
      case 'payment_intent.succeeded':
        await eventBus.emit('payment.succeeded', {
          paymentIntentId: obj.id,
          amount: obj.amount,
          currency: obj.currency,
        });
        break;
      case 'invoice.paid':
        await eventBus.emit('invoice.paid', {
          invoiceId: obj.id,
          amountPaid: obj.amount_paid,
          subscriptionId: obj.subscription,
        });
        break;
      case 'invoice.payment_failed':
        await eventBus.emit('opportunity.created', {
          type: 'failed_payment',
          customerId: obj.customer,
          amount: obj.amount_due,
          reason: 'Card decline or insufficient funds',
        }, { actorAgent: 'RevenueRecoveryAgent' });
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await eventBus.emit('subscription.updated', {
          subscriptionId: obj.id,
          status: obj.status,
          plan: (obj.items as Record<string, unknown> | undefined)?.data,
        });
        break;
      case 'customer.subscription.deleted':
        await eventBus.emit('subscription.cancelled', {
          subscriptionId: obj.id,
          customerId: obj.customer,
        });
        break;
      default:
        // A valid but unhandled provider event is acknowledged without taking action.
        console.info('Unhandled verified Stripe webhook event:', type);
    }

    const metadata = obj.metadata as Record<string, unknown> | undefined;
    const companyId = typeof metadata?.company_id === 'string' ? metadata.company_id : 'webhook_unassigned';
    eventBus.logAudit({
      channel: 'webchat',
      recipient: customerEmail || 'stripe_system',
      consent_basis: 'Verified Stripe webhook signature',
      message_snippet: `Processed verified event ${type}`,
      status: 'approved',
      agent: 'StripeWebhookHandler',
      organization_id: companyId,
    });

    return NextResponse.json({ received: true, event: type });
  } catch {
    return NextResponse.json({ success: false, error: 'Webhook payload could not be processed.' }, { status: 400 });
  }
}
