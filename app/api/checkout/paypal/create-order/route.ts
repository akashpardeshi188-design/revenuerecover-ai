import { NextRequest, NextResponse } from 'next/server';

/**
 * RevenueRecover AI — Official PayPal Live Order Creation Route
 * Uses official PayPal v2 REST APIs with OAuth2 token auth
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
    const { planId = 'growth', amountUSD = 119, businessName = 'Valued Client' } = body;

    const accessToken = await getPayPalAccessToken();
    const isLive = process.env.PAYPAL_MODE === 'live';
    const baseURL = isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `RRAI-${Date.now()}`,
          description: `RevenueRecover AI ${planId.toUpperCase()} Subscription - ${businessName}`,
          custom_id: businessName,
          amount: {
            currency_code: 'USD',
            value: Number(amountUSD).toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'RevenueRecover AI',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: 'https://revenuerecover-ai.vercel.app/dashboard',
        cancel_url: 'https://revenuerecover-ai.vercel.app/pricing',
      },
    };

    const response = await fetch(`${baseURL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await response.json();

    if (!response.ok) {
      console.error('PayPal Order Creation Error:', orderData);
      return NextResponse.json({ error: orderData.message || 'Failed to create PayPal order' }, { status: 400 });
    }

    return NextResponse.json({
      id: orderData.id,
      status: orderData.status,
      links: orderData.links,
    });
  } catch (error: any) {
    console.error('Server error creating PayPal order:', error);
    return NextResponse.json({ error: error.message || 'Internal PayPal Error' }, { status: 500 });
  }
}
