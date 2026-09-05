/**
 * RevenueRecover AI — Global Country Configuration Catalog
 * Geographic, currency, phone format, and regional compliance specifications.
 */

import { CountryCode, TradeCategory } from '@/lib/discovery/types';

export interface CountrySpecification {
  code: CountryCode;
  name: string;
  currency: string;
  currencySymbol: string;
  defaultTimezones: string[];
  phoneCountryCode: string;
  phoneFormatPlaceholder: string;
  postalCodeRegex: RegExp;
  primaryCategories: TradeCategory[];
  complianceFramework: string[];
  quietHoursStart: string; // e.g. "20:00"
  quietHoursEnd: string;   // e.g. "08:00"
}

export const COUNTRY_SPECIFICATIONS: Record<CountryCode, CountrySpecification> = {
  USA: {
    code: 'USA',
    name: 'United States of America',
    currency: 'USD',
    currencySymbol: '$',
    defaultTimezones: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'],
    phoneCountryCode: '+1',
    phoneFormatPlaceholder: '+1 (555) 000-0000',
    postalCodeRegex: /^\d{5}(-\d{4})?$/,
    primaryCategories: ['HVAC', 'PLUMBING', 'ELECTRICAL', 'ROOFING', 'SOLAR', 'PEST_CONTROL'],
    complianceFramework: ['TCPA', 'CAN-SPAM Act', '10DLC Brand Registration'],
    quietHoursStart: '20:00',
    quietHoursEnd: '08:00',
  },
  GBR: {
    code: 'GBR',
    name: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    defaultTimezones: ['Europe/London'],
    phoneCountryCode: '+44',
    phoneFormatPlaceholder: '+44 20 7946 0000',
    postalCodeRegex: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
    primaryCategories: ['HVAC', 'PLUMBING', 'ELECTRICAL', 'ROOFING'],
    complianceFramework: ['UK GDPR', 'Data Protection Act 2018', 'PECR Regulation 22'],
    quietHoursStart: '21:00',
    quietHoursEnd: '08:00',
  },
  CAN: {
    code: 'CAN',
    name: 'Canada',
    currency: 'CAD',
    currencySymbol: 'CAD $',
    defaultTimezones: ['America/Toronto', 'America/Vancouver', 'America/Edmonton'],
    phoneCountryCode: '+1',
    phoneFormatPlaceholder: '+1 (416) 555-0000',
    postalCodeRegex: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    primaryCategories: ['HVAC', 'PLUMBING', 'ELECTRICAL', 'ROOFING'],
    complianceFramework: ['CASL (Canada Anti-Spam Legislation)', 'PIPEDA'],
    quietHoursStart: '20:00',
    quietHoursEnd: '08:00',
  },
  AUS: {
    code: 'AUS',
    name: 'Australia',
    currency: 'AUD',
    currencySymbol: 'AUD $',
    defaultTimezones: ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth'],
    phoneCountryCode: '+61',
    phoneFormatPlaceholder: '+61 2 9000 0000',
    postalCodeRegex: /^\d{4}$/,
    primaryCategories: ['HVAC', 'PLUMBING', 'ELECTRICAL', 'SOLAR'],
    complianceFramework: ['Spam Act 2003', 'Australian Privacy Principles (APP)'],
    quietHoursStart: '20:00',
    quietHoursEnd: '08:00',
  },
  NZL: {
    code: 'NZL',
    name: 'New Zealand',
    currency: 'NZD',
    currencySymbol: 'NZD $',
    defaultTimezones: ['Pacific/Auckland'],
    phoneCountryCode: '+64',
    phoneFormatPlaceholder: '+64 9 000 0000',
    postalCodeRegex: /^\d{4}$/,
    primaryCategories: ['HVAC', 'PLUMBING', 'ELECTRICAL'],
    complianceFramework: ['Unsolicited Electronic Messages Act 2007', 'Privacy Act 2020'],
    quietHoursStart: '20:00',
    quietHoursEnd: '08:00',
  },
  IND: {
    code: 'IND',
    name: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    defaultTimezones: ['Asia/Kolkata'],
    phoneCountryCode: '+91',
    phoneFormatPlaceholder: '+91 98000 00000',
    postalCodeRegex: /^\d{6}$/,
    primaryCategories: ['HVAC', 'PLUMBING', 'ELECTRICAL', 'SOLAR'],
    complianceFramework: ['TRAI DND Regulations', 'Digital Personal Data Protection Act (DPDPA)'],
    quietHoursStart: '21:00',
    quietHoursEnd: '09:00',
  },
  ARE: {
    code: 'ARE',
    name: 'United Arab Emirates',
    currency: 'AED',
    currencySymbol: 'AED',
    defaultTimezones: ['Asia/Dubai'],
    phoneCountryCode: '+971',
    phoneFormatPlaceholder: '+971 4 000 0000',
    postalCodeRegex: /^\d{5}$/,
    primaryCategories: ['HVAC', 'PLUMBING', 'ELECTRICAL', 'CLEANING'],
    complianceFramework: ['TDRA Telemarketing Regulations', 'UAE Data Protection Law'],
    quietHoursStart: '21:00',
    quietHoursEnd: '09:00',
  },
  DEU: {
    code: 'DEU',
    name: 'Germany',
    currency: 'EUR',
    currencySymbol: '€',
    defaultTimezones: ['Europe/Berlin'],
    phoneCountryCode: '+49',
    phoneFormatPlaceholder: '+49 30 000000',
    postalCodeRegex: /^\d{5}$/,
    primaryCategories: ['HVAC', 'PLUMBING', 'ELECTRICAL', 'SOLAR'],
    complianceFramework: ['EU GDPR', 'UWG Section 7 (Opt-in Mandate)'],
    quietHoursStart: '20:00',
    quietHoursEnd: '08:00',
  },
};

export function getCountrySpec(code: CountryCode): CountrySpecification {
  return COUNTRY_SPECIFICATIONS[code] || COUNTRY_SPECIFICATIONS.USA;
}
