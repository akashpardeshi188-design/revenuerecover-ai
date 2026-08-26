import { aiService } from '../ai/provider';

export interface SalesQualificationInput {
  industry: string;
  monthlyLeads: number;
  avgJobValue: number;
  crm?: string;
  currentProcess?: string;
  buyingIntent?: 'high' | 'medium' | 'low';
}

export interface SalesQualificationResult {
  tier: 'HOT LEAD' | 'WARM LEAD' | 'NURTURE' | 'NOT A FIT';
  score: number;
  reasoning: string[];
  recommendedAction: string;
  estimatedMonthlyROI: string;
}

export class SalesAgent {
  private static productKnowledgeBase = `
Product: RevenueRecover AI
Core Promise: Find lost revenue. Follow up intelligently. Recover more money.
Target Market: US home service & professional businesses (HVAC, Plumbing, Electrical, Roofing, General Contractors, Dental, Med Spa, Auto Repair, Cleaning, Real Estate, Legal).
Pricing Tiers:
- Starter: $49/month (up to 50 recovered opportunities, SMS/Email follow-up, basic reporting, Copilot approval mode).
- Growth: $149/month (unlimited opportunities, full CRM & billing integrations, automated multi-channel sequences, Supervised Autopilot).
- Pro: $299/month (multi-location management, dedicated AI tuning, custom integrations, enterprise SLA, Full Autopilot).
- Enterprise: Custom pricing for multi-branch franchises.
Integrations Supported: ServiceTitan, Housecall Pro, Jobber, Stripe, QuickBooks, Twilio, Google Calendar, HubSpot, Zapier.
Key Features:
- Missed-call 45-second instant text-back
- Automated multi-touch quote & estimate follow-up
- Past-due invoice & failed credit card retry links
- Seasonal customer tune-up reactivation
- 100% human control: Copilot mode (1-click approval), Supervised Autopilot, and Emergency Global Kill Switch
- TCPA & CAN-SPAM built-in quiet hours and opt-out suppression compliance
- 14-day free trial, cancel anytime with 1 click in billing portal.
`;

  public static async answerQuestion(userQuestion: string, context?: Record<string, unknown>): Promise<{
    answer: string;
    suggestedFollowUp?: string;
    cta: { text: string; link: string };
    confidence: number;
  }> {
    const prompt = `
Context Knowledge Base:
${this.productKnowledgeBase}

Visitor/Prospect Question:
"${userQuestion}"

Visitor Context: ${JSON.stringify(context || {})}

Provide a warm, consultative, highly accurate answer based ONLY on the product knowledge base above. Never invent unlisted features. Close with a helpful prompt leading towards running a Free Revenue Scan or starting a 14-day trial.
`;

    const res = await aiService.generateCompletion({
      agentName: 'SalesAgent',
      systemPrompt: 'You are Alex, the senior AI Sales Development Representative for RevenueRecover AI. You are knowledgeable, concise, honest, and helpful. You never hallucinate false features.',
      userPrompt: prompt,
      temperature: 0.3,
    });

    return {
      answer: res.content,
      suggestedFollowUp: 'Would you like to run a free 60-second revenue leak scan for your business?',
      cta: {
        text: 'Run Free Revenue Scan',
        link: '/free-revenue-scan',
      },
      confidence: res.isFallback ? 95 : 98,
    };
  }

  public static qualifyLead(input: SalesQualificationInput): SalesQualificationResult {
    const leads = input.monthlyLeads || 50;
    const jobVal = input.avgJobValue || 1200;
    const monthlyOpp = leads * 0.18 * jobVal;

    const highTicketIndustries = ['hvac', 'plumbing', 'roofing', 'electrical', 'contractor'];
    const isHighTicket = highTicketIndustries.some((i) => input.industry.toLowerCase().includes(i));

    const reasoning: string[] = [];
    let score = 50;

    if (isHighTicket) {
      score += 25;
      reasoning.push(`High-ticket industry (${input.industry}) where 1 recovered job covers an entire year of software.`);
    }

    if (jobVal >= 1000) {
      score += 15;
      reasoning.push(`Average job value of $${jobVal.toLocaleString()} provides high recovery ROI.`);
    }

    if (leads >= 40) {
      score += 10;
      reasoning.push(`Strong lead flow (${leads} leads/mo) ensures consistent weekly opportunity generation.`);
    }

    let tier: SalesQualificationResult['tier'] = 'WARM LEAD';
    if (score >= 80) tier = 'HOT LEAD';
    else if (score < 50) tier = 'NURTURE';

    return {
      tier,
      score,
      reasoning,
      recommendedAction: tier === 'HOT LEAD' ? 'Offer 14-Day Free Trial on Growth Plan' : 'Invite to Interactive Demo Sandbox',
      estimatedMonthlyROI: `$${Math.round(monthlyOpp).toLocaleString()}/month in recoverable revenue`,
    };
  }
}
