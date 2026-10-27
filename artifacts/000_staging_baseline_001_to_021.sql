-- ==============================================================================
-- RevenueRecover AI - Consolidated Staging Baseline Migration (001 - 021)
-- Target Database: RevenueRecover AI Staging (jzoighxrxgbtqrdhknpb)
-- 
-- Scope:
--   Consolidates all foundational migrations (001, 002, 003, 004, 005, 006,
--   014, 015, 017, 018, 019, 020, 021) into a single, cohesive, idempotent script.
--
-- STRICT OPERATIONAL SAFETY:
--   - Idempotent: safe to run on a fresh database or an existing staging instance.
--   - Non-destructive: uses IF NOT EXISTS, CREATE OR REPLACE, and DROP POLICY IF EXISTS.
--   - Does NOT apply Migration 022 (final $999/$1,299 Razorpay & PayPal billing).
--   - DO NOT EXECUTE AGAINST PRODUCTION (yyuqaulzkpchusuzrrlq).
-- ==============================================================================

-- ==============================================================================
-- SECTION 1: EXTENSIONS & PRIVATE SCHEMA SETUP
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role, postgres;

-- ==============================================================================
-- SECTION 2: ENUM TYPES DEFINITIONS
-- ==============================================================================

DO $$ BEGIN
  -- Core Roles (including extended 'client' and 'contractor' from 005)
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'viewer', 'client', 'contractor');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'company_status') THEN
    CREATE TYPE company_status AS ENUM ('active', 'inactive', 'prospect', 'client');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE lead_status AS ENUM ('new', 'audited', 'contacted', 'replied', 'qualified', 'demo_booked', 'client', 'lost');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_status') THEN
    CREATE TYPE audit_status AS ENUM ('pending', 'analyzing', 'completed', 'failed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_severity') THEN
    CREATE TYPE issue_severity AS ENUM ('critical', 'high', 'medium', 'low');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_category') THEN
    CREATE TYPE issue_category AS ENUM ('website', 'seo', 'conversion', 'trust', 'lead_capture', 'local_presence', 'revenue_recovery');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'outreach_channel') THEN
    CREATE TYPE outreach_channel AS ENUM ('email', 'sms', 'call');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'outreach_status') THEN
    CREATE TYPE outreach_status AS ENUM ('draft', 'sent', 'delivered', 'opened', 'replied', 'bounced');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_type') THEN
    CREATE TYPE business_type AS ENUM ('hvac', 'plumbing', 'hvac_plumbing', 'electrical', 'general_contractor', 'other');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE subscription_status AS ENUM ('inactive', 'trialing', 'active', 'past_due', 'canceled', 'unpaid');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'onboarding_status') THEN
    CREATE TYPE onboarding_status AS ENUM ('not_started', 'in_progress', 'review_pending', 'completed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'outreach_variant_type') THEN
    CREATE TYPE outreach_variant_type AS ENUM ('direct', 'consultative', 'short');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prospect_source') THEN
    CREATE TYPE prospect_source AS ENUM ('manual', 'csv', 'directory', 'google_business', 'website_discovery', 'referral', 'inbound', 'other');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pipeline_stage') THEN
    CREATE TYPE pipeline_stage AS ENUM ('discovered', 'researched', 'audited', 'approved', 'contacted', 'replied', 'qualified', 'demo_booked', 'proposal', 'won', 'lost', 'do_not_contact');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reply_classification') THEN
    CREATE TYPE reply_classification AS ENUM ('interested', 'question', 'not_interested', 'later', 'pricing', 'already_have_agency', 'wrong_person', 'unsubscribe', 'positive', 'negative', 'unknown');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'follow_up_status') THEN
    CREATE TYPE follow_up_status AS ENUM ('scheduled', 'due', 'completed', 'stopped', 'canceled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_lead_status') THEN
    CREATE TYPE client_lead_status AS ENUM ('new', 'contacted', 'qualified', 'appointment', 'won', 'lost', 'unresponsive');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'recovery_status') THEN
    CREATE TYPE recovery_status AS ENUM ('detected', 'in_progress', 'recovered', 'lost', 'dismissed');
  END IF;
END $$;

-- Ensure enum values from migration 005 are present if user_role was created prior
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'client';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'contractor';

-- ==============================================================================
-- SECTION 3: CORE TABLES CREATION & COLUMN EXTENSIONS
-- ==============================================================================

-- 1. Companies
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  business_type business_type NOT NULL DEFAULT 'other',
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  email TEXT,
  status company_status NOT NULL DEFAULT 'prospect',
  client_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role user_role NOT NULL DEFAULT 'viewer',
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- 3. Leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'website_audit',
  lead_score INTEGER CHECK (lead_score >= 0 AND lead_score <= 100),
  status lead_status NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Audits
CREATE TABLE IF NOT EXISTS public.audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  audit_status audit_status NOT NULL DEFAULT 'pending',
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  conversion_score INTEGER CHECK (conversion_score >= 0 AND conversion_score <= 100),
  website_score INTEGER CHECK (website_score >= 0 AND website_score <= 100),
  trust_score INTEGER CHECK (trust_score >= 0 AND trust_score <= 100),
  lead_capture_score INTEGER CHECK (lead_capture_score >= 0 AND lead_capture_score <= 100),
  local_presence_score INTEGER CHECK (local_presence_score >= 0 AND local_presence_score <= 100),
  revenue_opportunity_score INTEGER CHECK (revenue_opportunity_score >= 0 AND revenue_opportunity_score <= 100),
  executive_summary TEXT,
  estimated_opportunity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. Audit Issues
CREATE TABLE IF NOT EXISTS public.audit_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  category issue_category NOT NULL,
  severity issue_severity NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  estimated_impact TEXT,
  confidence TEXT DEFAULT 'inferred',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Outreach
CREATE TABLE IF NOT EXISTS public.outreach (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  channel outreach_channel NOT NULL DEFAULT 'email',
  subject TEXT,
  message TEXT NOT NULL,
  status outreach_status NOT NULL DEFAULT 'draft',
  variant outreach_variant_type DEFAULT 'direct',
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMPTZ,
  provider_message_id TEXT,
  delivery_error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.outreach 
  ADD COLUMN IF NOT EXISTS variant outreach_variant_type DEFAULT 'direct',
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS provider_message_id TEXT,
  ADD COLUMN IF NOT EXISTS delivery_error TEXT;

-- 7. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  plan_tier TEXT NOT NULL DEFAULT 'growth',
  amount_cents INTEGER NOT NULL DEFAULT 99900,
  currency TEXT NOT NULL DEFAULT 'usd',
  status subscription_status NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  provider TEXT NOT NULL DEFAULT 'paypal',
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  provider_plan_id TEXT,
  amount NUMERIC(10,2) DEFAULT 999.00,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  canceled_at TIMESTAMPTZ,
  last_payment_at TIMESTAMPTZ,
  checkout_key UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscriptions 
  ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'paypal',
  ADD COLUMN IF NOT EXISTS provider_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_plan_id TEXT,
  ADD COLUMN IF NOT EXISTS amount NUMERIC(10,2) DEFAULT 999.00,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_payment_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS checkout_key UUID;

-- 8. Client Onboarding
CREATE TABLE IF NOT EXISTS public.client_onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
  status onboarding_status NOT NULL DEFAULT 'not_started',
  primary_contact_name TEXT,
  primary_contact_phone TEXT,
  service_areas TEXT[] DEFAULT '{}',
  emergency_hours TEXT,
  primary_services TEXT[] DEFAULT '{}',
  google_business_url TEXT,
  booking_software_name TEXT,
  booking_software_connected BOOLEAN NOT NULL DEFAULT FALSE,
  call_tracking_connected BOOLEAN NOT NULL DEFAULT FALSE,
  ninety_day_revenue_goal TEXT,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Email Suppression
CREATE TABLE IF NOT EXISTS public.email_suppression (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL DEFAULT 'unsubscribe',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Analytics Events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Prospects
CREATE TABLE IF NOT EXISTS public.prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  website TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'hvac',
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT 'US',
  email TEXT NOT NULL,
  phone TEXT,
  contact_name TEXT,
  source prospect_source NOT NULL DEFAULT 'manual',
  status pipeline_stage NOT NULL DEFAULT 'discovered',
  lead_score INTEGER DEFAULT 0,
  audit_score INTEGER DEFAULT 0,
  opportunity_score INTEGER DEFAULT 0,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Prospect Research
CREATE TABLE IF NOT EXISTS public.prospect_research (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'website',
  confidence TEXT NOT NULL DEFAULT 'verified',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Follow-Up Sequences
CREATE TABLE IF NOT EXISTS public.follow_up_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL DEFAULT 1,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status follow_up_status NOT NULL DEFAULT 'scheduled',
  subject TEXT NOT NULL,
  message_body TEXT NOT NULL,
  stopped_reason TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Conversations & Inbound Replies
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  incoming_message TEXT NOT NULL,
  classification reply_classification NOT NULL DEFAULT 'unknown',
  classification_confidence NUMERIC(3,2) DEFAULT 0.85,
  suggested_reply TEXT,
  reply_status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Demos & Strategy Calls
CREATE TABLE IF NOT EXISTS public.demos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  demo_script TEXT,
  recommended_plan TEXT DEFAULT 'growth',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Client Diagnostic Proposals
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  plan_tier TEXT NOT NULL DEFAULT 'growth',
  monthly_price INTEGER NOT NULL DEFAULT 999,
  setup_fee INTEGER NOT NULL DEFAULT 0,
  guarantee_days INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Client Leads
CREATE TABLE IF NOT EXISTS public.client_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  service_requested TEXT,
  source TEXT NOT NULL DEFAULT 'website_form',
  status client_lead_status NOT NULL DEFAULT 'new',
  ai_suggested_response TEXT,
  response_time_minutes INTEGER,
  appointment_date TIMESTAMPTZ,
  estimated_job_value INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Revenue Recovery Log
CREATE TABLE IF NOT EXISTS public.recovery_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  client_lead_id UUID REFERENCES public.client_leads(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  age_hours INTEGER NOT NULL DEFAULT 1,
  estimated_opportunity TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  status recovery_status NOT NULL DEFAULT 'detected',
  recovered_value INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. Agency Centralized Settings
CREATE TABLE IF NOT EXISTS public.agency_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_name TEXT NOT NULL DEFAULT 'RevenueRecover AI Agency',
  agency_email TEXT NOT NULL DEFAULT 'admin@revenuerecover.ai',
  outreach_from_email TEXT NOT NULL DEFAULT 'audit@revenuerecover.ai',
  outreach_reply_to TEXT NOT NULL DEFAULT 'team@revenuerecover.ai',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  require_outreach_approval BOOLEAN NOT NULL DEFAULT TRUE,
  enable_auto_follow_ups BOOLEAN NOT NULL DEFAULT TRUE,
  pricing_starter_monthly INTEGER NOT NULL DEFAULT 499,
  pricing_growth_monthly INTEGER NOT NULL DEFAULT 999,
  pricing_revenue_monthly INTEGER NOT NULL DEFAULT 1299,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. Agency Notifications Center
CREATE TABLE IF NOT EXISTS public.agency_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  entity_id TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. Individual Payments / Transactions
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'paypal',
  provider_payment_id TEXT UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'completed',
  payer_email TEXT,
  payer_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. TCPA / SMS Phone Suppression Registry
CREATE TABLE IF NOT EXISTS public.phone_suppression (
  phone VARCHAR(32) PRIMARY KEY,
  reason VARCHAR(64) DEFAULT 'STOP',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. Private PayPal Webhook Events Ledger
CREATE TABLE IF NOT EXISTS private.paypal_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  resource JSONB NOT NULL DEFAULT '{}'::jsonb,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- SECTION 4: PERFORMANCE & INTEGRITY INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_business_type ON public.companies(business_type);

CREATE INDEX IF NOT EXISTS idx_users_company_id ON public.users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

CREATE INDEX IF NOT EXISTS idx_leads_company_id ON public.leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

CREATE INDEX IF NOT EXISTS idx_audits_company_id ON public.audits(company_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON public.audits(audit_status);

CREATE INDEX IF NOT EXISTS idx_audit_issues_audit_id ON public.audit_issues(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_issues_category ON public.audit_issues(category);
CREATE INDEX IF NOT EXISTS idx_audit_issues_severity ON public.audit_issues(severity);

CREATE INDEX IF NOT EXISTS idx_outreach_lead_id ON public.outreach(lead_id);
CREATE INDEX IF NOT EXISTS idx_outreach_status ON public.outreach(status);
CREATE INDEX IF NOT EXISTS idx_outreach_channel ON public.outreach(channel);

CREATE INDEX IF NOT EXISTS idx_subscriptions_company ON public.subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON public.subscriptions(provider);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider_sub_id ON public.subscriptions(provider_subscription_id);

-- Partial Unique Indexes for Idempotency and Duplicate Protection (from 017, 018, 019)
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_company_checkout_key_uq
  ON public.subscriptions (company_id, checkout_key)
  WHERE checkout_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_provider_subscription_id_uq
  ON public.subscriptions (provider_subscription_id)
  WHERE provider_subscription_id IS NOT NULL;

DROP INDEX IF EXISTS public.subscriptions_one_live_paypal_per_company_uq;
CREATE UNIQUE INDEX subscriptions_one_live_paypal_per_company_uq
  ON public.subscriptions (company_id)
  WHERE provider = 'paypal'
    AND status IN (
      'trialing'::public.subscription_status,
      'active'::public.subscription_status,
      'past_due'::public.subscription_status,
      'unpaid'::public.subscription_status
    );

CREATE INDEX IF NOT EXISTS idx_client_onboarding_company ON public.client_onboarding(company_id);
CREATE INDEX IF NOT EXISTS idx_email_suppression_email ON public.email_suppression(email);
CREATE INDEX IF NOT EXISTS idx_phone_suppression_phone ON public.phone_suppression(phone);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prospects_status ON public.prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_website ON public.prospects(website);
CREATE INDEX IF NOT EXISTS idx_prospect_research_prospect ON public.prospect_research(prospect_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_sequences_status ON public.follow_up_sequences(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_conversations_prospect ON public.conversations(prospect_id);
CREATE INDEX IF NOT EXISTS idx_client_leads_company ON public.client_leads(company_id, status);
CREATE INDEX IF NOT EXISTS idx_recovery_opportunities_company ON public.recovery_opportunities(company_id, status);
CREATE INDEX IF NOT EXISTS idx_agency_notifications_read ON public.agency_notifications(is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_company_id ON public.payments(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_payment_id ON public.payments(provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- ==============================================================================
-- SECTION 5: CORE SECURITY & TENANT ISOLATION FUNCTIONS
-- ==============================================================================

-- Admin status verification
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT private.is_admin();
$$;

-- Trusted administrative context verification (checks session_user & service_role claim)
CREATE OR REPLACE FUNCTION private.is_trusted_admin_context()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  jwt_role text;
BEGIN
  IF session_user IN ('postgres', 'supabase_admin') THEN
    RETURN TRUE;
  END IF;

  BEGIN
    jwt_role := current_setting('request.jwt.claim.role', true);
  EXCEPTION WHEN OTHERS THEN
    jwt_role := NULL;
  END;

  IF jwt_role = 'service_role' THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_trusted_admin_context()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT private.is_trusted_admin_context();
$$;

-- Authenticated caller's tenant/company ID lookup
CREATE OR REPLACE FUNCTION private.current_user_company_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT company_id FROM public.users
  WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_user_company_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT private.current_user_company_id();
$$;

-- Revoke anonymous execution; grant to authenticated, service_role, postgres
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, service_role, postgres;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role, postgres;

REVOKE ALL ON FUNCTION private.is_trusted_admin_context() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_trusted_admin_context() TO authenticated, service_role, postgres;

REVOKE ALL ON FUNCTION public.is_trusted_admin_context() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_trusted_admin_context() TO authenticated, service_role, postgres;

REVOKE ALL ON FUNCTION private.current_user_company_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.current_user_company_id() TO authenticated, service_role, postgres;

REVOKE ALL ON FUNCTION public.current_user_company_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_company_id() TO authenticated, service_role, postgres;

-- ==============================================================================
-- SECTION 6: USER INTEGRITY & PRIVILEGE ESCALATION TRIGGERS
-- ==============================================================================

-- Privilege escalation guardrail with support for self-service onboarding (from 014)
CREATE OR REPLACE FUNCTION public.prevent_user_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_onboarding_user text;
  v_onboarding_company text;
BEGIN
  IF private.is_trusted_admin_context() THEN
    RETURN NEW;
  END IF;

  IF private.is_admin() THEN
    RETURN NEW;
  END IF;

  v_onboarding_user := current_setting('app.onboarding_user_id', true);
  v_onboarding_company := current_setting('app.onboarding_company_id', true);

  -- Allow legitimate self-service onboarding transition: viewer -> client + company_id
  IF v_onboarding_user = auth.uid()::text
     AND v_onboarding_company = NEW.company_id::text
     AND OLD.id = auth.uid()
     AND NEW.id = OLD.id
     AND OLD.company_id IS NULL
     AND NEW.company_id IS NOT NULL
     AND OLD.role = 'viewer'
     AND NEW.role = 'client' THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Unauthorized: Only system administrators can modify user roles';
  END IF;

  IF NEW.company_id IS DISTINCT FROM OLD.company_id THEN
    RAISE EXCEPTION 'Unauthorized: Only trusted onboarding or system administrators can change company association';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.prevent_user_privilege_escalation() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prevent_user_privilege_escalation() TO postgres, service_role;

DROP TRIGGER IF EXISTS trg_prevent_user_privilege_escalation ON public.users;
CREATE TRIGGER trg_prevent_user_privilege_escalation
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_user_privilege_escalation();

-- Automatic auth.users profile sync
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'viewer'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = CASE WHEN public.users.name IS NULL OR public.users.name = ''
                  THEN EXCLUDED.name ELSE public.users.name END;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_auth_user() TO postgres, service_role;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- Sync company claim to auth app_meta_data
CREATE OR REPLACE FUNCTION public.sync_user_company_claim()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.company_id IS DISTINCT FROM OLD.company_id THEN
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) ||
                            jsonb_build_object('company_id', NEW.company_id::text)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_user_company_claim() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_user_company_claim() TO postgres, service_role;

DROP TRIGGER IF EXISTS on_user_company_changed ON public.users;
CREATE TRIGGER on_user_company_changed
  AFTER UPDATE OF company_id ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_company_claim();

-- ==============================================================================
-- SECTION 7: ROW LEVEL SECURITY & POLICY HARDENING
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_suppression ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospect_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_suppression ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.paypal_webhook_events ENABLE ROW LEVEL SECURITY;

-- 1. Users
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
CREATE POLICY "Admins can manage all users"
  ON public.users FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 2. Companies
DROP POLICY IF EXISTS "Authenticated users can read companies" ON public.companies;
DROP POLICY IF EXISTS "Users can view own company" ON public.companies;
CREATE POLICY "Users can view own company"
  ON public.companies FOR SELECT
  TO authenticated
  USING (public.is_admin() OR id = public.current_user_company_id());

DROP POLICY IF EXISTS "Admins can manage companies" ON public.companies;
CREATE POLICY "Admins can manage companies"
  ON public.companies FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can update own company" ON public.companies;
CREATE POLICY "Users can update own company"
  ON public.companies FOR UPDATE
  TO authenticated
  USING (public.is_admin() OR id = public.current_user_company_id())
  WITH CHECK (public.is_admin() OR id = public.current_user_company_id());

-- 3. Leads
DROP POLICY IF EXISTS "Authenticated users can read leads" ON public.leads;
DROP POLICY IF EXISTS "Users can view own company leads" ON public.leads;
CREATE POLICY "Users can view own company leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Admins can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Users can manage own company leads" ON public.leads;
CREATE POLICY "Users can manage own company leads"
  ON public.leads FOR ALL
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id())
  WITH CHECK (public.is_admin() OR company_id = public.current_user_company_id());

-- 4. Audits
DROP POLICY IF EXISTS "Anyone can read audits" ON public.audits;
DROP POLICY IF EXISTS "Users can view own company audits" ON public.audits;
CREATE POLICY "Users can view own company audits"
  ON public.audits FOR SELECT
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Admins can manage audits" ON public.audits;
DROP POLICY IF EXISTS "Users can manage own company audits" ON public.audits;
CREATE POLICY "Users can manage own company audits"
  ON public.audits FOR ALL
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id())
  WITH CHECK (public.is_admin() OR company_id = public.current_user_company_id());

-- 5. Audit Issues
DROP POLICY IF EXISTS "Anyone can read audit issues" ON public.audit_issues;
DROP POLICY IF EXISTS "Users can view own company audit issues" ON public.audit_issues;
CREATE POLICY "Users can view own company audit issues"
  ON public.audit_issues FOR SELECT
  TO authenticated
  USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.audits a
      WHERE a.id = audit_id AND a.company_id = public.current_user_company_id()
    )
  );

DROP POLICY IF EXISTS "Admins can manage audit issues" ON public.audit_issues;
DROP POLICY IF EXISTS "Users can manage own company audit issues" ON public.audit_issues;
CREATE POLICY "Users can manage own company audit issues"
  ON public.audit_issues FOR ALL
  TO authenticated
  USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.audits a
      WHERE a.id = audit_id AND a.company_id = public.current_user_company_id()
    )
  )
  WITH CHECK (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.audits a
      WHERE a.id = audit_id AND a.company_id = public.current_user_company_id()
    )
  );

-- 6. Outreach
DROP POLICY IF EXISTS "Users can view own company outreach" ON public.outreach;
CREATE POLICY "Users can view own company outreach"
  ON public.outreach FOR SELECT
  TO authenticated
  USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_id AND l.company_id = public.current_user_company_id()
    )
  );

DROP POLICY IF EXISTS "Admins can manage outreach" ON public.outreach;
DROP POLICY IF EXISTS "Users can manage own company outreach" ON public.outreach;
CREATE POLICY "Users can manage own company outreach"
  ON public.outreach FOR ALL
  TO authenticated
  USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_id AND l.company_id = public.current_user_company_id()
    )
  )
  WITH CHECK (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_id AND l.company_id = public.current_user_company_id()
    )
  );

-- 7. Subscriptions
DROP POLICY IF EXISTS "Authenticated users can read subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Admins can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 8. Client Onboarding
DROP POLICY IF EXISTS "Authenticated users can read onboarding" ON public.client_onboarding;
DROP POLICY IF EXISTS "Users can view own onboarding" ON public.client_onboarding;
CREATE POLICY "Users can view own onboarding"
  ON public.client_onboarding FOR SELECT
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Users can update own onboarding" ON public.client_onboarding;
CREATE POLICY "Users can update own onboarding"
  ON public.client_onboarding FOR UPDATE
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id())
  WITH CHECK (public.is_admin() OR company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Admins can manage onboarding" ON public.client_onboarding;
CREATE POLICY "Admins can manage onboarding"
  ON public.client_onboarding FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 9. Payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
CREATE POLICY "Admins can manage payments"
  ON public.payments FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 10. Client Leads
DROP POLICY IF EXISTS "Admins have full access to client leads" ON public.client_leads;
DROP POLICY IF EXISTS "Users can view own client leads" ON public.client_leads;
CREATE POLICY "Users can view own client leads"
  ON public.client_leads FOR SELECT
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Users can manage own client leads" ON public.client_leads;
CREATE POLICY "Users can manage own client leads"
  ON public.client_leads FOR ALL
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id())
  WITH CHECK (public.is_admin() OR company_id = public.current_user_company_id());

-- 11. Recovery Opportunities
DROP POLICY IF EXISTS "Admins have full access to recovery opportunities" ON public.recovery_opportunities;
DROP POLICY IF EXISTS "Users can view own recovery opportunities" ON public.recovery_opportunities;
CREATE POLICY "Users can view own recovery opportunities"
  ON public.recovery_opportunities FOR SELECT
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id());

DROP POLICY IF EXISTS "Users can manage own recovery opportunities" ON public.recovery_opportunities;
CREATE POLICY "Users can manage own recovery opportunities"
  ON public.recovery_opportunities FOR ALL
  TO authenticated
  USING (public.is_admin() OR company_id = public.current_user_company_id())
  WITH CHECK (public.is_admin() OR company_id = public.current_user_company_id());

-- 12. Agency / Operating System Tables (Admin Only)
DROP POLICY IF EXISTS "Admins have full access to prospects" ON public.prospects;
CREATE POLICY "Admins have full access to prospects"
  ON public.prospects FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to research" ON public.prospect_research;
CREATE POLICY "Admins have full access to research"
  ON public.prospect_research FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to follow ups" ON public.follow_up_sequences;
CREATE POLICY "Admins have full access to follow ups"
  ON public.follow_up_sequences FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to conversations" ON public.conversations;
CREATE POLICY "Admins have full access to conversations"
  ON public.conversations FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to demos" ON public.demos;
CREATE POLICY "Admins have full access to demos"
  ON public.demos FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to proposals" ON public.proposals;
CREATE POLICY "Admins have full access to proposals"
  ON public.proposals FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to agency settings" ON public.agency_settings;
CREATE POLICY "Admins have full access to agency settings"
  ON public.agency_settings FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to agency notifications" ON public.agency_notifications;
CREATE POLICY "Admins have full access to agency notifications"
  ON public.agency_notifications FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage suppression" ON public.email_suppression;
CREATE POLICY "Admins can manage suppression"
  ON public.email_suppression FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read analytics" ON public.analytics_events;
CREATE POLICY "Admins can read analytics"
  ON public.analytics_events FOR ALL
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to phone suppression" ON public.phone_suppression;
CREATE POLICY "Admins have full access to phone suppression"
  ON public.phone_suppression FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 13. Private PayPal Webhook Events (Defense-in-depth deny policy from 021)
DROP POLICY IF EXISTS deny_direct_browser_access ON private.paypal_webhook_events;
CREATE POLICY deny_direct_browser_access
  ON private.paypal_webhook_events
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- ==============================================================================
-- SECTION 8: SANITIZED PUBLIC AUDIT REPORTS VIEW
-- ==============================================================================

CREATE OR REPLACE VIEW public.public_audit_reports
WITH (security_invoker = true, security_barrier = true)
AS
  SELECT
    a.id,
    c.name AS company_name,
    c.website AS website_url,
    a.audit_status,
    a.overall_score,
    a.seo_score,
    a.conversion_score,
    a.website_score,
    a.trust_score,
    a.lead_capture_score,
    a.local_presence_score,
    a.revenue_opportunity_score,
    a.executive_summary,
    a.estimated_opportunity,
    a.created_at,
    a.completed_at
  FROM public.audits a
  JOIN public.companies c ON c.id = a.company_id
  WHERE a.audit_status = 'completed';

-- Granted to authenticated users only; anonymous access is strictly revoked
REVOKE ALL ON public.public_audit_reports FROM anon, public;
GRANT SELECT ON public.public_audit_reports TO authenticated;

-- ==============================================================================
-- SECTION 9: RAW TABLE PRIVILEGES & ANONYMOUS ACCESS RESTRICTIONS
-- ==============================================================================

REVOKE INSERT, UPDATE, DELETE, SELECT ON public.users FROM anon, public;
REVOKE INSERT, UPDATE, DELETE, SELECT ON public.companies FROM anon, public;
REVOKE INSERT, UPDATE, DELETE, SELECT ON public.leads FROM anon, public;
REVOKE INSERT, UPDATE, DELETE, SELECT ON public.audits FROM anon, public;
REVOKE INSERT, UPDATE, DELETE, SELECT ON public.audit_issues FROM anon, public;
REVOKE INSERT, UPDATE, DELETE, SELECT ON public.outreach FROM anon, public;

REVOKE ALL ON TABLE private.paypal_webhook_events FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE private.paypal_webhook_events TO postgres, service_role;

GRANT SELECT ON public.users TO authenticated;
GRANT SELECT, UPDATE ON public.companies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_issues TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outreach TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT SELECT, UPDATE ON public.client_onboarding TO authenticated;
GRANT SELECT ON public.payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_leads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recovery_opportunities TO authenticated;

-- ==============================================================================
-- SECTION 10: SELF-SERVICE ONBOARDING RPCS (From Migrations 014 & 015)
-- ==============================================================================

CREATE OR REPLACE FUNCTION private.complete_client_onboarding(
  p_company_name text,
  p_website text,
  p_business_type public.business_type DEFAULT 'hvac_plumbing',
  p_city text DEFAULT '',
  p_state text DEFAULT '',
  p_phone text DEFAULT NULL,
  p_email text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_profile public.users%ROWTYPE;
  v_company_id uuid;
  v_name text := btrim(coalesce(p_company_name, ''));
  v_website text := btrim(coalesce(p_website, ''));
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;

  IF length(v_name) < 2 OR length(v_name) > 160 THEN
    RAISE EXCEPTION 'Company name must be between 2 and 160 characters' USING ERRCODE = '22023';
  END IF;

  IF v_website !~* '^https?://[^[:space:]]+$' OR length(v_website) > 2048 THEN
    RAISE EXCEPTION 'Enter a valid website URL starting with http:// or https://' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_profile FROM public.users WHERE id = v_user_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile is not ready yet; please retry shortly' USING ERRCODE = 'P0002';
  END IF;

  IF v_profile.company_id IS NOT NULL THEN
    UPDATE public.companies
    SET name = v_name,
        website = v_website,
        business_type = coalesce(p_business_type, 'other'::public.business_type),
        city = btrim(coalesce(p_city, '')),
        state = btrim(coalesce(p_state, '')),
        phone = nullif(btrim(coalesce(p_phone, '')), ''),
        email = nullif(btrim(coalesce(p_email, '')), ''),
        updated_at = now()
    WHERE id = v_profile.company_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Assigned company was not found' USING ERRCODE = 'P0002';
    END IF;
    RETURN v_profile.company_id;
  END IF;

  IF v_profile.role <> 'viewer' THEN
    RAISE EXCEPTION 'This account must be assigned by an administrator' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.companies (
    name, website, business_type, city, state, country, phone, email, status, client_status
  )
  VALUES (
    v_name, v_website, coalesce(p_business_type, 'other'::public.business_type),
    btrim(coalesce(p_city, '')), btrim(coalesce(p_state, '')), 'US',
    nullif(btrim(coalesce(p_phone, '')), ''),
    nullif(btrim(coalesce(p_email, '')), ''),
    'client'::public.company_status, 'onboarding'
  )
  RETURNING id INTO v_company_id;

  PERFORM set_config('app.onboarding_user_id', v_user_id::text, true);
  PERFORM set_config('app.onboarding_company_id', v_company_id::text, true);

  UPDATE public.users
  SET company_id = v_company_id, role = 'client'
  WHERE id = v_user_id AND company_id IS NULL AND role = 'viewer';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Company assignment failed; please retry' USING ERRCODE = '40001';
  END IF;

  RETURN v_company_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.complete_client_onboarding(
  p_company_name text,
  p_website text,
  p_business_type public.business_type DEFAULT 'hvac_plumbing',
  p_city text DEFAULT '',
  p_state text DEFAULT '',
  p_phone text DEFAULT NULL,
  p_email text DEFAULT NULL
)
RETURNS uuid
LANGUAGE sql
SECURITY INVOKER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT private.complete_client_onboarding(
    p_company_name, p_website, p_business_type, p_city, p_state, p_phone, p_email
  );
$function$;

REVOKE ALL ON FUNCTION private.complete_client_onboarding(text, text, public.business_type, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.complete_client_onboarding(text, text, public.business_type, text, text, text, text) TO authenticated, service_role, postgres;

REVOKE ALL ON FUNCTION public.complete_client_onboarding(text, text, public.business_type, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_client_onboarding(text, text, public.business_type, text, text, text, text) TO authenticated, service_role, postgres;

CREATE OR REPLACE FUNCTION private.save_client_onboarding_details(
  p_primary_contact_phone text DEFAULT NULL,
  p_service_areas text[] DEFAULT ARRAY[]::text[],
  p_emergency_hours text DEFAULT NULL,
  p_primary_services text[] DEFAULT ARRAY[]::text[],
  p_booking_software_name text DEFAULT NULL,
  p_ninety_day_revenue_goal text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_company_id uuid;
  v_record_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;

  v_company_id := private.current_user_company_id();
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'Complete company registration before saving onboarding details' USING ERRCODE = '42501';
  END IF;

  IF length(coalesce(p_emergency_hours, '')) > 160
     OR length(coalesce(p_booking_software_name, '')) > 120
     OR length(coalesce(p_ninety_day_revenue_goal, '')) > 500 THEN
    RAISE EXCEPTION 'An onboarding field is too long' USING ERRCODE = '22023';
  END IF;

  UPDATE public.client_onboarding
  SET primary_contact_phone = nullif(btrim(coalesce(p_primary_contact_phone, '')), ''),
      service_areas = coalesce(p_service_areas, ARRAY[]::text[]),
      emergency_hours = nullif(btrim(coalesce(p_emergency_hours, '')), ''),
      primary_services = coalesce(p_primary_services, ARRAY[]::text[]),
      booking_software_name = nullif(btrim(coalesce(p_booking_software_name, '')), ''),
      booking_software_connected = false,
      call_tracking_connected = false,
      ninety_day_revenue_goal = nullif(btrim(coalesce(p_ninety_day_revenue_goal, '')), ''),
      status = 'in_progress'::public.onboarding_status,
      updated_at = now()
  WHERE company_id = v_company_id
  RETURNING id INTO v_record_id;

  IF v_record_id IS NULL THEN
    INSERT INTO public.client_onboarding (
      company_id, status, primary_contact_phone, service_areas, emergency_hours,
      primary_services, booking_software_name, booking_software_connected,
      call_tracking_connected, ninety_day_revenue_goal, updated_at
    ) VALUES (
      v_company_id, 'in_progress'::public.onboarding_status,
      nullif(btrim(coalesce(p_primary_contact_phone, '')), ''),
      coalesce(p_service_areas, ARRAY[]::text[]),
      nullif(btrim(coalesce(p_emergency_hours, '')), ''),
      coalesce(p_primary_services, ARRAY[]::text[]),
      nullif(btrim(coalesce(p_booking_software_name, '')), ''),
      false, false, nullif(btrim(coalesce(p_ninety_day_revenue_goal, '')), ''), now()
    ) RETURNING id INTO v_record_id;
  END IF;

  RETURN v_record_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.save_client_onboarding_details(
  p_primary_contact_phone text DEFAULT NULL,
  p_service_areas text[] DEFAULT ARRAY[]::text[],
  p_emergency_hours text DEFAULT NULL,
  p_primary_services text[] DEFAULT ARRAY[]::text[],
  p_booking_software_name text DEFAULT NULL,
  p_ninety_day_revenue_goal text DEFAULT NULL
)
RETURNS uuid
LANGUAGE sql
SECURITY INVOKER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT private.save_client_onboarding_details(
    p_primary_contact_phone, p_service_areas, p_emergency_hours,
    p_primary_services, p_booking_software_name, p_ninety_day_revenue_goal
  );
$function$;

REVOKE ALL ON FUNCTION private.save_client_onboarding_details(text, text[], text, text[], text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.save_client_onboarding_details(text, text[], text, text[], text, text) TO authenticated, service_role, postgres;

REVOKE ALL ON FUNCTION public.save_client_onboarding_details(text, text[], text, text[], text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_client_onboarding_details(text, text[], text, text[], text, text) TO authenticated, service_role, postgres;

-- ==============================================================================
-- SECTION 11: PAYPAL RECURRING SUBSCRIPTIONS RPCS (From Migrations 017, 018, 019)
-- ==============================================================================

-- 1. Get Plan Quote (with guardrails from 019)
CREATE OR REPLACE FUNCTION private.get_paypal_plan_quote(p_plan_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_amount numeric;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;

  IF p_plan_key IS NULL OR p_plan_key NOT IN ('starter', 'growth', 'revenue_partner') THEN
    RAISE EXCEPTION 'Invalid subscription plan' USING ERRCODE = '22023';
  END IF;

  SELECT CASE p_plan_key
    WHEN 'starter' THEN s.pricing_starter_monthly
    WHEN 'growth' THEN s.pricing_growth_monthly
    WHEN 'revenue_partner' THEN s.pricing_revenue_monthly
  END
  INTO v_amount
  FROM public.agency_settings s
  ORDER BY s.updated_at DESC
  LIMIT 1;

  IF v_amount IS NULL THEN
    v_amount := CASE p_plan_key
      WHEN 'starter' THEN 499
      WHEN 'growth' THEN 999
      WHEN 'revenue_partner' THEN 1299
    END;
  END IF;

  IF v_amount <= 0 THEN
    RAISE EXCEPTION 'Subscription plan is not configured' USING ERRCODE = '22023';
  END IF;

  RETURN jsonb_build_object(
    'plan_key', p_plan_key,
    'amount', v_amount,
    'currency', 'USD',
    'interval_unit', 'MONTH',
    'interval_count', 1
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_paypal_plan_quote(p_plan_key text)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $function$
  SELECT private.get_paypal_plan_quote(p_plan_key);
$function$;

-- 2. Prepare Checkout (with duplicate prevention & guardrails from 018 & 019)
CREATE OR REPLACE FUNCTION private.prepare_paypal_checkout(
  p_plan_key text,
  p_checkout_key uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_company_id uuid;
  v_amount numeric;
  v_subscription_id uuid;
  v_provider_subscription_id text;
  v_provider_plan_id text;
  v_status public.subscription_status;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;
  IF p_checkout_key IS NULL THEN
    RAISE EXCEPTION 'Checkout idempotency key is required' USING ERRCODE = '22023';
  END IF;
  IF p_plan_key IS NULL OR p_plan_key NOT IN ('starter', 'growth', 'revenue_partner') THEN
    RAISE EXCEPTION 'Invalid subscription plan' USING ERRCODE = '22023';
  END IF;

  v_company_id := private.current_user_company_id();
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'Complete company onboarding before selecting a subscription' USING ERRCODE = '42501';
  END IF;

  SELECT CASE p_plan_key
    WHEN 'starter' THEN s.pricing_starter_monthly
    WHEN 'growth' THEN s.pricing_growth_monthly
    WHEN 'revenue_partner' THEN s.pricing_revenue_monthly
  END
  INTO v_amount
  FROM public.agency_settings s
  ORDER BY s.updated_at DESC
  LIMIT 1;

  IF v_amount IS NULL THEN
    v_amount := CASE p_plan_key
      WHEN 'starter' THEN 499
      WHEN 'growth' THEN 999
      WHEN 'revenue_partner' THEN 1299
    END;
  END IF;

  IF v_amount <= 0 THEN
    RAISE EXCEPTION 'Subscription plan is not configured' USING ERRCODE = '22023';
  END IF;

  -- Prevent duplicate active/unpaid PayPal subscription for company
  IF EXISTS (
    SELECT 1
    FROM public.subscriptions s
    WHERE s.company_id = v_company_id
      AND s.provider = 'paypal'
      AND s.status IN (
        'trialing'::public.subscription_status,
        'active'::public.subscription_status,
        'past_due'::public.subscription_status,
        'unpaid'::public.subscription_status
      )
      AND s.checkout_key IS DISTINCT FROM p_checkout_key
  ) THEN
    RAISE EXCEPTION 'A PayPal subscription already exists for this company' USING ERRCODE = '23505';
  END IF;

  -- Reject concurrent checkouts within 30 minutes
  IF EXISTS (
    SELECT 1
    FROM public.subscriptions s
    WHERE s.company_id = v_company_id
      AND s.provider = 'paypal'
      AND s.status = 'inactive'::public.subscription_status
      AND s.checkout_key IS DISTINCT FROM p_checkout_key
      AND s.updated_at > now() - interval '30 minutes'
  ) THEN
    RAISE EXCEPTION 'A recent PayPal checkout is already pending for this company' USING ERRCODE = '23505';
  END IF;

  INSERT INTO public.subscriptions AS target (
    company_id, provider, plan_tier, amount, amount_cents, currency,
    status, checkout_key, updated_at
  )
  VALUES (
    v_company_id, 'paypal', p_plan_key, v_amount, round(v_amount * 100)::integer,
    'usd', 'inactive'::public.subscription_status, p_checkout_key, now()
  )
  ON CONFLICT (company_id, checkout_key) WHERE checkout_key IS NOT NULL
  DO UPDATE SET updated_at = now()
    WHERE target.plan_tier = EXCLUDED.plan_tier
      AND target.amount = EXCLUDED.amount
      AND target.provider = 'paypal'
  RETURNING target.id, target.provider_subscription_id, target.provider_plan_id, target.status
  INTO v_subscription_id, v_provider_subscription_id, v_provider_plan_id, v_status;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Checkout key has already been used for a different plan' USING ERRCODE = '22023';
  END IF;

  RETURN jsonb_build_object(
    'subscription_id', v_subscription_id,
    'company_id', v_company_id,
    'plan_key', p_plan_key,
    'amount', v_amount,
    'currency', 'USD',
    'provider_subscription_id', v_provider_subscription_id,
    'provider_plan_id', v_provider_plan_id,
    'status', v_status::text
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.prepare_paypal_checkout(p_plan_key text, p_checkout_key uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $function$
  SELECT private.prepare_paypal_checkout(p_plan_key, p_checkout_key);
$function$;

-- 3. Link Subscription
CREATE OR REPLACE FUNCTION private.link_paypal_subscription(
  p_subscription_id uuid,
  p_checkout_key uuid,
  p_company_id uuid,
  p_provider_subscription_id text,
  p_provider_plan_id text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF p_subscription_id IS NULL OR p_checkout_key IS NULL OR p_company_id IS NULL
     OR nullif(btrim(p_provider_subscription_id), '') IS NULL
     OR nullif(btrim(p_provider_plan_id), '') IS NULL THEN
    RAISE EXCEPTION 'PayPal subscription linking requires complete identifiers' USING ERRCODE = '22023';
  END IF;

  UPDATE public.subscriptions
  SET provider_subscription_id = p_provider_subscription_id,
      provider_plan_id = p_provider_plan_id,
      updated_at = now()
  WHERE id = p_subscription_id
    AND checkout_key = p_checkout_key
    AND company_id = p_company_id
    AND provider = 'paypal'
    AND plan_tier IN ('starter', 'growth', 'revenue_partner')
    AND (provider_subscription_id IS NULL OR provider_subscription_id = p_provider_subscription_id)
    AND (provider_plan_id IS NULL OR provider_plan_id = p_provider_plan_id);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Could not safely link PayPal subscription to the pending checkout' USING ERRCODE = '42501';
  END IF;
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.link_paypal_subscription(
  p_subscription_id uuid,
  p_checkout_key uuid,
  p_company_id uuid,
  p_provider_subscription_id text,
  p_provider_plan_id text
)
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $function$
  SELECT private.link_paypal_subscription(
    p_subscription_id, p_checkout_key, p_company_id,
    p_provider_subscription_id, p_provider_plan_id
  );
$function$;

-- 4. Cancel Subscription (from 018 & 019)
CREATE OR REPLACE FUNCTION private.cancel_paypal_subscription(
  p_subscription_id uuid,
  p_company_id uuid,
  p_provider_subscription_id text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF p_subscription_id IS NULL OR p_company_id IS NULL
     OR nullif(btrim(p_provider_subscription_id), '') IS NULL THEN
    RAISE EXCEPTION 'PayPal subscription identifiers are required' USING ERRCODE = '22023';
  END IF;

  UPDATE public.subscriptions
  SET status = 'canceled'::public.subscription_status,
      canceled_at = coalesce(canceled_at, now()),
      cancel_at_period_end = false,
      updated_at = now()
  WHERE id = p_subscription_id
    AND company_id = p_company_id
    AND provider = 'paypal'
    AND provider_subscription_id = p_provider_subscription_id
    AND status IN (
      'inactive'::public.subscription_status,
      'trialing'::public.subscription_status,
      'active'::public.subscription_status,
      'past_due'::public.subscription_status,
      'unpaid'::public.subscription_status,
      'canceled'::public.subscription_status
    );

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Could not confirm the subscription belongs to this company' USING ERRCODE = '42501';
  END IF;
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cancel_paypal_subscription(
  p_subscription_id uuid,
  p_company_id uuid,
  p_provider_subscription_id text
)
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $function$
  SELECT private.cancel_paypal_subscription(
    p_subscription_id, p_company_id, p_provider_subscription_id
  );
$function$;

-- 5. Process Webhook Event (from 017)
CREATE OR REPLACE FUNCTION private.process_paypal_webhook_event(
  p_event_id text,
  p_event_type text,
  p_resource jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_rows integer;
  v_external_subscription_id text;
  v_internal_subscription_id uuid;
  v_subscription_id uuid;
  v_company_id uuid;
  v_payment_id text;
  v_amount numeric;
  v_currency text;
  v_status public.subscription_status;
BEGIN
  IF nullif(btrim(p_event_id), '') IS NULL OR length(p_event_id) > 150
     OR nullif(btrim(p_event_type), '') IS NULL OR length(p_event_type) > 150
     OR p_resource IS NULL OR jsonb_typeof(p_resource) <> 'object' THEN
    RAISE EXCEPTION 'Invalid PayPal webhook event' USING ERRCODE = '22023';
  END IF;

  INSERT INTO private.paypal_webhook_events (event_id, event_type, resource)
  VALUES (p_event_id, p_event_type, p_resource)
  ON CONFLICT (event_id) DO NOTHING;
  GET DIAGNOSTICS v_rows = ROW_COUNT;

  IF v_rows = 0 THEN
    RETURN jsonb_build_object('duplicate', true, 'processed', false);
  END IF;

  v_external_subscription_id := nullif(p_resource ->> 'id', '');
  IF length(coalesce(p_resource ->> 'custom_id', '')) <= 36
     AND coalesce(p_resource ->> 'custom_id', '') ~* '^[0-9a-f-]{36}$' THEN
    v_internal_subscription_id := (p_resource ->> 'custom_id')::uuid;
  END IF;

  IF p_event_type IN (
    'BILLING.SUBSCRIPTION.CREATED',
    'BILLING.SUBSCRIPTION.ACTIVATED',
    'BILLING.SUBSCRIPTION.UPDATED',
    'BILLING.SUBSCRIPTION.RE-ACTIVATED',
    'BILLING.SUBSCRIPTION.CANCELLED',
    'BILLING.SUBSCRIPTION.EXPIRED',
    'BILLING.SUBSCRIPTION.SUSPENDED',
    'BILLING.SUBSCRIPTION.PAYMENT.FAILED'
  ) THEN
    v_status := CASE p_event_type
      WHEN 'BILLING.SUBSCRIPTION.ACTIVATED' THEN 'active'::public.subscription_status
      WHEN 'BILLING.SUBSCRIPTION.RE-ACTIVATED' THEN 'active'::public.subscription_status
      WHEN 'BILLING.SUBSCRIPTION.CANCELLED' THEN 'canceled'::public.subscription_status
      WHEN 'BILLING.SUBSCRIPTION.EXPIRED' THEN 'canceled'::public.subscription_status
      WHEN 'BILLING.SUBSCRIPTION.SUSPENDED' THEN 'past_due'::public.subscription_status
      WHEN 'BILLING.SUBSCRIPTION.PAYMENT.FAILED' THEN 'past_due'::public.subscription_status
      WHEN 'BILLING.SUBSCRIPTION.UPDATED' THEN CASE p_resource ->> 'status'
        WHEN 'ACTIVE' THEN 'active'::public.subscription_status
        WHEN 'SUSPENDED' THEN 'past_due'::public.subscription_status
        WHEN 'CANCELLED' THEN 'canceled'::public.subscription_status
        WHEN 'EXPIRED' THEN 'canceled'::public.subscription_status
        ELSE NULL
      END
      ELSE 'inactive'::public.subscription_status
    END;

    UPDATE public.subscriptions
    SET provider_subscription_id = coalesce(provider_subscription_id, v_external_subscription_id),
        provider_plan_id = coalesce(nullif(p_resource ->> 'plan_id', ''), provider_plan_id),
        status = coalesce(v_status, status),
        canceled_at = CASE WHEN p_event_type IN ('BILLING.SUBSCRIPTION.CANCELLED','BILLING.SUBSCRIPTION.EXPIRED')
                           THEN coalesce(canceled_at, now()) ELSE canceled_at END,
        updated_at = now()
    WHERE provider = 'paypal'
      AND (
        provider_subscription_id = v_external_subscription_id
        OR (
          v_internal_subscription_id IS NOT NULL
          AND id = v_internal_subscription_id
          AND provider_subscription_id IS NULL
        )
      )
    RETURNING id, company_id INTO v_subscription_id, v_company_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'No matching pending PayPal subscription was found' USING ERRCODE = 'P0002';
    END IF;

  ELSIF p_event_type = 'PAYMENT.SALE.COMPLETED' THEN
    v_external_subscription_id := nullif(p_resource ->> 'billing_agreement_id', '');
    v_payment_id := nullif(p_resource ->> 'id', '');
    BEGIN
      v_amount := nullif(p_resource #>> '{amount,total}', '')::numeric;
    EXCEPTION WHEN invalid_text_representation THEN
      RAISE EXCEPTION 'PayPal sale amount is invalid' USING ERRCODE = '22023';
    END;
    v_currency := upper(coalesce(p_resource #>> '{amount,currency}', ''));

    IF v_external_subscription_id IS NULL OR v_payment_id IS NULL
       OR v_amount IS NULL OR v_amount <= 0 OR v_currency <> 'USD' THEN
      RAISE EXCEPTION 'PayPal sale is missing required subscription/payment details' USING ERRCODE = '22023';
    END IF;

    SELECT id, company_id INTO v_subscription_id, v_company_id
    FROM public.subscriptions
    WHERE provider = 'paypal'
      AND provider_subscription_id = v_external_subscription_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'No matching PayPal subscription found for payment' USING ERRCODE = 'P0002';
    END IF;

    INSERT INTO public.payments (
      company_id, subscription_id, provider, provider_payment_id, amount, currency,
      status, payer_email, payer_name, metadata
    )
    VALUES (
      v_company_id, v_subscription_id, 'paypal', v_payment_id, v_amount, v_currency,
      'completed',
      nullif(p_resource #>> '{payer_info,email}', ''),
      nullif(concat_ws(' ', p_resource #>> '{payer_info,first_name}', p_resource #>> '{payer_info,last_name}'), ''),
      jsonb_build_object('event_type', p_event_type, 'resource', p_resource)
    )
    ON CONFLICT (provider_payment_id) DO NOTHING;

    UPDATE public.subscriptions
    SET status = 'active'::public.subscription_status,
        last_payment_at = now(),
        updated_at = now()
    WHERE id = v_subscription_id;

  ELSIF p_event_type = 'PAYMENT.SALE.REFUNDED' THEN
    v_payment_id := nullif(p_resource ->> 'sale_id', '');
    IF v_payment_id IS NOT NULL THEN
      UPDATE public.payments
      SET status = 'refunded',
          metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('refund_event_id', p_event_id, 'refund_resource', p_resource)
      WHERE provider = 'paypal' AND provider_payment_id = v_payment_id;
    END IF;

  ELSIF p_event_type = 'PAYMENT.SALE.REVERSED' THEN
    v_payment_id := nullif(p_resource ->> 'id', '');
    IF v_payment_id IS NOT NULL THEN
      UPDATE public.payments
      SET status = 'reversed',
          metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('reversal_event_id', p_event_id, 'reversal_resource', p_resource)
      WHERE provider = 'paypal' AND provider_payment_id = v_payment_id;
    END IF;
  END IF;

  UPDATE private.paypal_webhook_events
  SET processed_at = now()
  WHERE event_id = p_event_id;

  RETURN jsonb_build_object('duplicate', false, 'processed', true, 'event_type', p_event_type);
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_paypal_webhook_event(
  p_event_id text,
  p_event_type text,
  p_resource jsonb
)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $function$
  SELECT private.process_paypal_webhook_event(p_event_id, p_event_type, p_resource);
$function$;

-- Permissions for PayPal RPCs
REVOKE ALL ON FUNCTION private.get_paypal_plan_quote(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.prepare_paypal_checkout(text, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.link_paypal_subscription(uuid, uuid, uuid, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.cancel_paypal_subscription(uuid, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.process_paypal_webhook_event(text, text, jsonb) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.get_paypal_plan_quote(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.prepare_paypal_checkout(text, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.link_paypal_subscription(uuid, uuid, uuid, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancel_paypal_subscription(uuid, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.process_paypal_webhook_event(text, text, jsonb) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION private.get_paypal_plan_quote(text) TO authenticated;
GRANT EXECUTE ON FUNCTION private.prepare_paypal_checkout(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.link_paypal_subscription(uuid, uuid, uuid, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION private.cancel_paypal_subscription(uuid, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION private.process_paypal_webhook_event(text, text, jsonb) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_paypal_plan_quote(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.prepare_paypal_checkout(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_paypal_subscription(uuid, uuid, uuid, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_paypal_subscription(uuid, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.process_paypal_webhook_event(text, text, jsonb) TO service_role;

-- ==============================================================================
-- SECTION 12: RELOAD POSTGREST SCHEMA CACHE
-- ==============================================================================
NOTIFY pgrst, 'reload schema';
