# RevenueRecover AI — Comprehensive Architecture Audit

**Audit Date:** September 2026  
**Audited By:** Lead AI Architect & Principal Systems Engineer  
**Target SaaS Product:** RevenueRecover AI (AI-Powered Missed-Call Recovery & Revenue Automation for Home Service Businesses)  
**Primary Objective:** Audit existing codebase and define the integration blueprint for the Autonomous AI-Powered Growth Operating System.

---

## 1. Executive Summary & Product Overview

RevenueRecover AI is a specialized B2B vertical SaaS designed for home service contractors (primarily **HVAC**, **Plumbing**, and **Electrical** across the **USA**, **UK**, and **Canada**). 

### Core Product Value Proposition
- **45-Second AI Text-Back:** Recovers inbound leads lost to missed calls by triggering immediate, contextual SMS dialogues.
- **Dormant Customer Reactivation:** Discovers clients inactive for 90+ days in CRM records and re-engages them for seasonal tune-ups and system upgrades.
- **Automated Unpaid Invoice Recovery:** Tactful, compliance-checked payment reminders via SMS and email.
- **Verified Local Lead Ingestion:** Provides 150–200 verified local homeowner opportunities upon customer onboarding.
- **Subscription Tiers:**
  - **Starter:** $59/mo (Solo contractors, 50 local leads, basic recovery)
  - **Growth (Flagship):** $119/mo (Full AI recovery suite + 150–200 verified local leads)
  - **Pro Annual VIP:** $990/yr (Multi-location, 500+ leads, dedicated success manager)

---

## 2. Current Codebase & Architecture Audit

### 2.1 Technology Stack
- **Framework:** Next.js 16.3 (Turbopack, App Router, React 19.2, TypeScript 5)
- **Styling & UI:** Tailwind CSS v4, Lucide React icons, Canvas Confetti
- **Database & ORM:** PostgreSQL schema managed with Prisma ORM (`prisma/schema.prisma`)
- **AI Core:** Multi-provider client (`lib/ai/provider.ts`) supporting Google Gemini (`gemini-1.5-flash`), OpenAI (`gpt-4o-mini`), Anthropic (`claude-3-haiku`), and a deterministic high-fidelity fallback engine with token cost accounting.
- **Payments:** PayPal REST API v2 (`/api/checkout/paypal/create-order`, `/api/checkout/paypal/capture-order`), Razorpay webhooks, and Skydo cross-border integration.
- **Deployment:** Vercel Edge / Serverless deployment configuration (`vercel.json`).

### 2.2 Existing Route Architecture

#### Public Marketing & Product Experience
- `/` — Homepage featuring ROI calculator, problem breakdown, feature highlights, and interactive chat.
- `/pricing` — 3-tier USD pricing table with direct PayPal checkout modal.
- `/demo` — Interactive simulator demonstrating missed-call recovery, quote salvage, and invoice recovery.
- `/free-revenue-scan` / `/scanner` — Free audit tool analyzing missed-call risk and revenue leakage.
- `/how-it-works`, `/integrations`, `/security`, `/faq`, `/blog`, `/industries`, `/solutions/hvac`, `/solutions/plumbing`, `/solutions/electrical`
- `/contractors/[country]/[city]/[category]` — Dynamic localized SEO landing pages for contractors across target geographies.

#### Customer & Admin SaaS Portal
- `/dashboard` — Multi-metric recovery analytics, recent recoveries, live pipeline.
- `/dashboard/opportunities` — Detected, in-progress, and recovered revenue opportunities.
- `/dashboard/leads` — Ingested and assigned contractor leads.
- `/dashboard/inbox` — Live omnichannel conversation manager with AI suggestions.
- `/dashboard/campaigns` — Dormant reactivation and invoice recovery campaigns.
- `/dashboard/integrations` — ServiceTitan, Housecall Pro, Jobber, QuickBooks connectors.
- `/dashboard/settings` — Autopilot mode toggles, human approval thresholds, global emergency kill-switch.
- `/admin/global-discovery` — Multi-source discovery control center with geographic targeting.
- `/growth/*` — Growth dashboard, SDR sales agent testing, executive CEO reports, experimentation matrix.

---

## 3. Database Schema Audit (`prisma/schema.prisma`)

The database architecture is well-structured into multi-tenant SaaS entities and discovery pipeline entities:

### 3.1 SaaS Core Entities
1. `Organization`: Multi-tenant boundary with subscription plan, billing status, and recovered revenue aggregates.
2. `User` & `OrganizationMember`: Role-based access control (`OWNER`, `ADMIN`, `MANAGER`, `AGENT`, `VIEWER`).
3. `Customer`: Contractor's end-customer profile with LTV, purchase history, and AI tags.
4. `Opportunity`: Granular recovery opportunities (`MISSED_CALL`, `ABANDONED_QUOTE`, `OVERDUE_INVOICE`, `DORMANT_CUSTOMER`, etc.) with urgency, confidence score, and recovered amount.
5. `Conversation` & `ChatMessage`: Omnichannel message logs (SMS, Email, Webchat, Call).
6. `Campaign`: Outbound campaign definitions and execution metrics.
7. `Integration`: Connected CRM, phone system, and payment gateway metadata.
8. `AuditLog` & `SystemEvent`: Full event-sourcing and compliance tracking.

### 3.2 Discovery & Lead Intelligence Entities
1. `SourceRegistry`: External data providers (Google Places, OSM Overpass, Yelp, Foursquare, Companies House) with rate limits, robots policies, and terms compliance status.
2. `BusinessMaster`: Consolidated contractor entity with normalized address, geocoding, verified phone/email/domain, trade category, and verification scores.
3. `BusinessSourceRecord`: Source provenance records mapping raw external data to `BusinessMaster`.
4. `Lead` & `MasterOpportunity`: Raw and consolidated prospect leads with urgency, estimated job value, and verification status.
5. `DiscoveryJobRun`: Batch discovery execution logs with cost tracking and deduplication statistics.

---

## 4. Strengths & High-Value Assets

1. **Clean Separation of Concerns:** Core domain types (`lib/types.ts`), compliance rules (`lib/compliance.ts`), and scoring engines (`lib/scoring-engine.ts`) are decoupled from UI components.
2. **Deterministic Fallbacks:** The AI provider (`lib/ai/provider.ts`) guarantees zero downtime even if upstream AI APIs encounter network timeouts or rate limits.
3. **Multi-Source Discovery Engine:** Adapter framework (`lib/discovery/adapters/`) supports OpenStreetMap Overpass, Google Places, Yelp Fusion, Foursquare, and UK Companies House with built-in deduplication and verification.
4. **Built-In Compliance Safeguards:** Multi-jurisdiction rules for TCPA, CAN-SPAM, and GDPR with explicit consent validation and time-of-day quiet hours.

---

## 5. Identified Gaps & Opportunities for the Autonomous Growth Engine

While the core product and foundation are robust, the following growth operating system components are needed to achieve full autonomy:

| Component | Current State | Required State for Autonomous Growth Engine |
| :--- | :--- | :--- |
| **Agent Organization** | 8 basic agents with partial event hooks | 25 specialized agent roles with strict input/output schemas, retry policies, confidence thresholds, and audit trails |
| **Outreach Sequences** | Manual or single-event trigger | Configurable multi-day, multi-channel (Email, SMS, LinkedIn) automated drip sequences with automatic suppression on reply/unsubscribe |
| **AI SDR & Sales Agent** | Basic prompt simulator | State-aware sales agent with objection knowledge base, pain discovery, dynamic pricing recommendations, and real-time CRM stage updates |
| **Lead Magnet / Scanner** | UI simulation | Fully functional automated scanner generating shareable revenue-leak audits with lead capture and instant demo booking |
| **AI Command Center** | Static report cards | Natural language query engine allowing leadership to query live MRR, pipeline, conversion bottlenecks, and agent performance |
| **Human-in-the-Loop** | Basic copilot switch | Granular policy engine enforcing explicit human approval for ad spend, high-risk templates, refunds, and sensitive communications |
| **Automated Daily Crons** | Manual UI button runs | Scheduled daily/weekly operations orchestrator executing discovery -> enrichment -> scoring -> compliance check -> outreach -> CRM sync |

---

## 6. Architectural Integration Blueprint

```
+-----------------------------------------------------------------------------------+
|                        AUTONOMOUS AI GROWTH COMPANY                               |
|                                                                                   |
|  [CEO Orchestrator] <---> [Market Intel & Discovery] <---> [Enrichment & Scoring] |
|           |                                                        |              |
|  [Compliance Guard] <---> [Multi-Channel Outreach & Drips] <--------+              |
|           |                                                        |              |
|  [AI SDR / Sales]  <---> [Interactive Demo & Scanner] <---> [Booking & Stripe/PP] |
|           |                                                        |              |
|  [Onboarding Agent] <---> [Customer Success & Retention] <---> [Upsell / Growth]  |
+-----------------------------------------------------------------------------------+
                                         │
             (Sells, Onboards, and Activates Customers For)
                                         ▼
+-----------------------------------------------------------------------------------+
|                        REVENUERECOVER AI CORE SAAS                                |
|                                                                                   |
|  • 45-Sec Missed-Call AI Text-Back                                                |
|  • Dormant Customer 90-Day Reactivation                                           |
|  • Automated Unpaid Invoice Recovery                                              |
|  • CRM Connectors (ServiceTitan, Housecall Pro, Jobber, QuickBooks)              |
|  • Contractor Multi-Tenant Dashboard & Opportunity Ledger                         |
+-----------------------------------------------------------------------------------+
```

---

## 7. Next Steps

1. Publish Master Plan (`/docs/AI_GROWTH_ENGINE_MASTER_PLAN.md`).
2. Establish Implementation Tracking Matrix (`/docs/IMPLEMENTATION_STATUS.md`).
3. Execute Phase 1 through Phase 8 systematically with full verification after each phase.
