# Autonomous AI Growth Operating System — Technical Architecture

## 1. System Overview

The **Autonomous AI Growth Operating System** is built on a decoupled, modular, event-driven architecture designed to wrap around the core **RevenueRecover AI SaaS** application.

```
+-------------------------------------------------------------------------------+
|                       AUTONOMOUS GROWTH ENGINE (25 AGENTS)                    |
|                                                                               |
|  [CEO Orchestrator] <===> [Discovery & Scoring] <===> [Compliance Pre-Flight] |
|           ||                                                ||                |
|  [AI SDR / Objections] <==> [Demo & Scanner Funnels] <===> [Email/SMS Drips]   |
|           ||                                                ||                |
|  [CRM 15-Stage Engine] <==> [Onboarding & Success] <===> [Executive Advisor] |
+-------------------------------------------------------------------------------+
                                       ||
                 (Sells, Onboards, and Manages Contractors For)
                                       ▼
+-------------------------------------------------------------------------------+
|                        REVENUERECOVER AI CORE SAAS                            |
|                                                                               |
|  • 45-Sec Automated Missed-Call AI Text-Back                                  |
|  • 90-Day Dormant Customer Reactivation Engine                                |
|  • Automated Unpaid Invoice Follow-Up                                         |
|  • CRM Webhook Integrations (ServiceTitan, Housecall Pro, Jobber)             |
|  • Contractor Multi-Tenant Dashboard & Opportunity Ledger                     |
+-------------------------------------------------------------------------------+
```

## 2. Technology Stack

- **Application Framework:** Next.js 16.3 (Turbopack, App Router, React 19.2, TypeScript 5)
- **Styling:** Tailwind CSS v4
- **Database & Data Layer:** PostgreSQL with Prisma ORM (`prisma/schema.prisma`)
- **AI Core:** Multi-provider gateway (`lib/ai/provider.ts`) with Gemini 1.5 Flash / Pro, OpenAI GPT-4o-mini, Anthropic Claude 3 Haiku, and deterministic heuristic fallback.
- **Payments:** PayPal REST API v2, Razorpay, and Skydo cross-border ACH.
- **Outreach Transport:** Twilio (SMS / TCPA 10DLC), Resend / SendGrid (Email).
