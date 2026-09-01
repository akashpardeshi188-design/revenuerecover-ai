import { NextResponse } from 'next/server';
import { eventBus } from '@/lib/event-bus';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { leadEmail = 'demo-user@example.com', business = 'Metro Services', leakage = '$24,800/mo', stage = 'Touch 2' } = body;

    // Log the automated retargeting audit
    eventBus.logAudit({
      channel: 'email',
      recipient: leadEmail,
      consent_basis: 'Inbound Demo / Scan Lead Re-engagement Request',
      message_snippet: `Demo Follow-up (${stage}): Reserved ${leakage} pipeline for ${business}. 60% OFF Lock-in sent.`,
      status: 'delivered',
      agent: 'SalesAgent',
      organization_id: 'org_live_production',
    });

    await eventBus.emit('campaign.launched', {
      type: 'demo_lead_retargeting',
      recipient: leadEmail,
      business,
      leakage,
      stage,
      discount: '60% OFF ($597.50 -> $239 / $297.50 -> $119)',
    }, { actorAgent: 'SalesAgent' });

    return NextResponse.json({
      success: true,
      message: `Demo retargeting sequence (${stage}) triggered successfully for ${business}`,
      leadEmail,
      leakage,
      stage,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Demo retargeting failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
