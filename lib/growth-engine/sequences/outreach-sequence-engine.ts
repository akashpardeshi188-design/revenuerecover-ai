import { GrowthLead, OutreachSequenceStep, OutreachChannel } from '../types';

export class OutreachSequenceEngine {
  private static defaultSteps: OutreachSequenceStep[] = [
    {
      stepNumber: 0,
      dayOffset: 0,
      channel: 'EMAIL',
      purpose: 'INITIAL_INTRO',
      subjectTemplate: 'Quick question about missed calls at {{company_name}}',
      bodyTemplate: 'Hi {{contact_name}},\n\nI noticed {{company_name}} is doing great service work in {{city}}. Quick question: when your technicians are on job sites during peak heat/cold hours, what is your team’s backup process for unanswered customer calls?\n\nMost {{industry}} contractors in {{state}} lose 10–18 calls a week to competitors simply because techs are on ladders. We built RevenueRecover AI to automatically text back missed callers within 45 seconds and book the job before they call the next shop.\n\nWorth a 2-minute look to see what revenue is slipping through?\n\nBest,\nGrowth Team | RevenueRecover AI',
      requiresReview: false
    },
    {
      stepNumber: 1,
      dayOffset: 2,
      channel: 'EMAIL',
      purpose: 'VALUE_PROOF',
      subjectTemplate: '{{city}} {{industry}} case study: $4,200 recovered in 14 days',
      bodyTemplate: 'Hi {{contact_name}},\n\nFollowing up on my note from Tuesday. One of our {{industry}} partners in your region recovered $4,200 in their first two weeks simply by having our AI instantly text back 3 weekend emergency calls their dispatch missed.\n\nWe also include 150–200 verified local homeowner leads in {{city}} on Day 1.\n\nWould you like me to send over a 60-second video demo showing how the text-back works with your existing phone line?\n\nBest,\nRevenueRecover AI Team',
      requiresReview: false
    },
    {
      stepNumber: 2,
      dayOffset: 5,
      channel: 'SMS',
      purpose: 'PAIN_POINT',
      bodyTemplate: 'Hi {{contact_name}}, this is Alex from RevenueRecover AI. We built an automated 45-second missed-call text-back for {{industry}} shops in {{city}} so unbooked estimates don’t go to competitors. Open to a 14-day zero-risk trial? (Reply STOP to opt out)',
      requiresReview: false
    },
    {
      stepNumber: 3,
      dayOffset: 9,
      channel: 'EMAIL',
      purpose: 'ROI_CASE_STUDY',
      subjectTemplate: 'The math on missed calls for {{company_name}}',
      bodyTemplate: 'Hi {{contact_name}},\n\nHere is the simple math for {{industry}} businesses with your crew size in {{city}}:\n\n• Estimated missed calls: ~12/week\n• Avg ticket value: ${{avg_job_value}}\n• Monthly lost opportunity: ~${{estimated_lost_revenue}}\n\nAt $119/month for our Growth tier, converting just 1 single missed job pays for the entire year.\n\nCan I show you our live interactive ROI calculator for 3 minutes?\n\nBest,\nRevenueRecover AI',
      requiresReview: false
    },
    {
      stepNumber: 4,
      dayOffset: 14,
      channel: 'EMAIL',
      purpose: 'BREAKUP_PERMISSION',
      subjectTemplate: 'Permission to close your file, {{contact_name}}?',
      bodyTemplate: 'Hi {{contact_name}},\n\nI haven’t heard back, so I assume automated missed-call recovery and customer reactivation aren’t priorities for {{company_name}} right now.\n\nI will close out your file and won’t follow up again. If you ever want to run our free revenue leak scanner during your peak busy season, it’s always available at revenuerecover-ai.vercel.app.\n\nWishing you a profitable season!\n\nBest,\nRevenueRecover AI',
      requiresReview: false
    }
  ];

  public static getNextStep(lead: GrowthLead): OutreachSequenceStep | null {
    // Suppression check
    if (lead.consentStatus === 'SUPPRESSED' || lead.consentStatus === 'REVOKED') {
      return null;
    }

    // Terminal stage check
    if (['SALES_QUALIFIED', 'DEMO_BOOKED', 'DEMO_COMPLETED', 'TRIAL', 'PAYMENT_PENDING', 'CUSTOMER', 'ACTIVATED', 'CHURNED'].includes(lead.stage)) {
      return null;
    }

    const currentStepIndex = lead.currentSequenceStep;
    if (currentStepIndex >= this.defaultSteps.length) {
      return null; // Sequence completed
    }

    return this.defaultSteps[currentStepIndex];
  }

  public static renderTemplate(template: string, lead: GrowthLead): string {
    const contactName = lead.contactName || lead.companyName.split(' ')[0] || 'there';
    return template
      .replace(/\{\{company_name\}\}/g, lead.companyName)
      .replace(/\{\{contact_name\}\}/g, contactName)
      .replace(/\{\{city\}\}/g, lead.city)
      .replace(/\{\{state\}\}/g, lead.stateProvince)
      .replace(/\{\{industry\}\}/g, lead.industry)
      .replace(/\{\{avg_job_value\}\}/g, String(lead.averageJobValueUSD || 450))
      .replace(/\{\{estimated_lost_revenue\}\}/g, String(lead.estimatedLostRevenueMonthlyUSD || 3600));
  }
}
