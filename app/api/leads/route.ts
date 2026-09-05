import { NextRequest, NextResponse } from 'next/server';
import { LeadCaptureEngine } from '@/lib/discovery/lead-engine';
import { LeadDeduplicationEngine } from '@/lib/discovery/lead-deduplication';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId') || 'org_default';

  const opportunities = LeadDeduplicationEngine.getAllOpportunities(tenantId);

  return NextResponse.json({
    success: true,
    totalOpportunities: opportunities.length,
    opportunities,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await LeadCaptureEngine.ingestLead({
      tenantId: body.tenantId || 'org_default',
      sourceType: body.sourceType || 'INBOUND_FORM',
      sourceChannel: body.sourceChannel || 'WEBSITE_CONTACT_FORM',
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      serviceCategory: body.serviceCategory || 'HVAC',
      serviceRequested: body.serviceRequested || 'Emergency Repair Assistance',
      issueDescription: body.issueDescription,
      city: body.city || 'Dallas',
      stateProvince: body.stateProvince || 'TX',
      postalCode: body.postalCode || '75201',
      country: body.country || 'USA',
      urgency: body.urgency || 'HIGH',
      estimatedJobValueUSD: body.estimatedJobValueUSD,
      rawMetadata: body.rawMetadata,
    });

    return NextResponse.json({
      success: true,
      lead: result.lead,
      event: result.event,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
