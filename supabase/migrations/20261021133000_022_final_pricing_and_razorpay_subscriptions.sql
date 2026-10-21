-- ==============================================================================
-- RevenueRecover AI STAGING: Migration 022
-- Canonical Pricing ($999 Growth, $1,299 Revenue Partner) & Razorpay Subscriptions
-- Enforces cross-gateway single-active-subscription per company.
-- ==============================================================================

-- 1. Update agency_settings defaults if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agency_settings') THEN
    UPDATE public.agency_settings
    SET pricing_growth_monthly = 999,
        pricing_revenue_monthly = 1299,
        updated_at = now();
  END IF;
END $$;

-- 2. Prevent duplicate live subscriptions across ALL gateways for a company
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_one_live_subscription_per_company_uq
  ON public.subscriptions (company_id)
  WHERE status IN (
    'trialing'::public.subscription_status,
    'active'::public.subscription_status,
    'past_due'::public.subscription_status
  );

-- 3. Razorpay webhook events ledger for idempotent persistence
CREATE TABLE IF NOT EXISTS private.razorpay_webhook_events (
  event_id text PRIMARY KEY,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE private.razorpay_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS deny_direct_browser_access ON private.razorpay_webhook_events;
CREATE POLICY deny_direct_browser_access ON private.razorpay_webhook_events
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

REVOKE ALL ON TABLE private.razorpay_webhook_events FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE private.razorpay_webhook_events TO postgres, service_role;

-- 4. Authoritative plan quote functions with final pricing ($999 / $1,299)
CREATE OR REPLACE FUNCTION private.get_subscription_plan_quote(p_plan_key text)
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

  IF p_plan_key NOT IN ('starter', 'growth', 'revenue_partner') THEN
    RAISE EXCEPTION 'Invalid subscription plan' USING ERRCODE = '22023';
  END IF;

  -- Canonical pricing: Growth $999, Revenue Partner $1,299, Starter $497 (legacy)
  v_amount := CASE p_plan_key
    WHEN 'growth' THEN 999
    WHEN 'revenue_partner' THEN 1299
    WHEN 'starter' THEN 497
    ELSE 999
  END;

  RETURN jsonb_build_object(
    'plan_key', p_plan_key,
    'amount', v_amount,
    'currency', 'USD',
    'interval_unit', 'MONTH',
    'interval_count', 1
  );
END;
$function$;

-- Update PayPal quote to match canonical pricing
CREATE OR REPLACE FUNCTION private.get_paypal_plan_quote(p_plan_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN private.get_subscription_plan_quote(p_plan_key);
END;
$function$;

-- Razorpay quote alias
CREATE OR REPLACE FUNCTION private.get_razorpay_plan_quote(p_plan_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN private.get_subscription_plan_quote(p_plan_key);
END;
$function$;

-- 5. Prepare Razorpay Checkout (Idempotent, cross-gateway concurrency safe)
CREATE OR REPLACE FUNCTION private.prepare_razorpay_checkout(
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
  IF p_plan_key IS NULL OR p_plan_key NOT IN ('growth', 'revenue_partner', 'starter') THEN
    RAISE EXCEPTION 'Invalid subscription plan' USING ERRCODE = '22023';
  END IF;

  v_company_id := private.current_user_company_id();
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'Complete company onboarding before selecting a subscription' USING ERRCODE = '42501';
  END IF;

  -- Canonical pricing: Growth $999, Revenue Partner $1,299, Starter $497
  v_amount := CASE p_plan_key
    WHEN 'growth' THEN 999
    WHEN 'revenue_partner' THEN 1299
    WHEN 'starter' THEN 497
    ELSE 999
  END;

  -- Check for existing active/delinquent subscription across ANY gateway (PayPal or Razorpay)
  IF EXISTS (
    SELECT 1
    FROM public.subscriptions s
    WHERE s.company_id = v_company_id
      AND s.status IN (
        'trialing'::public.subscription_status,
        'active'::public.subscription_status,
        'past_due'::public.subscription_status
      )
      AND s.checkout_key IS DISTINCT FROM p_checkout_key
  ) THEN
    RAISE EXCEPTION 'An active subscription already exists for this company' USING ERRCODE = '23505';
  END IF;

  -- Check for pending checkout in the last 30 minutes with a different key
  IF EXISTS (
    SELECT 1
    FROM public.subscriptions s
    WHERE s.company_id = v_company_id
      AND s.status = 'inactive'::public.subscription_status
      AND s.checkout_key IS DISTINCT FROM p_checkout_key
      AND s.updated_at > now() - interval '30 minutes'
  ) THEN
    RAISE EXCEPTION 'A recent checkout is already pending for this company' USING ERRCODE = '23505';
  END IF;

  INSERT INTO public.subscriptions AS target (
    company_id, provider, plan_tier, amount, amount_cents, currency,
    status, checkout_key, updated_at
  )
  VALUES (
    v_company_id, 'razorpay', p_plan_key, v_amount, round(v_amount * 100)::integer,
    'usd', 'inactive'::public.subscription_status, p_checkout_key, now()
  )
  ON CONFLICT (company_id, checkout_key) WHERE checkout_key IS NOT NULL
  DO UPDATE SET updated_at = now()
    WHERE target.plan_tier = EXCLUDED.plan_tier
      AND target.amount = EXCLUDED.amount
      AND target.provider = 'razorpay'
  RETURNING target.id, target.provider_subscription_id, target.provider_plan_id, target.status
  INTO v_subscription_id, v_provider_subscription_id, v_provider_plan_id, v_status;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Checkout key has already been used for a different plan or provider' USING ERRCODE = '22023';
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

-- Update prepare_paypal_checkout to use canonical pricing and check ANY gateway
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
  IF p_plan_key IS NULL OR p_plan_key NOT IN ('growth', 'revenue_partner', 'starter') THEN
    RAISE EXCEPTION 'Invalid subscription plan' USING ERRCODE = '22023';
  END IF;

  v_company_id := private.current_user_company_id();
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'Complete company onboarding before selecting a subscription' USING ERRCODE = '42501';
  END IF;

  -- Canonical pricing: Growth $999, Revenue Partner $1,299, Starter $497
  v_amount := CASE p_plan_key
    WHEN 'growth' THEN 999
    WHEN 'revenue_partner' THEN 1299
    WHEN 'starter' THEN 497
    ELSE 999
  END;

  -- Check for existing active/delinquent subscription across ANY gateway (PayPal or Razorpay)
  IF EXISTS (
    SELECT 1
    FROM public.subscriptions s
    WHERE s.company_id = v_company_id
      AND s.status IN (
        'trialing'::public.subscription_status,
        'active'::public.subscription_status,
        'past_due'::public.subscription_status
      )
      AND s.checkout_key IS DISTINCT FROM p_checkout_key
  ) THEN
    RAISE EXCEPTION 'An active subscription already exists for this company' USING ERRCODE = '23505';
  END IF;

  -- Check for pending checkout in the last 30 minutes with a different key
  IF EXISTS (
    SELECT 1
    FROM public.subscriptions s
    WHERE s.company_id = v_company_id
      AND s.status = 'inactive'::public.subscription_status
      AND s.checkout_key IS DISTINCT FROM p_checkout_key
      AND s.updated_at > now() - interval '30 minutes'
  ) THEN
    RAISE EXCEPTION 'A recent checkout is already pending for this company' USING ERRCODE = '23505';
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
    RAISE EXCEPTION 'Checkout key has already been used for a different plan or provider' USING ERRCODE = '22023';
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

-- 6. Link Razorpay Subscription
CREATE OR REPLACE FUNCTION private.link_razorpay_subscription(
  p_subscription_id uuid,
  p_checkout_key uuid,
  p_company_id uuid,
  p_provider_subscription_id text,
  p_provider_plan_id text,
  p_provider_payment_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_plan_tier text;
  v_amount numeric;
BEGIN
  IF p_subscription_id IS NULL OR p_checkout_key IS NULL OR p_company_id IS NULL
     OR nullif(btrim(p_provider_subscription_id), '') IS NULL
     OR nullif(btrim(p_provider_plan_id), '') IS NULL THEN
    RAISE EXCEPTION 'Razorpay subscription linking requires complete identifiers' USING ERRCODE = '22023';
  END IF;

  UPDATE public.subscriptions
  SET provider_subscription_id = p_provider_subscription_id,
      provider_plan_id = p_provider_plan_id,
      status = 'active'::public.subscription_status,
      last_payment_at = CASE WHEN p_provider_payment_id IS NOT NULL THEN now() ELSE last_payment_at END,
      updated_at = now()
  WHERE id = p_subscription_id
    AND checkout_key = p_checkout_key
    AND company_id = p_company_id
    AND provider = 'razorpay'
    AND plan_tier IN ('growth', 'revenue_partner', 'starter')
    AND (provider_subscription_id IS NULL OR provider_subscription_id = p_provider_subscription_id)
    AND (provider_plan_id IS NULL OR provider_plan_id = p_provider_plan_id)
  RETURNING plan_tier, amount INTO v_plan_tier, v_amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Could not safely link Razorpay subscription to the pending checkout' USING ERRCODE = '42501';
  END IF;

  -- If payment id was provided on callback, log payment
  IF p_provider_payment_id IS NOT NULL AND btrim(p_provider_payment_id) <> '' THEN
    INSERT INTO public.payments (
      company_id, subscription_id, provider, provider_payment_id,
      amount, currency, status, created_at, updated_at
    )
    VALUES (
      p_company_id, p_subscription_id, 'razorpay', p_provider_payment_id,
      coalesce(v_amount, 999), 'usd', 'captured', now(), now()
    )
    ON CONFLICT (provider, provider_payment_id) DO NOTHING;
  END IF;

  RETURN true;
END;
$function$;

-- 7. Cancel Razorpay Subscription (Scoped strictly to company)
CREATE OR REPLACE FUNCTION private.cancel_razorpay_subscription(
  p_subscription_id uuid,
  p_company_id uuid,
  p_provider_subscription_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF p_subscription_id IS NULL OR p_company_id IS NULL THEN
    RAISE EXCEPTION 'Subscription ID and company ID are required to cancel' USING ERRCODE = '22023';
  END IF;

  UPDATE public.subscriptions
  SET status = 'canceled'::public.subscription_status,
      canceled_at = coalesce(canceled_at, now()),
      updated_at = now()
  WHERE id = p_subscription_id
    AND company_id = p_company_id
    AND provider = 'razorpay'
    AND (p_provider_subscription_id IS NULL OR provider_subscription_id = p_provider_subscription_id);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No matching Razorpay subscription was found for this company' USING ERRCODE = 'P0002';
  END IF;

  RETURN true;
END;
$function$;

-- 8. Process Razorpay Webhook Event (Idempotent & Authoritative)
CREATE OR REPLACE FUNCTION private.process_razorpay_webhook_event(
  p_event_id text,
  p_event_type text,
  p_payload jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_rows integer;
  v_sub_entity jsonb;
  v_pay_entity jsonb;
  v_external_sub_id text;
  v_internal_sub_id uuid;
  v_subscription_id uuid;
  v_company_id uuid;
  v_payment_id text;
  v_amount numeric;
  v_status public.subscription_status;
BEGIN
  IF nullif(btrim(p_event_id), '') IS NULL OR length(p_event_id) > 150
     OR nullif(btrim(p_event_type), '') IS NULL OR length(p_event_type) > 150
     OR p_payload IS NULL OR jsonb_typeof(p_payload) <> 'object' THEN
    RAISE EXCEPTION 'Invalid Razorpay webhook event' USING ERRCODE = '22023';
  END IF;

  -- Idempotent event ledger insert
  INSERT INTO private.razorpay_webhook_events (event_id, event_type, payload)
  VALUES (p_event_id, p_event_type, p_payload)
  ON CONFLICT (event_id) DO NOTHING;
  GET DIAGNOSTICS v_rows = ROW_COUNT;

  IF v_rows = 0 THEN
    RETURN jsonb_build_object('duplicate', true, 'processed', false);
  END IF;

  v_sub_entity := coalesce(p_payload #> '{payload,subscription,entity}', '{}'::jsonb);
  v_pay_entity := coalesce(p_payload #> '{payload,payment,entity}', '{}'::jsonb);

  v_external_sub_id := nullif(v_sub_entity ->> 'id', '');
  IF v_external_sub_id IS NULL THEN
    -- Fallback to subscription_id property on payment entity
    v_external_sub_id := nullif(v_pay_entity ->> 'subscription_id', '');
  END IF;

  -- Extract internal subscription UUID from notes if present
  IF length(coalesce(v_sub_entity #>> '{notes,subscription_id}', '')) = 36
     AND (v_sub_entity #>> '{notes,subscription_id}') ~* '^[0-9a-f-]{36}$' THEN
    v_internal_sub_id := (v_sub_entity #>> '{notes,subscription_id}')::uuid;
  ELSIF length(coalesce(v_pay_entity #>> '{notes,subscription_id}', '')) = 36
     AND (v_pay_entity #>> '{notes,subscription_id}') ~* '^[0-9a-f-]{36}$' THEN
    v_internal_sub_id := (v_pay_entity #>> '{notes,subscription_id}')::uuid;
  END IF;

  -- Process Subscription Status Changes
  IF p_event_type IN (
    'subscription.authenticated',
    'subscription.activated',
    'subscription.charged',
    'subscription.pending',
    'subscription.halted',
    'subscription.cancelled',
    'subscription.completed',
    'subscription.paused',
    'subscription.resumed'
  ) THEN
    v_status := CASE p_event_type
      WHEN 'subscription.activated' THEN 'active'::public.subscription_status
      WHEN 'subscription.charged' THEN 'active'::public.subscription_status
      WHEN 'subscription.resumed' THEN 'active'::public.subscription_status
      WHEN 'subscription.authenticated' THEN 'active'::public.subscription_status
      WHEN 'subscription.cancelled' THEN 'canceled'::public.subscription_status
      WHEN 'subscription.completed' THEN 'canceled'::public.subscription_status
      WHEN 'subscription.halted' THEN 'past_due'::public.subscription_status
      WHEN 'subscription.pending' THEN 'past_due'::public.subscription_status
      ELSE 'inactive'::public.subscription_status
    END;

    UPDATE public.subscriptions
    SET provider_subscription_id = coalesce(provider_subscription_id, v_external_sub_id),
        provider_plan_id = coalesce(nullif(v_sub_entity ->> 'plan_id', ''), provider_plan_id),
        status = coalesce(v_status, status),
        canceled_at = CASE WHEN p_event_type IN ('subscription.cancelled', 'subscription.completed')
                           THEN coalesce(canceled_at, now()) ELSE canceled_at END,
        last_payment_at = CASE WHEN p_event_type = 'subscription.charged'
                               THEN now() ELSE last_payment_at END,
        updated_at = now()
    WHERE provider = 'razorpay'
      AND (
        (v_external_sub_id IS NOT NULL AND provider_subscription_id = v_external_sub_id)
        OR (
          v_internal_sub_id IS NOT NULL
          AND id = v_internal_sub_id
        )
      )
    RETURNING id, company_id INTO v_subscription_id, v_company_id;

    -- If subscription.charged contains a payment entity, log payment
    IF p_event_type = 'subscription.charged' AND nullif(v_pay_entity ->> 'id', '') IS NOT NULL AND v_company_id IS NOT NULL THEN
      v_payment_id := v_pay_entity ->> 'id';
      BEGIN
        v_amount := (v_pay_entity ->> 'amount')::numeric / 100.0;
      EXCEPTION WHEN OTHERS THEN
        v_amount := 999;
      END;

      INSERT INTO public.payments (
        company_id, subscription_id, provider, provider_payment_id,
        amount, currency, status, created_at, updated_at
      )
      VALUES (
        v_company_id, v_subscription_id, 'razorpay', v_payment_id,
        v_amount, 'usd', 'captured', now(), now()
      )
      ON CONFLICT (provider, provider_payment_id) DO NOTHING;
    END IF;

  ELSIF p_event_type = 'payment.captured' THEN
    v_payment_id := nullif(v_pay_entity ->> 'id', '');
    BEGIN
      v_amount := (v_pay_entity ->> 'amount')::numeric / 100.0;
    EXCEPTION WHEN OTHERS THEN
      v_amount := 999;
    END;

    -- Locate subscription
    SELECT id, company_id INTO v_subscription_id, v_company_id
    FROM public.subscriptions
    WHERE provider = 'razorpay'
      AND (
        (v_external_sub_id IS NOT NULL AND provider_subscription_id = v_external_sub_id)
        OR (v_internal_sub_id IS NOT NULL AND id = v_internal_sub_id)
      )
    LIMIT 1;

    IF v_company_id IS NOT NULL AND v_payment_id IS NOT NULL THEN
      INSERT INTO public.payments (
        company_id, subscription_id, provider, provider_payment_id,
        amount, currency, status, created_at, updated_at
      )
      VALUES (
        v_company_id, v_subscription_id, 'razorpay', v_payment_id,
        v_amount, 'usd', 'captured', now(), now()
      )
      ON CONFLICT (provider, provider_payment_id) DO NOTHING;

      UPDATE public.subscriptions
      SET status = 'active'::public.subscription_status,
          last_payment_at = now(),
          updated_at = now()
      WHERE id = v_subscription_id;
    END IF;

  ELSIF p_event_type = 'payment.failed' THEN
    -- Mark subscription past_due if linked
    IF v_external_sub_id IS NOT NULL OR v_internal_sub_id IS NOT NULL THEN
      UPDATE public.subscriptions
      SET status = 'past_due'::public.subscription_status,
          updated_at = now()
      WHERE provider = 'razorpay'
        AND (
          (v_external_sub_id IS NOT NULL AND provider_subscription_id = v_external_sub_id)
          OR (v_internal_sub_id IS NOT NULL AND id = v_internal_sub_id)
        );
    END IF;
  END IF;

  RETURN jsonb_build_object('duplicate', false, 'processed', true);
END;
$function$;

-- 9. Public Schema Wrappers for PostgREST RPC Access
CREATE OR REPLACE FUNCTION public.get_razorpay_plan_quote(p_plan_key text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT private.get_razorpay_plan_quote(p_plan_key);
$function$;

CREATE OR REPLACE FUNCTION public.prepare_razorpay_checkout(
  p_plan_key text,
  p_checkout_key uuid
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT private.prepare_razorpay_checkout(p_plan_key, p_checkout_key);
$function$;

CREATE OR REPLACE FUNCTION public.link_razorpay_subscription(
  p_subscription_id uuid,
  p_checkout_key uuid,
  p_company_id uuid,
  p_provider_subscription_id text,
  p_provider_plan_id text,
  p_provider_payment_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT private.link_razorpay_subscription(
    p_subscription_id, p_checkout_key, p_company_id,
    p_provider_subscription_id, p_provider_plan_id, p_provider_payment_id
  );
$function$;

CREATE OR REPLACE FUNCTION public.cancel_razorpay_subscription(
  p_subscription_id uuid,
  p_company_id uuid,
  p_provider_subscription_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT private.cancel_razorpay_subscription(
    p_subscription_id, p_company_id, p_provider_subscription_id
  );
$function$;

CREATE OR REPLACE FUNCTION public.process_razorpay_webhook_event(
  p_event_id text,
  p_event_type text,
  p_payload jsonb
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT private.process_razorpay_webhook_event(p_event_id, p_event_type, p_payload);
$function$;

-- 10. Explicit Privilege Grants & Revocations
REVOKE ALL ON FUNCTION private.get_razorpay_plan_quote(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.prepare_razorpay_checkout(text, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.link_razorpay_subscription(uuid, uuid, uuid, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.cancel_razorpay_subscription(uuid, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.process_razorpay_webhook_event(text, text, jsonb) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.get_razorpay_plan_quote(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.prepare_razorpay_checkout(text, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.link_razorpay_subscription(uuid, uuid, uuid, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancel_razorpay_subscription(uuid, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.process_razorpay_webhook_event(text, text, jsonb) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION private.get_razorpay_plan_quote(text) TO authenticated;
GRANT EXECUTE ON FUNCTION private.prepare_razorpay_checkout(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.link_razorpay_subscription(uuid, uuid, uuid, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION private.cancel_razorpay_subscription(uuid, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION private.process_razorpay_webhook_event(text, text, jsonb) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_razorpay_plan_quote(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.prepare_razorpay_checkout(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_razorpay_subscription(uuid, uuid, uuid, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_razorpay_subscription(uuid, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.process_razorpay_webhook_event(text, text, jsonb) TO service_role;
