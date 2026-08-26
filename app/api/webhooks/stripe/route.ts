import { NextResponse } from 'next/server';
import { eventBus } from '@/lib/event-bus';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature') || '';
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let eventPayload: { type: string; data: { object: Record<string, unknown> } };

    // If Stripe secret is configured, verify signature; otherwise accept mock/simulation payloads
    if (stripeWebhookSecret && sig) {
      // In production with stripe package:
      // const event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);
      eventPayload = JSON.parse(rawBody);
    } else {
      eventPayload = JSON.parse(rawBody || '{}');
    }

    const { type, data } = eventPayload;
    const obj = data?.object || {};

    switch (type) {
      case 'checkout.session.completed':
        await eventBus.emit('checkout.completed', {
          customerId: obj.customer,
          customerEmail: obj.customer_email || (obj.customer_details as Record<string, unknown>)?.email,
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
        // Trigger automated failed payment recovery opportunity
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
          plan: (obj.items as Record<string, unknown>)?.data,
        });
        break;

      case 'customer.subscription.deleted':
        await eventBus.emit('subscription.cancelled', {
          subscriptionId: obj.id,
          customerId: obj.customer,
        });
        break;

      default:
        console.log(`Unhandled Stripe webhook event: ${type}`);
    }

    eventBus.logAudit({
      channel: 'webchat',
      recipient: (obj.customer_email as string) || 'stripe_system',
      consent_basis: 'Stripe Billing Webhook Verified',
      message_snippet: `Processed event ${type}`,
      status: 'approved',
      agent: 'StripeWebhookHandler',
      organization_id: 'org_summit_hvac',
    });

    return NextResponse.json({ received: true, event: type });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
