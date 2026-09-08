import { NextResponse } from 'next/server';
import { AISDRAgent, GrowthLead } from '@/lib/growth-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead: GrowthLead = body.lead;
    const message = body.message;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Prospect message is required' },
        { status: 400 }
      );
    }

    const sdrResult = await AISDRAgent.processProspectReply(lead || {
      id: 'demo_lead',
      companyName: 'Sample HVAC Pros',
      industry: 'HVAC',
      city: 'Dallas',
      stateProvince: 'TX'
    }, message);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      sdrResult
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'AI SDR processing failed' },
      { status: 500 }
    );
  }
}
