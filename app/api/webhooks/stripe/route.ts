import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { eventBus } from '@/lib/event-bus';

const STRIPE_SIGNATURE_TOLERANCE_SECONDS = 300;

type StripeWebhookPayload = {
  type: string;
  data: {
    object: Record<string, unknown>;
  };
};

/**
 * Validate Stripe's signed timestamp and v1 HMAC using the exact raw request body.
 * The timestamp check limits replay of otherwise valid captured webhook requests.
 */
function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string
): boolean {
  const values = new Map<string, string[]>();

  for (const component of signatureHeader.split(',')) {
    const separator = component.indexOf('=');
    if (separator <= 0) continue;

    const key = component.slice(0, separator).trim();
    const value = component.slice(separator + 1).trim();
    const existing = values.get(key) ?? [];
    existing.push(value);
    values.set(key, existing);
  }

  const timestampText = values.get('t')?.[0];
  if (!timestampText || !/^\d+$/.test(timestampText)) return false;

  const timestamp = Number(timestampText);
  if (!Number.isSafeInteger(timestamp)) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - timestamp);
  if (ageSeconds > STRIPE_SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac('sha256', webhookSecret)
    .update(`${timestampText}.${rawBody}`, 'utf8')
    .digest();

  const signatures = values.get('v1') ?? [];
  return signatures.some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;

    const actual = Buffer.from(signature, 'hex');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Never accept mock or unsigned payloads through a public production webhook.
  if (!webhookSecret) {
    console.error('Stripe webhook rejected: STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { success: false, error: 'Webhook endpoint is not configured' },
      { status: 503 }
    );
  }

  if (!signatureHeader || !verifyStripeSignature(rawBody, signatureHeader, webhookSecret)) {
    return NextResponse.json(
      { success: false, error: 'Invalid Stripe webhook signature' },
      { status: 400 }
    );
  }

  let eventPayload: StripeWebhookPayload;
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('type' in parsed) ||
      typeof parsed.type !== 'string' ||
      !('data' in parsed) ||
      typeof parsed.data !== 'object' ||
      parsed.data === null ||
      !('object' in parsed.data) ||
      typeof parsed.data.object !== 'object' ||
      parsed.data.object === null ||
      Array.isArray(parsed.data.object)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid Stripe event payload' },
        { status: 400 }
      );
    }
    eventPayload = parsed as StripeWebhookPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  try {
    const { type, data } = eventPayload;
    const obj = data.object;

    switch (type) {
      case 'checkout.session.completed':
        await eventBus.emit('checkout.completed', {
          customerId: obj.customer,
          customerEmail:
            obj.customer_email ||
            (obj.customer_details as Record<string, unknown> | undefined)?.email,
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
        await eventBus.emit(
          'opportunity.created',
          {
            type: 'failed_payment',
            customerId: obj.customer,
            amount: obj.amount_due,
            reason: 'Card decline or insufficient funds',
          },
          { actorAgent: 'RevenueRecoveryAgent' }
        );
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
        // Acknowledge valid but currently unsupported event types to avoid retry storms.
        console.info(`Unhandled verified Stripe webhook event: ${type}`);
    }

    eventBus.logAudit({
      channel: 'webchat',
      recipient: (obj.customer_email as string) || 'stripe_system',
      consent_basis: 'Stripe webhook signature verified',
      message_snippet: `Processed event ${type}`,
      status: 'approved',
      agent: 'StripeWebhookHandler',
      organization_id: 'org_summit_hvac',
    });

    return NextResponse.json({ received: true, event: type });
  } catch (error: unknown) {
    // Return 5xx so Stripe can retry transient processing failures.
    console.error('Stripe webhook processing failed', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
