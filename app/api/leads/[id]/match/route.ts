import { NextRequest, NextResponse } from 'next/server';
import { ContractorMatchingEngine } from '@/lib/discovery/contractor-matcher';
import { GlobalBusinessDiscoveryEngine } from '@/lib/discovery/discovery-engine';
import { Lead } from '@/lib/discovery/types';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const sampleLead: Lead = {
      id,
      tenantId: body.tenantId || 'org_default',
      sourceType: 'SEARCH_MAPS',
      sourceChannel: 'MISSED_PHONE_CALL',
      customerName: body.customerName || 'Dallas Homeowner',
      customerPhoneE164: body.customerPhoneE164 || '+12145550188',
      serviceCategory: body.serviceCategory || 'HVAC',
      serviceRequested: body.serviceRequested || 'Emergency AC repair in Dallas',
      city: body.city || 'Dallas',
      stateProvince: body.stateProvince || 'TX',
      postalCode: body.postalCode || '75201',
      country: body.country || 'USA',
      urgency: 'HIGH',
      estimatedJobValueUSD: 650,
      leadScore: 88,
      leadClassification: 'HOT',
      scoreReasons: ['High urgency', 'Direct phone callback'],
      aiClassificationExplanation: 'HOT lead in Dallas',
      consentStatus: 'IMPLIED_INQUIRY',
      consentTimestamp: new Date().toISOString(),
      isDuplicate: false,
      masterOpportunityId: 'opp_demo',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Find candidate contractors
    const discovery = await GlobalBusinessDiscoveryEngine.runDiscoveryJob({
      country: sampleLead.country,
      city: sampleLead.city,
      category: sampleLead.serviceCategory,
      radiusMiles: 25,
      limitPerSource: 5,
    });

    const matches = ContractorMatchingEngine.matchLeadToContractors(sampleLead, discovery.businesses);

    return NextResponse.json({
      success: true,
      leadId: id,
      totalMatchedContractors: matches.length,
      matches,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
