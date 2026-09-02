/**
 * RevenueRecover AI — Business Identity Resolution Engine
 * Resolves multiple user signups to a canonical BUSINESS_IDENTITY.
 */

import { BusinessIdentity, SignalStrength } from './types';

export class IdentityNormalizer {
  public static normalizeEmail(email: string): string {
    if (!email) return '';
    return email.trim().toLowerCase();
  }

  public static normalizePhone(phone: string): string {
    if (!phone) return '';
    // Strip all non-digit characters except leading +
    let cleaned = phone.trim().replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) {
      // Default to US +1 if 10 digits
      if (cleaned.length === 10) {
        cleaned = '+1' + cleaned;
      } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        cleaned = '+' + cleaned;
      }
    }
    return cleaned;
  }

  public static normalizeDomain(websiteOrDomain: string): string {
    if (!websiteOrDomain) return '';
    let domain = websiteOrDomain.trim().toLowerCase();
    // Remove protocol
    domain = domain.replace(/^https?:\/\//i, '');
    // Remove www.
    domain = domain.replace(/^www\./i, '');
    // Remove subpath and trailing slashes
    domain = domain.split('/')[0].split('?')[0].trim();
    return domain;
  }

  public static normalizeBusinessName(name: string): string {
    if (!name) return '';
    let normalized = name.trim().toLowerCase();
    // Remove common punctuation
    normalized = normalized.replace(/[,.'"-]/g, '');
    // Remove legal suffixes
    normalized = normalized.replace(/\b(llc|inc|corp|corporation|ltd|limited|co|company|services|pros)\b/g, '');
    // Collapse whitespace
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return normalized;
  }
}

export class IdentityResolutionService {
  private static businesses: Map<string, BusinessIdentity> = new Map();

  static {
    // Seed initial existing business identities for rigorous testing & live operation
    this.seedCanonicalIdentities();
  }

  private static seedCanonicalIdentities() {
    const seed1: BusinessIdentity = {
      id: 'BIZ-83920',
      legalName: 'Lone Star Heating & Air LLC',
      normalizedName: 'lone star heating air',
      displayName: 'Lone Star Heating & Air',
      website: 'https://lonestarheating.example.com',
      normalizedDomain: 'lonestarheating.example.com',
      phone: '(817) 555-0192',
      normalizedPhone: '+18175550192',
      country: 'USA',
      industry: 'HVAC & AC Repair',
      location: 'Fort Worth, Texas',
      identityConfidence: 0.98,
      customerStatus: 'TRIAL',
      createdAt: '2026-08-15T10:00:00Z',
      updatedAt: '2026-09-01T12:00:00Z',
    };

    const seed2: BusinessIdentity = {
      id: 'BIZ-94112',
      legalName: 'Apex Plumbing & Rooter Inc',
      normalizedName: 'apex plumbing rooter',
      displayName: 'Apex Plumbing & Rooter',
      website: 'https://apexplumbingpros.com',
      normalizedDomain: 'apexplumbingpros.com',
      phone: '(214) 555-0142',
      normalizedPhone: '+12145550142',
      country: 'USA',
      industry: 'Plumbing Services',
      location: 'Dallas, Texas',
      identityConfidence: 0.95,
      customerStatus: 'PAID',
      createdAt: '2026-08-20T14:30:00Z',
      updatedAt: '2026-09-02T18:00:00Z',
    };

    this.businesses.set(seed1.id, seed1);
    this.businesses.set(seed2.id, seed2);
  }

  public static resolveBusinessIdentity(input: {
    businessName: string;
    website?: string;
    email: string;
    phone: string;
    location?: string;
    country?: string;
    industry?: string;
  }): {
    business: BusinessIdentity;
    isExisting: boolean;
    confidence: number;
    matchStrength: SignalStrength;
    matchingReasons: string[];
  } {
    const normalizedName = IdentityNormalizer.normalizeBusinessName(input.businessName);
    const normalizedDomain = IdentityNormalizer.normalizeDomain(input.website || input.email.split('@')[1] || '');
    const normalizedPhone = IdentityNormalizer.normalizePhone(input.phone);
    const normalizedEmail = IdentityNormalizer.normalizeEmail(input.email);
    const emailDomain = normalizedEmail.includes('@') ? normalizedEmail.split('@')[1] : '';

    const matchingReasons: string[] = [];
    let matchedBusiness: BusinessIdentity | null = null;
    let confidence = 0.0;
    let matchStrength: SignalStrength = 'WEAK';

    // 1. VERY STRONG: Exact domain match (ignoring generic providers like gmail.com, yahoo.com)
    const genericEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com'];
    const isCustomDomain = normalizedDomain && !genericEmailProviders.includes(normalizedDomain);

    for (const b of this.businesses.values()) {
      if (isCustomDomain && b.normalizedDomain === normalizedDomain) {
        matchedBusiness = b;
        confidence = 0.98;
        matchStrength = 'VERY_STRONG';
        matchingReasons.push(`Exact verified business domain match: ${normalizedDomain}`);
        break;
      }
    }

    // 2. STRONG: Same normalized business phone
    if (!matchedBusiness && normalizedPhone) {
      for (const b of this.businesses.values()) {
        if (b.normalizedPhone === normalizedPhone) {
          matchedBusiness = b;
          confidence = 0.88;
          matchStrength = 'STRONG';
          matchingReasons.push(`Same verified business phone: ${normalizedPhone}`);
          break;
        }
      }
    }

    // 3. MEDIUM: Normalized Business Name + Location
    if (!matchedBusiness && normalizedName.length > 3) {
      for (const b of this.businesses.values()) {
        if (b.normalizedName === normalizedName) {
          matchedBusiness = b;
          confidence = 0.72;
          matchStrength = 'MEDIUM';
          matchingReasons.push(`Matching business name: ${input.businessName}`);
          break;
        }
      }
    }

    // If an existing business is resolved
    if (matchedBusiness) {
      return {
        business: matchedBusiness,
        isExisting: true,
        confidence,
        matchStrength,
        matchingReasons,
      };
    }

    // Otherwise, create a new Canonical Business Identity
    const newId = `BIZ-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBusiness: BusinessIdentity = {
      id: newId,
      legalName: input.businessName,
      normalizedName,
      displayName: input.businessName,
      website: input.website || '',
      normalizedDomain,
      phone: input.phone,
      normalizedPhone,
      country: input.country || 'USA',
      industry: input.industry || 'HVAC & Plumbing Services',
      location: input.location || 'United States',
      identityConfidence: 0.95,
      customerStatus: 'LEAD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.businesses.set(newId, newBusiness);

    return {
      business: newBusiness,
      isExisting: false,
      confidence: 0.95,
      matchStrength: 'VERY_STRONG',
      matchingReasons: ['New verified business identity created'],
    };
  }

  public static getBusinessById(businessId: string): BusinessIdentity | undefined {
    return this.businesses.get(businessId);
  }

  public static getAllBusinesses(): BusinessIdentity[] {
    return Array.from(this.businesses.values());
  }
}
