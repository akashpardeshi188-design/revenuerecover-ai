import { NextRequest, NextResponse } from 'next/server';
import { BusinessVerificationEngine } from '@/lib/discovery/verification-engine';
import { BusinessMaster } from '@/lib/discovery/types';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const sampleBusiness: BusinessMaster = {
      id,
      tenantId: body.tenantId || 'org_default',
      businessName: body.businessName || 'Dallas Pro HVAC LLC',
      normalizedName: 'dallas pro hvac',
      primaryTrade: body.primaryTrade || 'HVAC',
      secondaryTrades: [],
      phoneE164: body.phoneE164 || '+12145550199',
      email: body.email || 'service@dallasprohvac.com',
      website: body.website || 'https://dallasprohvac.com',
      domain: body.domain || 'dallasprohvac.com',
      addressLine1: body.addressLine1 || '1200 Main Street',
      city: body.city || 'Dallas',
      stateProvince: body.stateProvince || 'TX',
      postalCode: body.postalCode || '75201',
      country: body.country || 'USA',
      serviceRadiusMiles: 25,
      verificationScore: 50,
      verificationStatus: 'MEDIUM',
      verificationReasons: [],
      averageRating: 4.8,
      totalReviews: 45,
      sourceCount: 3,
      connectedSourceIds: ['src_google_places', 'src_yelp_fusion', 'src_osm_overpass'],
      dataQualityScore: 90,
      isActive: true,
      isAcceptingLeads: true,
      monthlyCapacity: 50,
      currentActiveLeads: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const verificationResult = BusinessVerificationEngine.evaluate(sampleBusiness);

    return NextResponse.json({
      success: true,
      businessId: id,
      verification: verificationResult,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
