/**
 * RevenueRecover AI — Centralized Product Intelligence & Knowledge Base
 * MASTER SPECIFICATION SECTION 3 & 6
 */

export interface ProductKnowledge {
  productName: string;
  tagline: string;
  corePromise: string;
  icp: {
    primaryTrades: string[];
    companySize: string;
    revenueRange: string;
    targetStates: string[];
    decisionMakerRoles: string[];
    painSignals: string[];
  };
  pricingTiers: {
    starter: { name: string; monthly: number; annual: number; limit: string };
    growth: { name: string; monthly: number; annual: number; limit: string };
    pro: { name: string; monthly: number; annual: number; limit: string };
  };
  guarantees: string[];
  differentiators: string[];
  certifiedIntegrations: string[];
  objectionsAndAnswers: Array<{ objection: string; answer: string; evidence: string }>;
  verifiedBenchmarks: Array<{ metric: string; value: string; verificationSource: string }>;
}

export const productKnowledgeBase: ProductKnowledge = {
  productName: 'RevenueRecover AI',
  tagline: 'Turn Lost Leads Into Confirmed Recovered Revenue',
  corePromise: 'Find lost revenue in 60 seconds. Text back missed calls in 45 seconds. Follow up on quotes automatically.',
  icp: {
    primaryTrades: ['HVAC & AC Repair', 'Plumbing & Drain', 'Electrical Contracting', 'Roofing & Solar', 'Commercial Mechanical'],
    companySize: '3 to 50 technicians / trucks',
    revenueRange: '$500,000 to $15,000,000 annual GMV',
    targetStates: ['Texas', 'Florida', 'Arizona', 'California', 'North Carolina', 'Georgia', 'Ohio', 'Colorado', 'Nevada', 'Tennessee'],
    decisionMakerRoles: ['Owner', 'Founder', 'President', 'General Manager', 'Operations Director'],
    painSignals: [
      'High monthly inquiry volume (>80 leads/mo) with busy dispatcher bottlenecks',
      'High average job value ($1,200 - $8,500 replacement tickets)',
      'Unanswered after-hours calls after 6:00 PM and on weekends',
      'Delivered PDF estimates left uncontacted after 48 hours',
      'Credit card decline losses on past-due service invoices',
    ],
  },
  pricingTiers: {
    starter: { name: 'Starter', monthly: 49, annual: 39, limit: 'Up to 50 recovery opportunities/mo' },
    growth: { name: 'Growth', monthly: 149, annual: 119, limit: 'Unlimited recovery workflows & CRM sync' },
    pro: { name: 'Pro', monthly: 299, annual: 239, limit: 'Multi-location automated dispatch & dedicated rep' },
  },
  guarantees: [
    '14-Day Risk-Free Trial (No credit card required to run scan)',
    'Recover at least $2,000 in your first 14 days or pay $0',
    'TCPA & CAN-SPAM Strict Quiet Hours (8 AM - 9 PM) Guarantee',
    '1-Click Instant Kill Switch & Human Copilot Approval Mode',
  ],
  differentiators: [
    'Sub-45-second emergency call text-back beats competitor 18-minute callback averages',
    'Direct two-way CRM sync with ServiceTitan, Housecall Pro, and Jobber',
    'Strict separation of Confirmed Recovered Revenue vs Estimated Opportunity',
    'Autonomous AI intent classification identifying 14 specific customer reply intents',
  ],
  certifiedIntegrations: [
    'ServiceTitan',
    'Housecall Pro',
    'Jobber',
    'Stripe Billing',
    'Twilio 10DLC SMS',
    'QuickBooks Online',
    'Google Calendar',
    'Zapier Webhooks',
  ],
  objectionsAndAnswers: [
    {
      objection: 'Will this spam my customers or hurt my local reputation?',
      answer: 'No. The AI operates in Copilot Mode by default where all messages require 1-click human approval. It strictly respects TCPA quiet hours (8 AM - 9 PM) and suppresses any contact who requests opt-out.',
      evidence: 'Built-in TCPA/CAN-SPAM Quiet Hours Engine and Global Kill Switch.',
    },
    {
      objection: 'We already use ServiceTitan or Housecall Pro. Why do we need this?',
      answer: 'ServiceTitan stores your data; RevenueRecover AI actively works your unclosed estimates and missed calls to turn dead files into booked revenue on your calendar automatically.',
      evidence: 'Native webhook synchronization with ServiceTitan estimates and customer records.',
    },
    {
      objection: 'How fast do we see return on investment (ROI)?',
      answer: 'Most contractors recover their entire annual subscription cost on their very first recovered AC replacement or water heater install.',
      evidence: 'Average contractor ticket is $1,400+ vs $119/mo subscription.',
    },
  ],
  verifiedBenchmarks: [
    {
      metric: 'Missed Call Drop-off',
      value: '82% of homeowners hang up and call a competitor if an emergency call goes to voicemail.',
      verificationSource: 'US Home Services Consumer Response Index 2025',
    },
    {
      metric: 'Quote Abandonment Rate',
      value: '35% to 48% of HVAC replacement bids remain unclosed simply due to lack of multi-day follow-up.',
      verificationSource: 'Contractor Operations Benchmark Report',
    },
  ],
};
