-- RevenueRecover AI STAGING: authenticated PayPal subscription checkout + verified-event persistence.
-- Canonical monthly USD prices come from agency_settings; fallbacks mirror its column defaults.
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS checkout_key uuid;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_company_checkout_key_uq
  ON public.subscriptions (company_id, checkout_key)
  WHERE checkout_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_provider_subscription_id_uq
  ON public.subscriptions (provider_subscription_id)
  WHERE provider_subscription_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS private.paypal_webhook_events (
  event_id text PRIMARY KEY,
  event_type text NOT NULL,
  resource jsonb NOT NULL DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz NOT NULL DEFAULT now()
);

REVOKE ALL ON TABLE private.paypal_webhook_events FROM PUBLIC, anon, authenticated, service_role;

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

  IF p_plan_key NOT IN ('starter', 'growth', 'revenue_partner') THEN
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
  IF p_plan_key NOT IN ('starter', 'growth', 'revenue_partner') THEN
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

-- Public RPC wrappers are invoker functions. Privileged helpers are not exposed
-- to anonymous/authenticated roles beyond the authenticated plan/checkout helpers.
CREATE OR REPLACE FUNCTION public.get_paypal_plan_quote(p_plan_key text)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $function$
  SELECT private.get_paypal_plan_quote(p_plan_key);
$function$;

CREATE OR REPLACE FUNCTION public.prepare_paypal_checkout(p_plan_key text, p_checkout_key uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $function$
  SELECT private.prepare_paypal_checkout(p_plan_key, p_checkout_key);
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

REVOKE ALL ON FUNCTION private.get_paypal_plan_quote(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.prepare_paypal_checkout(text, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.link_paypal_subscription(uuid, uuid, uuid, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.process_paypal_webhook_event(text, text, jsonb) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.get_paypal_plan_quote(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.prepare_paypal_checkout(text, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.link_paypal_subscription(uuid, uuid, uuid, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.process_paypal_webhook_event(text, text, jsonb) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION private.get_paypal_plan_quote(text) TO authenticated;
GRANT EXECUTE ON FUNCTION private.prepare_paypal_checkout(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.link_paypal_subscription(uuid, uuid, uuid, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION private.process_paypal_webhook_event(text, text, jsonb) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_paypal_plan_quote(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.prepare_paypal_checkout(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_paypal_subscription(uuid, uuid, uuid, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.process_paypal_webhook_event(text, text, jsonb) TO service_role;
