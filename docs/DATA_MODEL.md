# RevenueRecover AI — Data Model & Entity Relationship Specification

## Entity Architecture

```
  ┌────────────────────────┐            ┌────────────────────────┐
  │     SourceRegistry     │ 1        * │  BusinessSourceRecord  │
  │ (API & Provider Meta)  ├───────────►│ (Raw Data Ingestion)  │
  └────────────────────────┘            └───────────┬────────────┘
                                                    │ *
                                                    │
                                                    ▼ 1
                                        ┌────────────────────────┐
                                        │     BusinessMaster     │
                                        │  (Verified Contractor) │
                                        └───────────┬────────────┘
                                                    │ 1
                                                    │
                                                    ▼ *
  ┌────────────────────────┐ 1        * ┌────────────────────────┐
  │   MasterOpportunity    │◄───────────┤          Lead          │
  │  (Unified Deal Hub)    │            │(Individual Touchpoint) │
  └───────────┬────────────┘            └───────────┬────────────┘
              │ 1                                   │ 1
              │                                     │
              ▼ *                                   ▼ *
  ┌────────────────────────┐            ┌────────────────────────┐
  │    LeadSourceEvent     │            │    LeadSourceEvent     │
  │(Call, Form, SMS Event) │            │(Call, Form, SMS Event) │
  └────────────────────────┘            └────────────────────────┘
```

## Key Tables

1. **`BusinessMaster`**: Normalized master contractor profile. Key attributes: `normalizedName`, `phoneE164`, `domain`, `verificationScore`, `primaryTrade`, `serviceRadiusMiles`, `tenantId`.
2. **`BusinessSourceRecord`**: Raw ingested entity linked to a specific source registry record.
3. **`Lead`**: Individual customer inquiry event with AI lead score (0-100) and classification (`HOT`, `WARM`, `COLD`).
4. **`MasterOpportunity`**: Deduplicated customer deal combining multiple interaction channels (Form + Missed Call + Email) into a single CRM pipeline record.
5. **`LeadSourceEvent`**: Specific timestamped interaction event payload.
