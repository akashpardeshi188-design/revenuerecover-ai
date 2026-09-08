import { NextResponse } from 'next/server';
import { AIExecutiveAdvisor, GrowthLead } from '@/lib/growth-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body.query || 'What should we do today?';
    const leads: GrowthLead[] = body.leads || [];

    const response = AIExecutiveAdvisor.answerExecutiveQuery(query, leads);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      advisorResponse: response
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process AI advisor query' },
      { status: 500 }
    );
  }
}
