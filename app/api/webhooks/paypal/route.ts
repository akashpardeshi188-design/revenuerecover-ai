import { NextRequest, NextResponse } from 'next/server';
import {
  getPayPalAccessToken,
  getPayPalConfig,
  payPalRequest,
  supabaseServiceRpc,
} from '@/lib/paypal-rest';

export const runtime = 'nodejs';

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: Record<string, unknown>;
};

type VerificationResponse = {
  verification_status?: string;
};

export async function POST(request: NextRequest) {
  const config = getPayPalConfig();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!config || !webhookId || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('PayPal webhook is not configured for this deployment');
    return NextResponse.json(
      { received: false, error: 'Webhook endpoint is not configured.' },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  let event: PayPalWebhookEvent;
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed) ||
      !('id' in parsed) ||
      typeof parsed.id !== 'string' ||
      !('event_type' in parsed) ||
      typeof parsed.event_type !== 'string' ||
      !('resource' in parsed) ||
      typeof parsed.resource !== 'object' ||
      parsed.resource === null ||
      Array.isArray(parsed.resource)
    ) {
      return NextResponse.json(
        { received: false, error: 'Invalid PayPal webhook payload.' },
        { status: 400 }
      );
    }
    event = parsed as PayPalWebhookEvent;
  } catch {
    return NextResponse.json(
      { received: false, error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }

  const transmissionId = request.headers.get('paypal-transmission-id');
  const transmissionTime = request.headers.get('paypal-transmission-time');
  const transmissionSig = request.headers.get('paypal-transmission-sig');
  const authAlgo = request.headers.get('paypal-auth-algo');
  const certUrl = request.headers.get('paypal-cert-url');

  if (
    !transmissionId ||
    !transmissionTime ||
    !transmissionSig ||
    !authAlgo ||
    !certUrl
  ) {
    return NextResponse.json(
      { received: false, error: 'Missing PayPal signature headers.' },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getPayPalAccessToken(config);

    // Embed the original raw request body as the nested webhook_event JSON.
    // Re-stringifying the parsed event can change formatting and break verification.
    const verificationBody =
      `{"transmission_id":${JSON.stringify(transmissionId)},` +
      `"transmission_time":${JSON.stringify(transmissionTime)},` +
      `"cert_url":${JSON.stringify(certUrl)},` +
      `"auth_algo":${JSON.stringify(authAlgo)},` +
      `"transmission_sig":${JSON.stringify(transmissionSig)},` +
      `"webhook_id":${JSON.stringify(webhookId)},` +
      `"webhook_event":${rawBody}}`;

    const verification = await payPalRequest<VerificationResponse>(
      config,
      accessToken,
      '/v1/notifications/verify-webhook-signature',
      {
        method: 'POST',
        body: verificationBody,
      }
    );

    if (
      !verification.response.ok ||
      verification.payload?.verification_status !== 'SUCCESS'
    ) {
      console.warn('PayPal webhook signature rejected', {
        eventId: event.id,
        eventType: event.event_type,
        providerStatus: verification.response.status,
      });
      return NextResponse.json(
        { received: false, error: 'PayPal webhook signature verification failed.' },
        { status: 400 }
      );
    }

    const processed = await supabaseServiceRpc<Record<string, unknown>>(
      'process_paypal_webhook_event',
      {
        p_event_id: event.id,
        p_event_type: event.event_type,
        p_resource: event.resource,
      }
    );

    if (!processed.response.ok || !processed.payload) {
      console.error('Verified PayPal webhook could not be persisted', {
        eventId: event.id,
        eventType: event.event_type,
        databaseStatus: processed.response.status,
      });
      // A non-2xx response lets PayPal retry transient persistence failures.
      return NextResponse.json(
        { received: false, error: 'Could not persist verified PayPal event.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      received: true,
      duplicate: processed.payload.duplicate === true,
      processed: processed.payload.processed === true,
    });
  } catch (error: unknown) {
    console.error('PayPal webhook processing failed', {
      eventId: event.id,
      eventType: event.event_type,
      errorCode: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    });
    return NextResponse.json(
      { received: false, error: 'Webhook processing failed.' },
      { status: 500 }
    );
  }
}
