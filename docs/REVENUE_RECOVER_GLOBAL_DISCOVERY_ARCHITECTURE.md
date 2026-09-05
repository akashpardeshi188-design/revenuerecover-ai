# RevenueRecover AI — Global Discovery & Lead Intelligence Architecture

## Executive Architecture Summary

**Product:** RevenueRecover AI  
**Core Mission:** "No relevant business lead should be unnecessarily missed."  
**System Type:** Autonomous Global Contractor Discovery, Lead Ingestion, Entity Resolution, AI Lead Intelligence & Multi-Tenant Revenue Automation.  
**Target Markets:** USA, UK, Canada (Initial Tier-1) with modular global architecture supporting Australia, New Zealand, India, UAE, and Europe.

---

## 1. Existing System Audit & Baseline

| Layer | Existing Stack | Audit Findings |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.3 (App Router + Turbopack) | Modern, fast, 55+ pages pre-built. Highly optimized. |
| **Language** | TypeScript 5, React 19 | Strict type checking enabled. |
| **Database** | Prisma ORM + PostgreSQL | Schema contains Organization, Customer, Opportunity, Conversation, AuditLog. Lacks normalized Contractor Discovery, Master Business Identity, Source Registry, and Lead Source Event tables. |
| **AI / LLM** | Google Gemini API (`@google/genai` / REST) | Implemented in `lib/ai/provider.ts` with fallback models. |
| **Payments** | PayPal v2 REST APIs + Skydo + Razorpay | Live PayPal $119/mo & $990/yr payment engine configured. |
| **Compliance** | TCPA, CAN-SPAM, UK GDPR, Canada CASL | Basic compliance rules in `lib/compliance.ts`. Needs strict consent lineage and opt-out registry. |
| **Multi-Tenancy** | Organization-based (`organizationId`) | Foundational tenant isolation present. Needs explicit `tenantId` enforcement across all discovery and lead ingestion endpoints. |

---

## 2. Global Discovery & Lead Intelligence Architecture

```
                                  GLOBAL DATA SOURCES
  ┌─────────────────┬──────────────────┬─────────────────┬──────────────────┐
  │ Google Places   │ Yelp Fusion      │ Foursquare API  │ Bing Local Maps  │
  │ (USA/UK/CA)     │ (Verified Trade) │ (Geo-Location)  │ (Multi-Region)   │
  ├─────────────────┼──────────────────┼─────────────────┼──────────────────┤
  │ OpenStreetMap   │ UK Companies Hse │ Canada Registry │ Inbound Web/SMS  │
  │ (Overpass Geo)  │ (Official Gov)   │ (Provincial DB) │ & Missed Calls   │
  └────────┬────────┴────────┬─────────┴────────┬────────┴────────┬─────────┘
           │                 │                  │                 │
           ▼                 ▼                  ▼                 ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                  MODULAR SOURCE ADAPTER FRAMEWORK                       │
  │  BaseSourceAdapter • Normalization • Rate Limiter • Health Checks       │
  └────────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                 GLOBAL BUSINESS IDENTITY & ENTITY ENGINE                │
  │  Phone E.164 • Domain Extraction • Levenshtein/Geo Matching             │
  │  → Single `business_master_id` Across All Sources                       │
  └────────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                   BUSINESS VERIFICATION ENGINE (0-100)                  │
  │  Phone Validation • Web Live Check • Multi-Source Corroboration         │
  └────────────────────────────────────┬────────────────────────────────────┘
                                       │
                  ┌────────────────────┴────────────────────┐
                  ▼                                         ▼
  ┌───────────────────────────────┐       ┌─────────────────────────────────┐
  │  CONTRACTOR BUSINESS DIRECTORY│       │   LEAD INGESTION & OPPORTUNITY  │
  │  Verified Service Providers   │       │   Missed Calls, Web Forms, CRM  │
  └───────────────┬───────────────┘       └────────────────┬────────────────┘
                  │                                        │
                  │        ┌───────────────────────────────┘
                  │        ▼
  ┌───────────────┴─────────────────────────────────────────────────────────┐
  │                 AI LEAD SCORING & DEDUPLICATION ENGINE                  │
  │  Gemini AI Intent Classification • Hot/Warm/Cold (0-100)                │
  │  Multi-Touch Collapse: Form + Missed Call + Email = 1 Master Opportunity│
  └────────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │               AI CONTRACTOR MATCHING & DISPATCH ENGINE                  │
  │  Geo Radius • Trade Category Match • Capacity • Instant SMS / Webhook   │
  └─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Data Entity Separation

To prevent catastrophic data pollution, the engine strictly separates **Businesses** from **Leads**:

1. **`BusinessMaster`**: A verified contractor/trade company (e.g. Dallas Pro HVAC LLC).
2. **`BusinessSourceRecord`**: Raw discovery record from Google, Yelp, or Bing showing provenance.
3. **`Lead`**: An actual prospective customer inquiry (e.g. homeowner needing emergency AC repair).
4. **`LeadSourceEvent`**: Specific interaction touchpoint (Missed call at 2:14 PM, Web form at 2:17 PM).
5. **`MasterOpportunity`**: Unified deduplicated high-intent deal assigned to the best matching contractor.

---

## 4. Security, Multi-Tenancy & Compliance Guardrails

- **Strict Tenant Isolation:** Every lead, client interaction, and business mapping belongs to an isolated `tenant_id`. Cross-tenant data leakage is prevented at database and API levels.
- **TCPA / 10DLC & CAN-SPAM Compliance (USA):** Prior express written consent verified prior to initiating automated SMS. Automatic 8 PM–8 AM quiet hours enforced per recipient timezone.
- **UK GDPR & PECR (UK):** Explicit B2B vs B2C consent checks, right-to-be-forgotten endpoints, encrypted PII.
- **Canada CASL:** Opt-in verification with mandatory unsubscribe header.
- **Dry-Run / Simulation Mode:** Default `DISCOVERY_DRY_RUN=true` prevents accidental outbound communications during testing.

---

## 5. Recommended Implementation Roadmap

1. **Phase 1-5:** Types, Source Registry, Modular Adapters & Centralized Configuration.
2. **Phase 6-8:** Discovery Engine, Entity Resolution, Master ID Generator & Verification Scoring.
3. **Phase 9-12:** Lead Ingestion, Deduplication, AI Lead Scoring (Gemini) & Contractor Matching.
4. **Phase 13-14:** Event Automation Bus & Compliant Missed Call Recovery Engine.
5. **Phase 15-19:** Contractor Leads Dashboard, Source Intelligence, AI Source Optimizer & Quality Engine.
6. **Phase 20-25:** Security, Compliance Guardrails, Multi-Tenant Isolation, Database Expansion & Admin Center.
7. **Phase 26-30:** Observability, Cost Tracker, Country Configs & Geo Landing Pages.
8. **Phase 31-39:** Comprehensive Test Suite, Complete Documentation Suite & Production Build Verification.
