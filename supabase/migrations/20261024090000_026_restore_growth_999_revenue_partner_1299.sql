-- RevenueRecover AI Staging — restore the selected public pricing.
-- The app's public plans are Growth $999/month and Revenue Partner $1,299/month.
-- Starter $497 remains legacy-only. Apply only after the base schema and migration 022.

BEGIN;

ALTER TABLE public.agency_settings
  ALTER COLUMN pricing_starter_monthly SET DEFAULT 497,
  ALTER COLUMN pricing_growth_monthly SET DEFAULT 999,
  ALTER COLUMN pricing_revenue_monthly SET DEFAULT 1299;

UPDATE public.agency_settings
SET pricing_starter_monthly = 497,
    pricing_growth_monthly = 999,
    pricing_revenue_monthly = 1299,
    updated_at = now();

-- Keep newly-created subscription rows aligned with the active Growth price.
ALTER TABLE public.subscriptions
  ALTER COLUMN amount SET DEFAULT 999.00,
  ALTER COLUMN amount_cents SET DEFAULT 99900;

-- Keep both gateway quote wrappers using one authoritative server-side price table.
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

  IF p_plan_key IS NULL OR p_plan_key NOT IN ('starter', 'growth', 'revenue_partner') THEN
    RAISE EXCEPTION 'Invalid subscription plan' USING ERRCODE = '22023';
  END IF;

  v_amount := CASE p_plan_key
    WHEN 'starter' THEN 497
    WHEN 'growth' THEN 999
    WHEN 'revenue_partner' THEN 1299
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

REVOKE ALL ON FUNCTION private.get_subscription_plan_quote(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.get_subscription_plan_quote(text) TO authenticated;

NOTIFY pgrst, 'reload schema';

COMMIT;
