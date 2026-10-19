import { NextResponse } from 'next/server';

export async function GET() {
  const providersConfigured = {
    supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
    paypal: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET && process.env.PAYPAL_MODE),
    razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET),
    twilio: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
  };
  const requiredConfigured = providersConfigured.supabase;
  return NextResponse.json({
    status: requiredConfigured ? 'configured' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    uptimeSeconds: Math.floor(process.uptime()),
    declaredAgents: [
      'RevenueRecoveryAgent',
      'LeadGenerationAgent',
      'ProspectResearchAgent',
      'SalesAgent',
      'DemoAgent',
      'FollowUpAgent',
      'CustomerSuccessAgent',
      'GrowthAnalystAgent',
    ],
    providersConfigured,
    billingNote: 'Provider env flags do not confirm checkout, webhook, or subscription lifecycle end-to-end tests.',
    version: '1.1.0',
  });
}
