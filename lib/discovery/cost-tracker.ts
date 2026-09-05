/**
 * RevenueRecover AI — Cost Control & Unit Economics Tracker
 * Tracks external API expenses, cost per discovered contractor, and cost per captured lead.
 */

export interface CostRecord {
  id: string;
  provider: string;
  endpoint: string;
  tenantId: string;
  requestType: 'DISCOVERY' | 'VERIFICATION' | 'LEAD_SCORING' | 'SMS_RECOVERY';
  costUSD: number;
  timestamp: string;
}

export class CostTracker {
  private static records: CostRecord[] = [];

  static trackUsage(record: Omit<CostRecord, 'id' | 'timestamp'>) {
    const entry: CostRecord = {
      ...record,
      id: `cost_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
    };
    this.records.unshift(entry);
    if (this.records.length > 5000) this.records.pop();
  }

  static getMetricsSummary() {
    const totalCost = this.records.reduce((sum, r) => sum + r.costUSD, 0);
    const totalDiscoveryCalls = this.records.filter((r) => r.requestType === 'DISCOVERY').length || 1;
    const totalVerificationCalls = this.records.filter((r) => r.requestType === 'VERIFICATION').length || 1;
    const totalLeadCalls = this.records.filter((r) => r.requestType === 'LEAD_SCORING').length || 1;

    return {
      totalCostUSD: Number(totalCost.toFixed(4)),
      totalCalls: this.records.length,
      costPerDiscoveredBusinessUSD: Number((totalCost / totalDiscoveryCalls).toFixed(4)),
      costPerVerifiedBusinessUSD: Number((totalCost / totalVerificationCalls).toFixed(4)),
      costPerLeadUSD: Number((totalCost / totalLeadCalls).toFixed(4)),
      grossMarginTarget: '91.4%',
    };
  }

  static getRecentRecords(limit = 20): CostRecord[] {
    return this.records.slice(0, limit);
  }
}
