# RevenueRecover AI — Master Go-Live Readiness & Release Checklist

**Document Version:** 1.0.0  
**Generated Date:** October 25, 2026  
**Target Repository:** `akashpardeshi188-design/revenuerecover-ai`  
**Active Feature Branch:** `feature/staging-mvp-integrated-2026-10-20`  
**Head Commit:** `192a4cb` (with staging verification updates)  
**Open Pull Request:** PR #5 (`feature/staging-mvp-integrated-2026-10-20` → `main`)  
**Staging Supabase Ref:** `jzoighxrxgbtqrdhknpb`  
**Production Supabase Ref:** `yyuqaulzkpchusuzrrlq` (Preserved & Protected)  
**Vercel Project ID:** `prj_ctaPsDoYUxlyw0hhsnlrxpD8zOGD` (`revenue-recover-ai`)  
**Vercel Team ID:** `team_mZAlQkA9x8oyECVVA4yBAik2`  

---

## 1. Executive Release Gate Verdict

| Gate | Status | Detail |
| :--- | :---: | :--- |
| **Pricing & Checkout Alignment** | **PASS** | Authoritative 3-tier pricing ($499 / $999 / $1,299) enforced in UI, APIs, and DB RPCs. Stale prices ($119, $149, $497, $990, $997, $1997) eradicated from active paths. |
| **Authentication & Multi-Tenant Security** | **PASS** | Supabase Auth, company onboarding, RLS policies on all 6 core tables, and security invoker views verified. Recursive RLS prevented. |
| **Dual Gateway Subscriptions & Webhooks** | **PASS** | Razorpay (primary) and PayPal (secondary) recurring subscriptions implemented with HMAC SHA-256 signatures, raw body validation, and idempotency. |
| **Automated Billing Quality Checks** | **PASS** | 33 of 33 automated integration tests passed (100% pass rate via `npm run test:billing`). |
| **Environment Variable Security** | **PASS** | Complete audit conducted across 31 variables. No secrets committed. Resilient plan ID key mappings deployed. |
| **Staging Database Schema Baseline** | **PASS** | Unified, idempotent 001–021 schema generated at `artifacts/000_staging_baseline_001_to_021.sql`. Migration 022 updated to $499 canonical quote. |
| **Production Cutover Readiness** | **BLOCKED** | Blocked intentionally for stakeholder staging review. Production Supabase (`yyuqaulzkpchusuzrrlq`) and live PayPal credentials protected until staging smoke test signs off. |

---

## 2. Phase 1: Real Project & Environment Audit

### 2.1 Git Repository & Branch
- **Remote Origin URL:** `https://github.com/akashpardeshi188-design/revenuerecover-ai.git` (Verified)
- **Active Working Branch:** `feature/staging-mvp-integrated-2026-10-20` (Verified)
- **Status Against Remote:** Clean tracking; no unauthorized commits on `main`.
- **Target PR:** Pull Request #5 is open from `feature/staging-mvp-integrated-2026-10-20` into `main`.

### 2.2 Infrastructure Alignment
- **Vercel Project Association:**
  - File: `.vercel/project.json`
  - Project ID: `prj_ctaPsDoYUxlyw0hhsnlrxpD8zOGD`
  - Team ID: `team_mZAlQkA9x8oyECVVA4yBAik2`
  - Framework: `nextjs` (Next.js 16.3.8, React 19.2.8, Tailwind CSS v4)
- **Supabase Instances:**
  - **Staging Instance:** `jzoighxrxgbtqrdhknpb` (Active target for staging migrations and Preview testing)
  - **Production Instance:** `yyuqaulzkpchusuzrrlq` (Untouched, read-only protection in place)

---

## 3. Phase 2: Authoritative Pricing & Subscription Logic

### 3.1 Intended Monthly Pricing Model
1. **Starter Plan:** **$499.00 USD/month** (`starter` / 49,900 cents)
2. **Growth Plan:** **$999.00 USD/month** (`growth` / 99,900 cents)
3. **Revenue Partner Plan:** **$1,299.00 USD/month** (`revenue_partner` / 129,900 cents)

### 3.2 Audit of Eradicated Stale Prices
- **$119 / $59.50 / $239 Stale Flash Sale Artifacts:**
  - Removed from `components/marketing/UrgencyCountdownBanner.tsx` (Replaced with authoritative price notification).
  - Removed from `app/faq/page.tsx` (Updated to $499, $999, $1,299).
  - Removed from `lib/growth-engine/objections/objection-knowledge-base.ts`.
  - Removed from `app/growth/daily-revenue/page.tsx`, `app/growth/sprint-650/page.tsx`, and telemetry modules.
- **$149 Stale Base:**
  - Removed from `components/marketing/RoiCalculator.tsx` (Replaced with $999 Growth standard benchmark).
- **$497 / $997 / $1997 Legacy Rates:**
  - Replaced in `supabase/migrations/20261021133000_022_final_pricing_and_razorpay_subscriptions.sql` (`WHEN 'starter' THEN 499`).
  - Replaced in `artifacts/000_staging_baseline_001_to_021.sql` (Default table constraints and quote fallbacks updated to 499 / 999 / 1299).
- **$990 Legacy Rate:**
  - Removed from all active payment routes; replaced with strict $999 / $1,299 / $499 schema.

### 3.3 Codebase Pricing Source of Truth
- `app/pricing/page.tsx`: Explicitly displays Starter ($499), Growth ($999), and Revenue Partner ($1,299).
- `app/dashboard/billing/page.tsx`: Explicitly handles billing upgrades/downgrades across `starter`, `growth`, `revenue_partner`.
- `lib/razorpay-rest.ts`: `RAZORPAY_PLAN_AMOUNTS` maps `starter` (49900), `growth` (99900), and `revenue_partner` (129900).
- `app/api/checkout/razorpay/route.ts`: Authoritative server-side plan validation and plan ID lookups.
- `app/api/checkout/paypal/create-subscription/route.ts`: Server-side plan lookup and validation for PayPal subscriptions.

---

## 4. Phase 3: Authentication & Multi-Tenant Security Verification

### 4.1 Supabase Auth & Company Onboarding
- **User Signup & Confirmation:** Handled through `@supabase/ssr` with secure cookie management and PKCE auth flows.
- **Onboarding Flow:** New users must complete onboarding before obtaining a `company_id`.
- **Tenant Context Resolution:** Resolves via `private.current_user_company_id()`, matching `auth.uid()` against `public.users.id`.

### 4.2 Row-Level Security (RLS) Isolation
- All 6 core public tables have RLS enabled:
  - `public.companies`
  - `public.users`
  - `public.subscriptions`
  - `public.leads`
  - `public.audits`
  - `public.audit_issues`
- **Recursive RLS Fix:** `public.users` policy utilizes direct `auth.uid() = id` equality without recursive subselects on `public.users`.
- **Tenant Scope Enforcement:** Subscriptions, leads, audits, and audit issues enforce `company_id = private.current_user_company_id()`.
- **Audit View Security:** `public.public_audit_reports` uses `security_invoker = true` to prevent privilege escalation; anonymous execute grants on security functions revoked.

### 4.3 Concurrency & Cross-Gateway Guardrails
- **Single Active Subscription Rule:** Prevents initiating a new subscription on Gateway B if an active, trialing, or past-due subscription exists on Gateway A.
- **Checkout Idempotency:** Managed via UUID `checkout_key` to avoid duplicate pending records.

---

## 5. Phase 4: Environment Variable Audit Table

Derived from dynamic scanning of source code, `.env.example`, and `.env.local`:

| Variable Name | In `.env.example` | In Local `.env.local` | Sensitivity | Required Scope | Purpose / Staging Assessment |
| :--- | :---: | :---: | :---: | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | **Yes** | Public | Preview + Prod | Supabase API endpoint. Must point to staging (`jzoighxrxgbtqrdhknpb`) in Preview. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **Yes** | **Yes** | Public | Preview + Prod | Supabase public client key for browser auth & queries. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | **Yes** | **Secret** | Server Only (Preview + Prod) | Privileged admin key for webhook listeners and background sync. Never expose to client. |
| `RAZORPAY_KEY_ID` / `NEXT_PUBLIC_RAZORPAY_KEY_ID` | **Yes** | Optional | Public/Client | Preview + Prod | Razorpay key identifier (`rzp_test_...` in staging). |
| `RAZORPAY_KEY_SECRET` | **Yes** | Optional | **Secret** | Server Only (Preview + Prod) | Razorpay HMAC signing and API secret. |
| `RAZORPAY_WEBHOOK_SECRET` | **Yes** | Optional | **Secret** | Server Only (Preview + Prod) | Razorpay webhook signature verification secret (`whsec_...`). |
| `RAZORPAY_PLAN_ID_STARTER` / `RAZORPAY_STARTER_PLAN_ID` | **Yes** | Optional | Public/Config | Preview + Prod | Razorpay Plan ID for Starter ($499/mo). Supported with dual fallback. |
| `RAZORPAY_PLAN_ID_GROWTH` / `RAZORPAY_GROWTH_PLAN_ID` | **Yes** | Optional | Public/Config | Preview + Prod | Razorpay Plan ID for Growth ($999/mo). Supported with dual fallback. |
| `RAZORPAY_PLAN_ID_REVENUE_PARTNER` / `RAZORPAY_REVENUE_PLAN_ID` | **Yes** | Optional | Public/Config | Preview + Prod | Razorpay Plan ID for Revenue Partner ($1,299/mo). |
| `RAZORPAY_LIVE_PAYMENTS_ENABLED` | **Yes** | No | Safety Flag | Server Only (Prod Only) | Fail-closed guard: must be `false` in Staging/Preview. Set `true` only for live production. |
| `PAYPAL_MODE` | **Yes** | **Yes** | Config | Server Only | Set to `sandbox` for Preview/Staging. Reverted from live to sandbox locally. |
| `PAYPAL_CLIENT_ID` / `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | **Yes** | **Yes** | Public/Client | Preview + Prod | PayPal REST App Client ID. |
| `PAYPAL_CLIENT_SECRET` | **Yes** | **Yes** | **Secret** | Server Only (Preview + Prod) | PayPal OAuth client secret. |
| `PAYPAL_WEBHOOK_ID` | **Yes** | **Yes** | Config | Server Only (Preview + Prod) | PayPal Webhook registration ID for event signature verification. |
| `PAYPAL_PLAN_ID_STARTER` / `PAYPAL_STARTER_PLAN_ID` | **Yes** | **Yes** | Config | Preview + Prod | PayPal Plan ID for Starter ($499/mo). Supported with dual fallback. |
| `PAYPAL_PLAN_ID_GROWTH` / `PAYPAL_GROWTH_PLAN_ID` | **Yes** | **Yes** | Config | Preview + Prod | PayPal Plan ID for Growth ($999/mo). Supported with dual fallback. |
| `PAYPAL_PLAN_ID_REVENUE_PARTNER` / `PAYPAL_REVENUE_PLAN_ID` | **Yes** | **Yes** | Config | Preview + Prod | PayPal Plan ID for Revenue Partner ($1,299/mo). |
| `PAYPAL_LIVE_PAYMENTS_ENABLED` | No | No | Safety Flag | Server Only (Prod Only) | Production activation gate for PayPal subscriptions. |
| `APP_BASE_URL` | **Yes** | Optional | Public | Prod Only | Canonical base origin (leave unset in Preview so `VERCEL_URL` is used). |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Optional | Public | Prod Only | Marketing and SEO public base URL. |
| `NEXT_PUBLIC_APP_URL` | No | **Yes** | Public | Local/Dev | Local application URL (`http://localhost:3000`). |
| `NEXT_PUBLIC_APP_NAME` | No | **Yes** | Public | All | Application display branding (`RevenueRecover AI`). |
| `GEMINI_API_KEY` | No | **Yes** | **Secret** | Server Only | Google Gemini API key for AI revenue audit agent. |
| `GEMINI_MODEL` | No | **Yes** | Config | Server Only | Gemini model designation (e.g. `gemini-1.5-pro` / `gemini-2.0-flash`). |
| `RATE_LIMIT_AUDIT_PER_HOUR` | No | **Yes** | Config | Server Only | Rate limiting threshold for public audit scanning. |
| `RATE_LIMIT_API_PER_MINUTE` | No | **Yes** | Config | Server Only | Rate limiting threshold for general API requests. |
| `OPENAI_API_KEY` | No | No | **Secret** | Optional | Fallback LLM provider for legacy agents. |
| `ANTHROPIC_API_KEY` | No | No | **Secret** | Optional | Fallback LLM provider for analysis workflows. |
| `GOOGLE_PLACES_API_KEY` / `GOOGLE_MAPS_API_KEY` | No | No | **Secret** | Optional | Contractor discovery and address verification. |
| `VERCEL_URL` / `VERCEL_ENV` | System | System | System | Vercel Runtime | Injected automatically by Vercel for dynamic preview origin resolution. |

---

## 6. Phase 5: Billing & Webhook Implementation

### 6.1 Razorpay Recurring Subscriptions
- **Gateway Status:** Primary recurring gateway.
- **REST Client:** `lib/razorpay-rest.ts` implemented using native Node `crypto` module (no heavy third-party SDK dependencies).
- **Signature Verification:**
  - **Checkout Callback:** Validates `HMAC_SHA256(razorpay_payment_id + "|" + razorpay_subscription_id, keySecret)` using `timingSafeEqual`.
  - **Webhook Payload:** Validates `HMAC_SHA256(rawBody, webhookSecret)` against `x-razorpay-signature` header using `timingSafeEqual`.
- **Subscription Lifecycle Events:**
  - `subscription.activated` → Marks subscription `active`.
  - `subscription.charged` → Updates `last_payment_at`, confirms `active`.
  - `payment.failed` → Transitions status to `past_due` (triggers dunning).
  - `subscription.halted` → Transitions status to `past_due`.
  - `subscription.cancelled` → Transitions status to `canceled`.
- **Idempotency:** Webhook handler validates event uniqueness before processing state mutations.

### 6.2 PayPal Recurring Subscriptions
- **Gateway Status:** Secondary recurring gateway.
- **Server-Side Validation:** Validates plan quotes and amounts in USD before redirecting to PayPal checkout.
- **Signature Verification:** Authoritative verification using PayPal API `/v1/notifications/verify-webhook-signature`.
- **Environment Isolation:** Local and preview environments strictly configured to `PAYPAL_MODE=sandbox`.

---

## 7. Phase 6: Automated Quality & Test Results

### 7.1 Automated Billing Integration Test Suite
- **Test Script:** `scripts/test-billing-integration.mjs`
- **Execution Command:** `npm run test:billing`
- **Result Summary:** **33 Passed, 0 Failed (100% Passing)**

```
================================================================
⚡ REVENUERECOVER AI — DUAL SUBSCRIPTION GATEWAY TEST SUITE
================================================================

--- 1. Authoritative Plan Pricing Checks ---
✅ [PASS] Starter plan is exactly $499 USD/month (49,900 cents)
✅ [PASS] Growth plan is exactly $999 USD/month (99,900 cents)
✅ [PASS] Revenue Partner plan is exactly $1,299 USD/month (129,900 cents)
✅ [PASS] Stale price $119 is not present in active plan configurations
✅ [PASS] Stale price $149 is not present in active plan configurations
✅ [PASS] Stale price $497 is not present in active plan configurations
✅ [PASS] Stale price $990 is not present in active plan configurations
✅ [PASS] Stale price $997 is not present in active plan configurations
✅ [PASS] Stale price $1997 is not present in active plan configurations

--- 2. Razorpay Callback Signature Verification ---
✅ [PASS] Valid HMAC SHA256 payment callback signature is verified successfully
✅ [PASS] Forged or tampered callback signature fails verification
✅ [PASS] Tampered payment ID causes signature mismatch
✅ [PASS] Tampered subscription ID causes signature mismatch
✅ [PASS] Incorrect secret fails signature verification
✅ [PASS] Empty parameter values fail closed immediately

--- 3. Razorpay Webhook Raw Body Signature Verification ---
✅ [PASS] Exact raw JSON body webhook signature verified successfully
✅ [PASS] Raw body tampered by 1 byte fails webhook signature verification
✅ [PASS] Wrong webhook secret rejects signature
✅ [PASS] Missing x-razorpay-signature header rejects webhook request

--- 4. Webhook Idempotency Simulation ---
✅ [PASS] First receipt of webhook event evt_001 is processed
✅ [PASS] Duplicate receipt of webhook event evt_001 is idempotently ignored
✅ [PASS] Distinct webhook event evt_002 is processed normally

--- 5. Cross-Gateway Single Active Subscription Conflict ---
✅ [PASS] Prevented PayPal checkout because active Razorpay subscription already exists for company
✅ [PASS] Allowed checkout for company with no existing live subscriptions

--- 6. Payment Failure State Machine Transition ---
✅ [PASS] Payment failure transitions subscription status from active to past_due
✅ [PASS] Subsequent successful charge restores subscription status from past_due to active
✅ [PASS] Cancellation event marks subscription as canceled

--- 7. Scoped Subscription Cancellation & Tenant Isolation ---
✅ [PASS] Tenant Company A cannot cancel Tenant Company B subscription (Tenant Isolation Enforced)
✅ [PASS] Tenant Company A can legitimately cancel their own subscription

--- 8. Dual Gateway Plan ID Key Resolution Resiliency ---
✅ [PASS] Resolves standard RAZORPAY_PLAN_ID_STARTER correctly
✅ [PASS] Resolves alternate RAZORPAY_GROWTH_PLAN_ID correctly
✅ [PASS] Resolves alternate PAYPAL_STARTER_PLAN_ID correctly
✅ [PASS] Resolves standard PAYPAL_PLAN_ID_GROWTH correctly

================================================================
⚡ TEST RESULTS: 33/33 TESTS PASSED
================================================================
```

---

## 8. Phase 7: Staging, Vercel & Production Release Readiness

### 8.1 Database Migration Scripts Ready for Staging
1. **Consolidated Staging Baseline (001 through 021):**
   - Path: `artifacts/000_staging_baseline_001_to_021.sql`
   - Purpose: Creates all foundational extensions, enums, tables, foreign keys, RLS policies, and private security functions in strict topological dependency order.
   - Status: Verified idempotent (`IF NOT EXISTS` / `CREATE OR REPLACE`).
2. **Canonical Final Pricing & Razorpay Subscriptions (022):**
   - Path: `supabase/migrations/20261021133000_022_final_pricing_and_razorpay_subscriptions.sql`
   - Purpose: Upgrades subscription quotes to $499 Starter, $999 Growth, and $1,299 Revenue Partner. Implements concurrency-safe `prepare_razorpay_checkout` and cross-gateway protection.
   - Status: Ready to apply to staging project `jzoighxrxgbtqrdhknpb`.

### 8.2 Production Release Protection
- **Production Supabase (`yyuqaulzkpchusuzrrlq`):** NOT touched. All migrations must be validated on staging `jzoighxrxgbtqrdhknpb` first.
- **Live Payments:** `RAZORPAY_LIVE_PAYMENTS_ENABLED=false` and `PAYPAL_MODE=sandbox` enforced across all staging configurations.
- **Git Safety:** All work staged on branch `feature/staging-mvp-integrated-2026-10-20`. `main` remains protected until final staging approval.

---

## 9. Next Steps for Immediate Release

1. **Apply Migration 000 Baseline & Migration 022 to Staging Project `jzoighxrxgbtqrdhknpb` via Supabase SQL Editor.**
2. **Verify Staging Tables & Policies:** Confirm 6 core tables and RLS are active on staging.
3. **Execute Live Staging Sandbox Checkout Test:**
   - Test Razorpay Test Mode checkout with test card.
   - Test PayPal Sandbox checkout.
   - Confirm subscription status transitions to `active`.
4. **Trigger Vercel Preview Build on PR #5:**
   - Ensure Vercel environment variables for Preview match staging project `jzoighxrxgbtqrdhknpb`.
5. **Stakeholder Approval & Merge:** Once staging passes smoke testing, merge PR #5 to `main` and execute production cutover.
