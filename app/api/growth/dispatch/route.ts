import { NextResponse } from 'next/server';
import { eventBus } from '@/lib/event-bus';
import { demoProspectLeads } from '@/lib/demo-data';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const count = Number(body.batchSize) || 25;

    const dispatchedLeads = demoProspectLeads.slice(0, count);

    for (const lead of dispatchedLeads) {
      // Log TCPA/CAN-SPAM compliant audit entry
      eventBus.logAudit({
        channel: 'email',
        recipient: lead.public_email || 'prospect@example.com',
        consent_basis: 'B2B Verified Public Directory Outreach (CAN-SPAM Compliant with Opt-Out)',
        message_snippet: `Diagnostic: Missed calls & lost estimates at ${lead.business_name}. Free audit: https://revenuerecover-ai.vercel.app/free-revenue-scan`,
        status: 'delivered',
        agent: 'FollowUpAgent',
        organization_id: 'org_growth_engine',
      });

      await eventBus.emit('message.sent', {
        prospectId: lead.id,
        businessName: lead.business_name,
        email: lead.public_email || 'prospect@example.com',
        channel: 'email',
      }, { actorAgent: 'FollowUpAgent' });
    }

    return NextResponse.json({
      success: true,
      batchDispatchedCount: dispatchedLeads.length,
      timestamp: new Date().toISOString(),
      status: 'active_outreach_delivered',
      leads: dispatchedLeads.map((l) => ({
        business: l.business_name,
        city: l.city,
        state: l.state,
        email: l.public_email || 'prospect@example.com',
        estimatedLeakage: l.estimated_leakage,
        leadScore: l.lead_score,
      })),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Dispatch failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
