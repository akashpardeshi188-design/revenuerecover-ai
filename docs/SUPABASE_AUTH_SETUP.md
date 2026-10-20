# Supabase Auth and onboarding setup

## Required Preview/Staging environment variables

Set the following values in the Vercel **Preview** environment for the RevenueRecover AI app:

- `NEXT_PUBLIC_SUPABASE_URL`: the Supabase staging project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the staging project's publishable key.

The API key is a public client key; access to table rows is enforced by RLS. Never add a service-role key to a `NEXT_PUBLIC_*` variable or to browser code.

## What this change adds

- Signup and password login are sent to Supabase Auth instead of immediately navigating to the dashboard.
- Session access and refresh tokens are stored in HttpOnly cookies and verified with Supabase Auth.
- Dashboard pages require a valid session; dashboard users without a company are redirected to onboarding.
- The onboarding completion endpoint calls the `complete_client_onboarding` and `save_client_onboarding_details` RPCs with the signed-in user's token. These functions enforce user/company assignment inside Postgres.
- Non-admin users are redirected away from `/admin`.

## Important limitations before public launch

- Configure and verify the environment variables in Preview first; do not point Preview at production data during testing.
- Test account creation in an isolated staging mailbox, email confirmation if enabled, login, logout, company onboarding, expired-session refresh, and cross-company access.
- The existing dashboard and several actions still use the client-side demo store. This change does not turn every dashboard widget or action into a database-backed live operation.
- PayPal subscription creation, webhook verification, durable payment persistence, and end-to-end sandbox tests are separate launch blockers.
- This is not a replacement for an independent security review. Do not enable real payment collection or outbound customer messages until the full flow has been tested.
