-- RevenueRecover AI STAGING: align unpaid subscription handling and reject null plan keys.
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
      WHEN 'starter' THEN 497
      WHEN 'growth' THEN 997
      WHEN 'revenue_partner' THEN 1997
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
      WHEN 'starter' THEN 497
      WHEN 'growth' THEN 997
      WHEN 'revenue_partner' THEN 1997
    END;
  END IF;
  IF v_amount <= 0 THEN
    RAISE EXCEPTION 'Subscription plan is not configured' USING ERRCODE = '22023';
  END IF;

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
