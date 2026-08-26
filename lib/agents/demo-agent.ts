export interface DemoSimulationInput {
  industry: string;
  monthlyLeads: number;
  avgJobValue: number;
  missedFollowUpPercent: number; // e.g. 15 for 15%
}

export interface DemoSimulationResult {
  monthlyLeads: number;
  avgJobValue: number;
  missedLeadsCount: number;
  estimatedLostRevenue: number;
  recoveredOpportunitiesCount: number;
  estimatedRecoveredMonthlyRevenue: number;
  annualRecoveredRevenue: number;
  roiMultiplier: number;
  flywheelSteps: {
    step: number;
    title: string;
    description: string;
    channel: string;
    sampleData: string;
    recoveredIncrement: number;
  }[];
}

export class DemoAgent {
  public static runSimulation(input: DemoSimulationInput): DemoSimulationResult {
    const leads = Math.max(10, input.monthlyLeads || 100);
    const jobVal = Math.max(100, input.avgJobValue || 1200);
    const missedPct = (input.missedFollowUpPercent || 15) / 100;

    const missedLeadsCount = Math.round(leads * missedPct);
    const estimatedLostRevenue = missedLeadsCount * jobVal;

    // AI typically recovers ~35-45% of missed opportunities
    const recoveredOpportunitiesCount = Math.max(1, Math.round(missedLeadsCount * 0.42));
    const estimatedRecoveredMonthlyRevenue = recoveredOpportunitiesCount * jobVal;
    const annualRecoveredRevenue = estimatedRecoveredMonthlyRevenue * 12;

    const monthlySoftwareCost = 149; // Growth Plan
    const roiMultiplier = Math.round((estimatedRecoveredMonthlyRevenue / monthlySoftwareCost) * 10) / 10;

    const flywheelSteps = [
      {
        step: 1,
        title: 'Missed Opportunity Detected',
        description: `Customer submitted service request for ${input.industry} repair but technician was in the field.`,
        channel: 'CRM Webhook',
        sampleData: `Marcus S. requested quote for AC system ($${jobVal.toLocaleString()}) — Uncontacted for 2 hours.`,
        recoveredIncrement: 0,
      },
      {
        step: 2,
        title: 'AI Follow-up Dispatched',
        description: 'RevenueRecover AI analyzes customer profile and sends personalized, friendly text with direct booking availability.',
        channel: 'SMS (Instant)',
        sampleData: '"Hi Marcus, Dave from Summit HVAC here! We have a tech in your area tomorrow afternoon—can we get you scheduled?"',
        recoveredIncrement: 0,
      },
      {
        step: 3,
        title: 'Customer Response Received',
        description: 'Customer replies with scheduling preference; AI classifies intent as Ready to Book.',
        channel: 'SMS Inbound',
        sampleData: '"Yes please! Tomorrow afternoon between 1-3 PM works great."',
        recoveredIncrement: 0,
      },
      {
        step: 4,
        title: 'Appointment Auto-Confirmed',
        description: 'AI syncs dispatch slot directly into Google Calendar / ServiceTitan and sends confirmation details.',
        channel: 'Calendar Integration',
        sampleData: 'Dispatched to Lead Tech Leo • Friday 1:30 PM • Highland Park',
        recoveredIncrement: Math.round(jobVal * 0.2),
      },
      {
        step: 5,
        title: 'Job Completed & Invoiced',
        description: 'Technician finishes replacement job; invoice processed through Stripe / QuickBooks.',
        channel: 'Stripe Billing',
        sampleData: `Invoice #4192 Paid: $${jobVal.toLocaleString()} via Credit Card`,
        recoveredIncrement: Math.round(jobVal * 0.8),
      },
      {
        step: 6,
        title: 'Confirmed Recovered Revenue',
        description: 'Attribution engine links payment back to initial AI follow-up action and updates dashboard ROI.',
        channel: 'Attribution Engine',
        sampleData: `+$${jobVal.toLocaleString()} Added to Confirmed Recovered Revenue (${roiMultiplier}x ROI)`,
        recoveredIncrement: 0,
      },
    ];

    return {
      monthlyLeads: leads,
      avgJobValue: jobVal,
      missedLeadsCount,
      estimatedLostRevenue,
      recoveredOpportunitiesCount,
      estimatedRecoveredMonthlyRevenue,
      annualRecoveredRevenue,
      roiMultiplier,
      flywheelSteps,
    };
  }
}
