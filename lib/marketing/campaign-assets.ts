/**
 * RevenueRecover AI — 650-Client Sprint Multi-Channel Marketing Assets & Ad Creatives
 */

export interface AdCreative {
  platform: 'facebook' | 'instagram' | 'google_search' | 'linkedin';
  targetAudience: string;
  headline: string;
  primaryText: string;
  ctaButton: string;
  destinationUrl: string;
}

export const sprintAdCreatives: AdCreative[] = [
  {
    platform: 'facebook',
    targetAudience: 'USA HVAC, Plumbing, Electrical Business Owners & Contractors (Age 30-65)',
    headline: 'Texas & Florida HVAC Owners: See Your Monthly Missed-Call Revenue Leak',
    primaryText:
      'Did you know the average 5-truck HVAC business loses $23,400 every single month from unanswered calls, neglected estimates, and forgotten quotes?\n\nRevenueRecover AI texts back missed calls in 45 seconds and follows up on quotes automatically.\n\n👉 Run your 100% Free 60-Second Leak Audit now (No credit card required).',
    ctaButton: 'Get Free Audit',
    destinationUrl: 'https://revenuerecover-ai.vercel.app/free-revenue-scan',
  },
  {
    platform: 'instagram',
    targetAudience: 'Plumbing & Emergency Service Contractors USA',
    headline: 'Stop Losing $1,200 Slab Leak & Water Heater Emergency Calls to Competitors',
    primaryText:
      'Homeowners call the first plumber who answers. If your dispatch is busy, RevenueRecover AI texts them back in 45 seconds and books them straight onto your calendar.\n\nRecover an extra $8,000 to $18,000 every month on autopilot.',
    ctaButton: 'Try Free Simulator',
    destinationUrl: 'https://revenuerecover-ai.vercel.app/demo',
  },
  {
    platform: 'google_search',
    targetAudience: 'Keywords: HVAC missed calls software, service titan quote follow up, contractor lead recovery',
    headline: 'AI Revenue Recovery for HVAC & Plumbing | Turn Missed Calls Into $8K+ Revenue',
    primaryText:
      'Automated 45-second missed-call textback & estimate follow-up. Syncs with ServiceTitan, Jobber & Housecall Pro. Free 14-day trial.',
    ctaButton: 'Start Free Trial',
    destinationUrl: 'https://revenuerecover-ai.vercel.app/pricing',
  },
  {
    platform: 'linkedin',
    targetAudience: 'Owners, Presidents & General Managers at US Mechanical & HVAC Contractors',
    headline: 'How Summit HVAC Recovered $8,420 in 30 Days From Abandoned Quotes',
    primaryText:
      'Most contractors have $40K+ in stalled heat pump and AC replacement bids sitting in their CRM. Our AI copilot automatically nurtures those quotes to approval.\n\nSee how much revenue your shop is leaving on the table.',
    ctaButton: 'Calculate My Leakage',
    destinationUrl: 'https://revenuerecover-ai.vercel.app/free-revenue-scan',
  },
];

export const coldEmailSequences = {
  step1: {
    day: 0,
    subject: 'Quick diagnostic: Missed calls & lost estimates at {{businessName}}',
    body: `Hi {{ownerName}},

I was reviewing service contractors in {{city}}, {{state}} and noticed businesses of your size typically lose between $15,000 to $28,000 every month from uncontacted missed calls and unapproved quotes that slip through the cracks.

We built RevenueRecover AI specifically for HVAC & plumbing contractors. It texts back missed calls within 45 seconds and follows up on open quotes to recover that lost money automatically—with zero extra work for your techs.

You can run a completely free 60-second revenue leak audit for {{businessName}} here:
👉 https://revenuerecover-ai.vercel.app/free-revenue-scan

Most contractors recover at least $2,500 in their first 14 days. Let me know what you think of your numbers!

Best regards,
Akash Pardeshi
RevenueRecover AI
https://revenuerecover-ai.vercel.app`,
  },
  step2: {
    day: 2,
    subject: 'Re: 45-second missed call recovery for {{businessName}}',
    body: `Hi {{ownerName}},

Quick follow-up on my note from Tuesday. 

When a Dallas/Fort Worth homeowner calls about an AC breakdown after 6 PM and gets voicemail, 82% immediately hang up and call your local competitor.

Our AI agent captures those emergency calls instantly via compliant SMS, answers basic questions, and books them on your calendar.

Would you be open to seeing a 2-minute simulation on {{businessName}}'s numbers?
👉 https://revenuerecover-ai.vercel.app/demo

Best,
Akash`,
  },
  step3: {
    day: 5,
    subject: 'Case study: How Summit HVAC recovered $8,420 in 30 days',
    body: `Hi {{ownerName}},

Thought you might find this interesting: Summit HVAC (14 technicians in Dallas) had $48,000 in open replacement quotes sitting idle last month.

With RevenueRecover AI, they recovered $8,420 in confirmed closed jobs in 30 days without hiring extra office staff.

You can test this completely free on your shop for 14 days (with our $2,000 recovery guarantee):
👉 https://revenuerecover-ai.vercel.app/pricing

Cheers,
Akash`,
  },
};
