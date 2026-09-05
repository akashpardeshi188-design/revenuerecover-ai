/**
 * RevenueRecover AI — Global Discovery & Lead Intelligence Engine
 * Core Domain Types, Interfaces & Schemas
 */

export type CountryCode = 'USA' | 'GBR' | 'CAN' | 'AUS' | 'NZL' | 'IND' | 'ARE' | 'DEU';
export type TradeCategory = 'HVAC' | 'PLUMBING' | 'ELECTRICAL' | 'ROOFING' | 'SOLAR' | 'PEST_CONTROL' | 'CLEANING';

export type SourceType =
  | 'SEARCH_MAPS'
  | 'LOCAL_DIRECTORY'
  | 'GOVERNMENT_REGISTRY'
  | 'INDUSTRY_ASSOCIATION'
  | 'SERVICE_MARKETPLACE'
  | 'PUBLIC_WEBSITE'
  | 'INBOUND_FORM'
  | 'MISSED_CALL'
  | 'CRM_INTEGRATION'
  | 'MANUAL_IMPORT';

export type VerificationStatus = 'UNVERIFIED' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERIFIED';
export type LeadUrgency = 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';
export type LeadClassification = 'HOT' | 'WARM' | 'COLD' | 'INVALID' | 'DUPLICATE';
export type ConsentStatus = 'EXPRESS_WRITTEN' | 'IMPLIED_INQUIRY' | 'B2B_LEGITIMATE_INTEREST' | 'NONE' | 'OPTED_OUT';

export interface SourceRegistryEntry {
  id: string;
  sourceName: string;
  sourceType: SourceType;
  country: CountryCode | 'GLOBAL';
  category: TradeCategory[];
  officialApiAvailable: boolean;
  apiDocumentationUrl?: string;
  authenticationType: 'API_KEY' | 'OAUTH2' | 'PUBLIC_NO_AUTH' | 'PARTNER_ONLY' | 'NOT_SUPPORTED';
  rateLimitPerMinute: number;
  termsUrl?: string;
  robotsPolicy: 'ALLOWED' | 'RESTRICTED' | 'DISALLOWED';
  dataFieldsAvailable: string[];
  leadCaptureSupported: boolean;
  businessDiscoverySupported: boolean;
  integrationStatus: 'CONNECTED' | 'AWAITING_CREDENTIALS' | 'NOT_SUPPORTED' | 'MAINTENANCE';
  enabled: boolean;
  lastChecked: string;
  complianceNotes: string;
  estimatedCostPerCallUSD: number;
}

export interface DiscoveredBusiness {
  sourceId: string;
  sourceRecordId: string;
  sourceUrl?: string;
  businessName: string;
  tradeCategories: TradeCategory[];
  phoneRaw?: string;
  phoneE164?: string;
  email?: string;
  website?: string;
  domain?: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: CountryCode;
  geoLatitude?: number;
  geoLongitude?: number;
  serviceRadiusMiles?: number;
  rating?: number;
  reviewCount?: number;
  operatingHours?: Record<string, string>;
  servicesListed: string[];
  rawSourceData?: Record<string, any>;
  discoveredAt: string;
}

export interface BusinessMaster {
  id: string;
  tenantId: string;
  businessName: string;
  normalizedName: string;
  primaryTrade: TradeCategory;
  secondaryTrades: TradeCategory[];
  phoneE164?: string;
  email?: string;
  website?: string;
  domain?: string;
  addressLine1: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: CountryCode;
  geoLatitude?: number;
  geoLongitude?: number;
  serviceRadiusMiles: number;
  verificationScore: number;
  verificationStatus: VerificationStatus;
  verificationReasons: string[];
  averageRating: number;
  totalReviews: number;
  sourceCount: number;
  connectedSourceIds: string[];
  dataQualityScore: number;
  isActive: boolean;
  isAcceptingLeads: boolean;
  monthlyCapacity: number;
  currentActiveLeads: number;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationCheckResult {
  score: number;
  status: VerificationStatus;
  checksPassed: string[];
  checksFailed: string[];
  reasons: string[];
  isDeliverablePhone: boolean;
  isLiveWebsite: boolean;
  isCompleteAddress: boolean;
  sourceCorroborationCount: number;
}

export interface Lead {
  id: string;
  tenantId: string;
  assignedBusinessId?: string;
  sourceType: SourceType;
  sourceChannel: 'MISSED_PHONE_CALL' | 'WEBSITE_CONTACT_FORM' | 'DIRECT_BOOKING' | 'INBOUND_EMAIL' | 'SMS_INQUIRY' | 'CRM_SYNC';
  customerName?: string;
  customerPhoneE164?: string;
  customerEmail?: string;
  serviceCategory: TradeCategory;
  serviceRequested: string;
  issueDescription?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: CountryCode;
  geoLatitude?: number;
  geoLongitude?: number;
  urgency: LeadUrgency;
  estimatedJobValueUSD: number;
  leadScore: number;
  leadClassification: LeadClassification;
  scoreReasons: string[];
  aiClassificationExplanation: string;
  consentStatus: ConsentStatus;
  consentTimestamp: string;
  isDuplicate: boolean;
  masterOpportunityId: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'BOOKED' | 'RECOVERED' | 'LOST' | 'DISMISSED';
  createdAt: string;
  updatedAt: string;
}

export interface LeadSourceEvent {
  id: string;
  leadId: string;
  masterOpportunityId: string;
  sourceType: SourceType;
  channel: string;
  rawPayload: Record<string, any>;
  timestamp: string;
}

export interface MasterOpportunity {
  id: string;
  tenantId: string;
  primaryLeadId: string;
  customerIdentifier: string; // Normalized phone or email hash
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  tradeCategory: TradeCategory;
  summary: string;
  highestUrgency: LeadUrgency;
  estimatedPipelineValueUSD: number;
  compositeScore: number;
  classification: LeadClassification;
  touchpointEvents: LeadSourceEvent[];
  assignedBusinessId?: string;
  stage: 'INBOX' | 'ATTEMPTED_CONTACT' | 'ENGAGED' | 'APPOINTMENT_SCHEDULED' | 'WON_RECOVERED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface ContractorMatchResult {
  leadId: string;
  contractor: BusinessMaster;
  matchScore: number;
  distanceMiles: number;
  categoryMatch: boolean;
  capacityAvailable: boolean;
  reasons: string[];
}

export interface SourceAdapter {
  sourceId: string;
  sourceName: string;
  sourceType: SourceType;
  isConfigured(): boolean;
  healthCheck(): Promise<{ status: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE'; latencyMs: number; message: string }>;
  discoverBusinesses(query: {
    country: CountryCode;
    stateProvince?: string;
    city: string;
    postalCode?: string;
    radiusMiles: number;
    category: TradeCategory;
    limit?: number;
  }): Promise<DiscoveredBusiness[]>;
  getBusinessDetails?(externalId: string): Promise<Partial<DiscoveredBusiness> | null>;
  normalize(rawRecord: any): DiscoveredBusiness;
}

export interface DiscoveryJobParams {
  country: CountryCode;
  stateProvince?: string;
  city: string;
  postalCode?: string;
  radiusMiles: number;
  category: TradeCategory;
  sourceIds?: string[];
  limitPerSource?: number;
  dryRun?: boolean;
}

export interface DiscoveryJobReport {
  jobId: string;
  startedAt: string;
  completedAt: string;
  params: DiscoveryJobParams;
  sourcesQueried: string[];
  totalRawDiscovered: number;
  totalNormalized: number;
  totalUniqueEntities: number;
  duplicatesConsolidated: number;
  verifiedCount: number;
  estimatedCostUSD: number;
  errors: string[];
}
