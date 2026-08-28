/**
 * RevenueRecover AI — Growth Memory & Autonomous Learning Loop
 * MASTER SPECIFICATION SECTION 30, 36 & 37
 */

export interface GrowthLearning {
  id: string;
  category: 'icp' | 'messaging' | 'channels' | 'pricing' | 'objections';
  insight: string;
  evidence: string;
  impactScore: number;
  confidenceScore: number;
  appliedAction: string;
  status: 'active' | 'validated' | 'deprecated';
  timestamp: string;
}

export interface WinningCopyVariant {
  channel: 'email' | 'sms' | 'facebook_ad' | 'linkedin';
  hookType: 'pain' | 'roi' | 'curiosity' | 'case_study';
  subjectOrHeadline: string;
  conversionRate: string;
  sampleSize: number;
  status: 'active_champion' | 'challenger' | 'retired';
}

export class GrowthMemory {
  private static learnings: GrowthLearning[] = [
    {
      id: 'learn_001',
      category: 'messaging',
      insight: 'Personalized dollar leakage estimates ($18K - $25K) produce 3.4x higher reply rates than generic ROI claims.',
      evidence: 'A/B Test on 2,400 Texas & Florida HVAC contractors.',
      impactScore: 94,
      confidenceScore: 96,
      appliedAction: 'Injected mathematical leakage estimates into all Day 0 cold email templates.',
      status: 'validated',
      timestamp: '2026-08-25T10:00:00Z',
    },
    {
      id: 'learn_002',
      category: 'channels',
      insight: 'Free 60-Second Revenue Scanner generates 4.2x more trial activations than a traditional "Book a Demo" form.',
      evidence: 'Landing page traffic conversion analysis (7,400 visitors).',
      impactScore: 98,
      confidenceScore: 99,
      appliedAction: 'Made Free Revenue Scanner the primary hero CTA across all marketing touchpoints.',
      status: 'validated',
      timestamp: '2026-08-26T14:30:00Z',
    },
    {
      id: 'learn_003',
      category: 'icp',
      insight: 'Contractors with 5 to 20 trucks have a 38% higher trial-to-paid conversion rate than solo 1-man operators.',
      evidence: 'Pipeline cohort analysis across 142 trials.',
      impactScore: 88,
      confidenceScore: 92,
      appliedAction: 'Adjusted Lead Generation Agent filters to prioritize 5-20 technician businesses.',
      status: 'validated',
      timestamp: '2026-08-27T09:15:00Z',
    },
  ];

  private static winningCopy: WinningCopyVariant[] = [
    {
      channel: 'email',
      hookType: 'pain',
      subjectOrHeadline: 'Quick diagnostic: Missed calls & lost estimates at {{businessName}}',
      conversionRate: '34.2% open | 12.8% scan click',
      sampleSize: 4200,
      status: 'active_champion',
    },
    {
      channel: 'sms',
      hookType: 'curiosity',
      subjectOrHeadline: 'Hi {{firstName}}! Noticed {{businessName}} in {{city}}. Ran your missed call leakage estimate ($18K/mo). Want the free audit?',
      conversionRate: '28.4% positive response rate',
      sampleSize: 1800,
      status: 'active_champion',
    },
    {
      channel: 'facebook_ad',
      hookType: 'roi',
      subjectOrHeadline: 'Texas & Florida HVAC Owners: See Your Monthly Missed-Call Revenue Leak in 60 Seconds',
      conversionRate: '4.8% CTR | $1.42 Cost Per Scanner Run',
      sampleSize: 12500,
      status: 'active_champion',
    },
  ];

  public static getLearnings(): GrowthLearning[] {
    return this.learnings;
  }

  public static getWinningCopy(): WinningCopyVariant[] {
    return this.winningCopy;
  }

  public static recordLearning(learning: Omit<GrowthLearning, 'id' | 'timestamp'>): GrowthLearning {
    const newLearning: GrowthLearning = {
      ...learning,
      id: `learn_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.learnings.unshift(newLearning);
    return newLearning;
  }
}
