-- RevenueRecover AI staging hardening migration 023
-- Keep public RPC wrappers invoker-scoped and restrict the generic pricing helper.

ALTER FUNCTION public.get_razorpay_plan_quote(text) SECURITY INVOKER;
ALTER FUNCTION public.prepare_razorpay_checkout(text, uuid) SECURITY INVOKER;

-- This helper is only called by the private gateway-specific wrappers. Do not
-- leave PostgreSQL's default PUBLIC EXECUTE permission on the generic helper.
REVOKE ALL ON FUNCTION private.get_subscription_plan_quote(text)
  FROM PUBLIC, anon, authenticated, service_role;

-- NULL does not satisfy "NOT IN" in PL/pgSQL; reject it explicitly so invalid
-- plan keys can never fall through to the Growth default amount.
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
