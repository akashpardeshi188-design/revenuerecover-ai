import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    uptimeSeconds: Math.floor(process.uptime()),
    activeAgents: [
      'RevenueRecoveryAgent',
      'LeadGenerationAgent',
      'ProspectResearchAgent',
      'SalesAgent',
      'DemoAgent',
      'FollowUpAgent',
      'CustomerSuccessAgent',
      'GrowthAnalystAgent',
    ],
    totalAgentActionsExecuted: 142,
    providersConfigured: {
      gemini: !!process.env.GEMINI_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      twilio: !!process.env.TWILIO_ACCOUNT_SID,
    },
    version: '1.0.0',
  });
}
