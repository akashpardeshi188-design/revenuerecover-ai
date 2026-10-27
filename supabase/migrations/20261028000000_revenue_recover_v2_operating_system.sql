-- RevenueRecover AI V2: six-module growth operating system.
-- Safe additive migration. Existing tables and billing are left intact.

CREATE TABLE IF NOT EXISTS public.v2_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  business_name text NOT NULL,
  owner_name text,
  phone text NOT NULL,
  website text,
  city text NOT NULL,
  state text NOT NULL CHECK (state IN ('TX','FL')),
  industry text NOT NULL CHECK (industry IN ('hvac','plumbing')),
  source text NOT NULL CHECK (source IN ('google_places','yelp')),
  review_count integer NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  rating numeric(3,2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  estimated_missed_calls numeric(10,2) NOT NULL DEFAULT 0,
  estimated_lost_revenue numeric(12,2) NOT NULL DEFAULT 0,
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  score_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb,
  lifecycle_stage text NOT NULL DEFAULT 'new_lead',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS v2_leads_state_city_idx ON public.v2_leads(state, city);
CREATE INDEX IF NOT EXISTS v2_leads_score_idx ON public.v2_leads(score DESC);
CREATE UNIQUE INDEX IF NOT EXISTS v2_leads_phone_unique_idx ON public.v2_leads(phone);

CREATE TABLE IF NOT EXISTS public.v2_outreach_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.v2_leads(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('email','sms')),
  sequence_day integer NOT NULL,
  consent_recorded boolean NOT NULL DEFAULT false,
  sent_at timestamptz,
  replied_at timestamptz,
  opted_out_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.v2_recovery_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES public.v2_leads(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('missed_call','text_back','customer_reply','appointment_booked','revenue_recovered')),
  modeled_value numeric(12,2) NOT NULL DEFAULT 0,
  actual_value numeric(12,2),
  external_id text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.v2_onboarding_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  task_key text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','complete','blocked')),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, task_key)
);

CREATE TABLE IF NOT EXISTS public.v2_retention_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  signal_type text NOT NULL CHECK (signal_type IN ('no_recovery_7d','inactive_5d','high_stop_rate','upsell')),
  action text NOT NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.v2_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_outreach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_recovery_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_retention_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS v2_leads_member_select ON public.v2_leads;
CREATE POLICY v2_leads_member_select ON public.v2_leads FOR SELECT TO authenticated
USING (organization_id IS NULL OR EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = v2_leads.organization_id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS v2_outreach_member_select ON public.v2_outreach_events;
CREATE POLICY v2_outreach_member_select ON public.v2_outreach_events FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.v2_leads l JOIN public.organization_members m ON m.organization_id = l.organization_id WHERE l.id = v2_outreach_events.lead_id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS v2_recovery_member_select ON public.v2_recovery_events;
CREATE POLICY v2_recovery_member_select ON public.v2_recovery_events FOR SELECT TO authenticated
USING (organization_id IS NULL OR EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = v2_recovery_events.organization_id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS v2_onboarding_member_select ON public.v2_onboarding_tasks;
CREATE POLICY v2_onboarding_member_select ON public.v2_onboarding_tasks FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = v2_onboarding_tasks.organization_id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS v2_retention_member_select ON public.v2_retention_signals;
CREATE POLICY v2_retention_member_select ON public.v2_retention_signals FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = v2_retention_signals.organization_id AND m.user_id = auth.uid()));

REVOKE ALL ON public.v2_leads, public.v2_outreach_events, public.v2_recovery_events, public.v2_onboarding_tasks, public.v2_retention_signals FROM anon;
NOTIFY pgrst, 'reload schema';
