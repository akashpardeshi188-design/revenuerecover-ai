-- Self-service tenant signup hardening.
-- Signup trigger must create an unassigned viewer; only this RPC may assign a new tenant.

CREATE OR REPLACE FUNCTION public.prevent_user_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
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
$function$;

REVOKE ALL ON FUNCTION public.prevent_user_privilege_escalation() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prevent_user_privilege_escalation() TO postgres, service_role;

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
    SET name = v_name, website = v_website,
        business_type = coalesce(p_business_type, 'other'::public.business_type),
        city = btrim(coalesce(p_city, '')), state = btrim(coalesce(p_state, '')),
        phone = nullif(btrim(coalesce(p_phone, '')), ''),
        email = nullif(btrim(coalesce(p_email, '')), ''), updated_at = now()
    WHERE id = v_profile.company_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Assigned company was not found' USING ERRCODE = 'P0002';
    END IF;
    RETURN v_profile.company_id;
  END IF;

  IF v_profile.role <> 'viewer' THEN
    RAISE EXCEPTION 'This account must be assigned by an administrator' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.companies (name, website, business_type, city, state, country, phone, email, status, client_status)
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

  UPDATE public.users SET company_id = v_company_id, role = 'client'
  WHERE id = v_user_id AND company_id IS NULL AND role = 'viewer';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Company assignment failed; please retry' USING ERRCODE = '40001';
  END IF;
  RETURN v_company_id;
END;
$function$;

REVOKE ALL ON FUNCTION private.complete_client_onboarding(text, text, public.business_type, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.complete_client_onboarding(text, text, public.business_type, text, text, text, text) TO authenticated, service_role, postgres;

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

REVOKE ALL ON FUNCTION public.complete_client_onboarding(text, text, public.business_type, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_client_onboarding(text, text, public.business_type, text, text, text, text) TO authenticated, service_role, postgres;

NOTIFY pgrst, 'reload schema';
