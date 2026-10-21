import { NextRequest, NextResponse } from 'next/server';
import {
  getRazorpayConfig,
  verifyRazorpayWebhookSignature,
} from '@/lib/razorpay-rest';
import { supabaseServiceRpc } from '@/lib/paypal-rest';

export const runtime = 'nodejs';

type RazorpayWebhookPayload = {
  entity?: string;
  account_id?: string;
  event?: string;
  contains?: string[];
  payload?: {
    payment?: { entity?: Record<string, unknown> };
    subscription?: { entity?: Record<string, unknown> };
    order?: { entity?: Record<string, unknown> };
  };
  created_at?: number;
};

export async function POST(request: NextRequest) {
  const config = getRazorpayConfig();
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!config || !webhookSecret || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Razorpay webhook is not configured for this deployment');
    return NextResponse.json(
      { received: false, error: 'Webhook endpoint is not configured.' },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  let parsed: RazorpayWebhookPayload;
  try {
    const json = JSON.parse(rawBody);
    if (typeof json !== 'object' || json === null || Array.isArray(json) || !('event' in json)) {
      return NextResponse.json(
        { received: false, error: 'Invalid Razorpay webhook payload format.' },
        { status: 400 }
      );
    }
    parsed = json as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json(
      { received: false, error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }

  const signature = request.headers.get('x-razorpay-signature');
  if (!signature) {
    return NextResponse.json(
      { received: false, error: 'Missing Razorpay signature header.' },
      { status: 400 }
    );
  }

  // 1. Authoritative Webhook Signature Verification against raw request body
  const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
  if (!isValid) {
    console.warn('Razorpay webhook signature verification failed', {
      event: parsed.event,
    });
    return NextResponse.json(
      { received: false, error: 'Razorpay webhook signature verification failed.' },
      { status: 400 }
    );
  }

  const eventType = parsed.event || 'unknown';
  const headerEventId = request.headers.get('x-razorpay-event-id');
  const entityId =
    (parsed.payload?.subscription?.entity?.id as string) ||
    (parsed.payload?.payment?.entity?.id as string) ||
    '';
  const eventId = headerEventId || `${eventType}_${entityId}_${parsed.created_at || Date.now()}`;

  // 2. Authoritative Idempotent Event Persistence via Supabase Service Role RPC
  try {
    const processed = await supabaseServiceRpc<Record<string, unknown>>(
      'process_razorpay_webhook_event',
      {
        p_event_id: eventId,
        p_event_type: eventType,
        p_payload: parsed,
      }
    );

    if (!processed.response.ok || !processed.payload) {
      console.error('Verified Razorpay webhook could not be persisted in Supabase', {
        eventId,
        eventType,
        status: processed.response.status,
      });
      // Return 500 so Razorpay retries transient failures
      return NextResponse.json(
        { received: false, error: 'Could not persist verified Razorpay event.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      received: true,
      duplicate: processed.payload.duplicate === true,
      processed: processed.payload.processed === true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    console.error('Razorpay webhook processing exception', {
      eventId,
      eventType,
      message,
    });
    return NextResponse.json(
      { received: false, error: 'Webhook processing failed.' },
      { status: 500 }
    );
  }
}
