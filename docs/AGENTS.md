# 25-Agent Autonomous Growth Organization

Each agent in the Growth Operating System has a defined responsibility, typed contract, retry policy, confidence threshold, and human escalation protocol.

---

## Agent Directory

### 1. CEO / Orchestrator Agent (`CEOOrchestratorAgent`)
- **Responsibility:** Dispatches tasks across the other 24 agents, coordinates daily growth cycles, resolves bottlenecks.
- **Escalation Trigger:** Critical agent failures, system-wide anomalies.

### 2. Market Intelligence Agent (`MarketIntelligenceAgent`)
- **Responsibility:** Analyzes target trade economics (HVAC, Plumbing, Electrical), regional pricing, and competitive positioning.

### 3. Lead Discovery Agent (`LeadDiscoveryAgent`)
- **Responsibility:** Ingests contractor candidates from Google Places, OpenStreetMap, Yelp Fusion, and UK Companies House.

### 4. Lead Verification Agent (`LeadVerificationAgent`)
- **Responsibility:** Validates E.164 phone numbers, active trade registry status, and domain MX records.

### 5. Lead Enrichment Agent (`LeadEnrichmentAgent`)
- **Responsibility:** Calculates estimated fleet size, weekly missed call volume, and recoverable monthly revenue.

### 6. Lead Scoring Agent (`LeadScoringAgent`)
- **Responsibility:** Multi-factor explainable scoring (ICP Fit 0–100, Tier A/B/C classification).

### 7. Personalization Agent (`PersonalizationAgent`)
- **Responsibility:** Generates contextual email and SMS copy referencing city, trade, and specific revenue leak numbers.

### 8. Content Agent (`ContentAgent`)
- **Responsibility:** Produces authoritative contractor guides, comparison articles, and case studies.

### 9. SEO Agent (`SEOAgent`)
- **Responsibility:** Programmatic city-and-trade landing page keyword mapping and schema markup.

### 10. Paid Ads Agent (`PaidAdsAgent` - Safety Locked)
- **Responsibility:** Drafts ad campaigns and audience segments. **Strictly requires human authorization before spending any budget.**

### 11. Email Marketing Agent (`EmailMarketingAgent`)
- **Responsibility:** 5-step automated drip sequences with automatic suppression on opt-out.

### 12. SMS / Messaging Agent (`SMSMessagingAgent`)
- **Responsibility:** Permitted SMS touchpoints with TCPA 10DLC quiet hours (8 PM - 8 AM) enforcement.

### 13. AI SDR Agent (`AISDRAgent`)
- **Responsibility:** Analyzes prospect replies and delivers objection handling rebuttals across 12 playbooks.

### 14. AI Sales Agent (`AISalesAgent`)
- **Responsibility:** Formulates tailored ROI calculations and generates PayPal subscription checkout links.

### 15. Demo Agent (`DemoAgent`)
- **Responsibility:** Runs interactive 4-step missed-call recovery walkthrough simulations.

### 16. Appointment Agent (`AppointmentAgent`)
- **Responsibility:** Coordinates demo calendar bookings and sends calendar invites.

### 17. CRM Agent (`CRMAgent`)
- **Responsibility:** Updates 15-stage lifecycle states with timestamps, reasons, and audit logs.

### 18. Onboarding Agent (`OnboardingAgent`)
- **Responsibility:** Post-payment 60-second account provisioning, webhook setup, and 150 local leads delivery.

### 19. Customer Success Agent (`CustomerSuccessAgent`)
- **Responsibility:** Evaluates account health scores and monitors missed-call recovery velocity.

### 20. Retention Agent (`RetentionAgent`)
- **Responsibility:** Detects usage drops and triggers automated salvage interventions.

### 21. Upsell Agent (`UpsellAgent`)
- **Responsibility:** Detects fleet expansion triggers to upgrade accounts to Pro Annual VIP ($990/yr).

### 22. Analytics Agent (`AnalyticsAgent`)
- **Responsibility:** Aggregates MRR, pipeline value, CAC, LTV, and AI token cost metrics.

### 23. Compliance Agent (`ComplianceAgent`)
- **Responsibility:** Pre-screens all outbound communication against TCPA, CAN-SPAM, and GDPR.

### 24. Security Agent (`SecurityAgent`)
- **Responsibility:** Audits tenant isolation, rate limits, secret rotation, and anti-abuse policies.

### 25. QA Agent (`QAAgent`)
- **Responsibility:** Runs automated end-to-end smoke test suites across all critical revenue workflows.
