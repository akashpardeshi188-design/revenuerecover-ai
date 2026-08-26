import { NextResponse } from 'next/server';
import { SalesAgent } from '@/lib/agents/sales-agent';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, context } = body;

    if (!question) {
      return NextResponse.json({ success: false, error: 'Question is required' }, { status: 400 });
    }

    const answerData = await SalesAgent.answerQuestion(question, context);
    return NextResponse.json({ success: true, ...answerData });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
