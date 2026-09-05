import { NextRequest, NextResponse } from 'next/server';
import { AILeadScorer } from '@/lib/discovery/ai-lead-scorer';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const scoreResult = await AILeadScorer.scoreLead({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      serviceCategory: body.serviceCategory || 'HVAC',
      serviceRequested: body.serviceRequested || 'AC compressor not turning on',
      issueDescription: body.issueDescription,
      city: body.city || 'Dallas',
      stateProvince: body.stateProvince || 'TX',
      urgency: body.urgency || 'HIGH',
      channel: body.channel || 'MISSED_PHONE_CALL',
    });

    return NextResponse.json({
      success: true,
      leadId: id,
      scoring: scoreResult,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
