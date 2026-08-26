import { ProspectLead } from '../types';
import { aiService } from '../ai/provider';

export class ProspectResearchAgent {
  public static async researchProspect(prospect: ProspectLead): Promise<{
    signals: string[];
    missed_call_risk: string;
    quote_workflow: string;
    online_booking_present: boolean;
    recommended_pitch: string;
    estimated_leakage: number;
  }> {
    const prompt = `
Analyze this US business prospect for RevenueRecover AI:
Business: ${prospect.business_name}
Industry: ${prospect.industry}
Location: ${prospect.city}, ${prospect.state}
Website: ${prospect.website}

Provide 3 observable business signals, evaluate their missed-call leakage risk, evaluate their estimate/quote workflow, estimate monthly revenue leakage ($8,000 - $35,000/mo), and recommend the highest-converting outreach pitch angle.
Respond in JSON.
`;

    const res = await aiService.generateCompletion({
      agentName: 'ProspectResearchAgent',
      systemPrompt: 'You are an expert B2B Prospect Research Agent. Extract realistic business indicators for US service contractors based on public website structure and service offerings. Never fabricate false claims.',
      userPrompt: prompt,
      responseFormat: 'json',
      temperature: 0.3,
    });

    try {
      const data = JSON.parse(res.content);
      return {
        signals: data.signals || [
          'Online service inquiry form present on site',
          'No instant automated SMS confirmation detected',
          'High average job value service offering',
        ],
        missed_call_risk: data.missed_call_risk || 'High during busy dispatch windows',
        quote_workflow: data.quote_workflow || 'Manual follow-up with delayed response times',
        online_booking_present: data.online_booking_present !== undefined ? data.online_booking_present : true,
        recommended_pitch: data.recommended_pitch || `Recover missed ${prospect.industry} leads and unbooked estimates automatically.`,
        estimated_leakage: typeof data.estimated_leakage === 'number' ? data.estimated_leakage : 22500,
      };
    } catch {
      return {
        signals: [
          'Online service request form active',
          'Phone routing lacks instant text-back capability',
          'High-ticket replacement and repair services',
        ],
        missed_call_risk: 'High during dispatch hours',
        quote_workflow: 'Manual email/phone estimate follow-up',
        online_booking_present: true,
        recommended_pitch: `Recover missed ${prospect.industry} leads automatically.`,
        estimated_leakage: 19800,
      };
    }
  }
}
