/**
 * RevenueRecover AI — Experimentation & Conversion Rate Optimization (CRO) Engine
 * MASTER SPECIFICATION SECTION 20 & 31
 */

export interface GrowthExperiment {
  id: string;
  name: string;
  category: 'landing_page' | 'email_subject' | 'pricing' | 'scanner_cta' | 'onboarding';
  hypothesis: string;
  controlVariant: {
    description: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
  };
  testVariant: {
    description: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
  };
  primaryMetric: string;
  minSampleSize: number;
  statisticalConfidence: number; // e.g. 98.4%
  status: 'running' | 'win_scale' | 'loss_stop' | 'inconclusive';
  recommendation: string;
  startDate: string;
}

export class ExperimentationEngine {
  private static experiments: GrowthExperiment[] = [
    {
      id: 'exp_001',
      name: 'Hero CTA: Free Revenue Scanner vs Traditional Demo',
      category: 'landing_page',
      hypothesis: 'Framing the CTA as a 60-Second Dollar Leak Audit increases trial intent by over 100%.',
      controlVariant: {
        description: 'Traditional "Book a Demo" button leading to 15-min calendar schedule',
        impressions: 4800,
        conversions: 184,
        conversionRate: 3.83,
      },
      testVariant: {
        description: 'Interactive "Find My Lost Revenue" leading to 3-step Free Scanner',
        impressions: 5100,
        conversions: 785,
        conversionRate: 15.39,
      },
      primaryMetric: 'Visitor to Lead/Trial Conversion',
      minSampleSize: 3000,
      statisticalConfidence: 99.8,
      status: 'win_scale',
      recommendation: 'Scale Variant B as permanent global hero CTA across all landing pages (+301% relative uplift).',
      startDate: '2026-08-15',
    },
    {
      id: 'exp_002',
      name: 'Cold Email Subject: Pain vs Case Study Angle',
      category: 'email_subject',
      hypothesis: 'Direct reference to local metro city and unapproved quotes drives higher open & click rates.',
      controlVariant: {
        description: 'Variant A: "Case study: How Summit HVAC recovered $8,420"',
        impressions: 2100,
        conversions: 540,
        conversionRate: 25.71,
      },
      testVariant: {
        description: 'Variant B: "Quick diagnostic: Missed calls & lost estimates at {{businessName}}"',
        impressions: 2100,
        conversions: 718,
        conversionRate: 34.19,
      },
      primaryMetric: 'Unique Email Open Rate',
      minSampleSize: 2000,
      statisticalConfidence: 97.5,
      status: 'win_scale',
      recommendation: 'Adopt Variant B for Day 0 cold sequence; use Variant A for Day 5 case study touchpoint.',
      startDate: '2026-08-20',
    },
    {
      id: 'exp_003',
      name: 'Pricing Presentation: Annual Discount Toggle Placement',
      category: 'pricing',
      hypothesis: 'Defaulting to Annual (Save 20%) with prominent monthly equivalent ($119/mo) increases LTV.',
      controlVariant: {
        description: 'Default Monthly ($149/mo) with small annual toggle',
        impressions: 1600,
        conversions: 240,
        conversionRate: 15.0,
      },
      testVariant: {
        description: 'Default Annual ($119/mo billed annually) with "Save 20%" badge',
        impressions: 1650,
        conversions: 396,
        conversionRate: 24.0,
      },
      primaryMetric: 'Annual Plan Subscription Share',
      minSampleSize: 1500,
      statisticalConfidence: 96.2,
      status: 'win_scale',
      recommendation: 'Lock default annual view with clear savings badge.',
      startDate: '2026-08-22',
    },
  ];

  public static getExperiments(): GrowthExperiment[] {
    return this.experiments;
  }
}
