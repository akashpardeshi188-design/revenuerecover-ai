/**
 * RevenueRecover AI — Base Source Adapter
 * Common normalization, E.164 phone formatting, domain extraction, and health checks.
 */

import { SourceAdapter, DiscoveredBusiness, SourceType, CountryCode, TradeCategory } from '../types';

export abstract class BaseSourceAdapter implements SourceAdapter {
  abstract sourceId: string;
  abstract sourceName: string;
  abstract sourceType: SourceType;

  abstract isConfigured(): boolean;
  abstract healthCheck(): Promise<{ status: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE'; latencyMs: number; message: string }>;

  abstract discoverBusinesses(query: {
    country: CountryCode;
    stateProvince?: string;
    city: string;
    postalCode?: string;
    radiusMiles: number;
    category: TradeCategory;
    limit?: number;
  }): Promise<DiscoveredBusiness[]>;

  abstract normalize(rawRecord: any): DiscoveredBusiness;

  /**
   * Cleans and normalizes international telephone numbers to E.164 standard format.
   */
  protected normalizePhoneNumber(phone?: string, country: CountryCode = 'USA'): string | undefined {
    if (!phone) return undefined;
    const digits = phone.replace(/\D/g, '');

    if (country === 'USA' || country === 'CAN') {
      if (digits.length === 10) return `+1${digits}`;
      if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    } else if (country === 'GBR') {
      if (digits.startsWith('0') && digits.length === 11) return `+44${digits.substring(1)}`;
      if (digits.startsWith('44')) return `+${digits}`;
    } else if (country === 'AUS' || country === 'NZL') {
      if (digits.startsWith('0')) return `+61${digits.substring(1)}`;
      if (digits.startsWith('61')) return `+${digits}`;
    } else if (country === 'IND') {
      if (digits.length === 10) return `+91${digits}`;
      if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
    }

    if (digits.length >= 8) return `+${digits}`;
    return undefined;
  }

  /**
   * Extracts clean root domain from website URL.
   */
  protected extractDomain(websiteUrl?: string): string | undefined {
    if (!websiteUrl) return undefined;
    try {
      let cleanUrl = websiteUrl.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = `https://${cleanUrl}`;
      }
      const parsed = new URL(cleanUrl);
      return parsed.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return undefined;
    }
  }

  /**
   * Normalizes trade category strings to supported enums.
   */
  protected normalizeTradeCategory(rawCategory: string): TradeCategory {
    const lower = (rawCategory || '').toLowerCase();
    if (lower.includes('hvac') || lower.includes('air cond') || lower.includes('heating') || lower.includes('cooling')) {
      return 'HVAC';
    }
    if (lower.includes('plumb') || lower.includes('drain') || lower.includes('pipe') || lower.includes('sewer')) {
      return 'PLUMBING';
    }
    if (lower.includes('electr') || lower.includes('wire') || lower.includes('lighting')) {
      return 'ELECTRICAL';
    }
    if (lower.includes('roof') || lower.includes('gutter')) {
      return 'ROOFING';
    }
    if (lower.includes('solar') || lower.includes('photovoltaic')) {
      return 'SOLAR';
    }
    if (lower.includes('pest') || lower.includes('termite') || lower.includes('exterminat')) {
      return 'PEST_CONTROL';
    }
    return 'HVAC'; // Default fallback
  }
}
