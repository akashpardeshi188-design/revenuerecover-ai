import { NextRequest, NextResponse } from 'next/server';

/**
 * RevenueRecover AI — Official PayPal Live Order Capture Route
 * Finalizes customer payment and records live transaction status
 */

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const isLive = process.env.PAYPAL_MODE === 'live';
  const baseURL = isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal Client ID or Secret in environment configuration.');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${baseURL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`PayPal OAuth failed: ${data.error_description || data.message || 'Unknown error'}`);
  }

  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json({ error: 'Missing PayPal orderID' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();
    const isLive = process.env.PAYPAL_MODE === 'live';
    const baseURL = isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${baseURL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await response.json();

    if (!response.ok) {
      console.error('PayPal Order Capture Error:', captureData);
      return NextResponse.json({ error: captureData.message || 'Failed to capture PayPal order' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      orderID: captureData.id,
      status: captureData.status,
      payer: captureData.payer,
      purchaseUnits: captureData.purchase_units,
    });
  } catch (error: any) {
    console.error('Server error capturing PayPal order:', error);
    return NextResponse.json({ error: error.message || 'Internal PayPal Capture Error' }, { status: 500 });
  }
}
