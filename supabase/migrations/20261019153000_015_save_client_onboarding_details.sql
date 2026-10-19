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
      status = 'in_progress'::public.onboarding_status, updated_at = now()
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

REVOKE ALL ON FUNCTION private.save_client_onboarding_details(text, text[], text, text[], text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.save_client_onboarding_details(text, text[], text, text[], text, text) TO authenticated, service_role, postgres;

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

REVOKE ALL ON FUNCTION public.save_client_onboarding_details(text, text[], text, text[], text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_client_onboarding_details(text, text[], text, text[], text, text) TO authenticated, service_role, postgres;

NOTIFY pgrst, 'reload schema';
