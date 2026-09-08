import { NextResponse } from 'next/server';
import { ALL_GROWTH_AGENTS, QAAgent, SecurityAgent } from '@/lib/growth-engine';

export async function GET() {
  const qa = QAAgent.runSmokeTests();
  const sec = SecurityAgent.auditEnvironmentSecurity();

  const agentsStatus = ALL_GROWTH_AGENTS.map((agentName, idx) => ({
    id: idx + 1,
    name: agentName,
    status: 'ACTIVE',
    mode: 'AUTONOMOUS',
    confidenceScore: 95 + (idx % 4),
    requiresHumanEscalation: agentName.includes('PaidAds')
  }));

  return NextResponse.json({
    success: true,
    totalAgents: ALL_GROWTH_AGENTS.length,
    agents: agentsStatus,
    security: sec.data,
    qa: qa.data
  });
}
