# Supabase Auth and onboarding setup

## Required Preview/Staging environment variables

Set the following values in the Vercel **Preview** environment for the RevenueRecover AI project only:

- `NEXT_PUBLIC_SUPABASE_URL=https://jzoighxrxgbtqrdhknpb.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the publishable key from the **staging** Supabase project.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only staging key required by PayPal billing webhooks and subscription persistence. Never add this key to a `NEXT_PUBLIC_*` variable or browser code.
- PayPal billing must use sandbox-only credentials and active sandbox plan IDs. See [PayPal billing setup](./PAYPAL_BILLING_SETUP.md).

The publishable API key is designed for browser use; table access is enforced by RLS. Do not point Preview at the production Supabase project.

## Supabase Auth URL Configuration (required for email confirmation)

In the staging Supabase dashboard, open **Authentication → URL Configuration**:

1. Keep the Site URL set to the approved stable application URL used by this project; do not use a production URL as a shortcut to bypass testing.
2. Add these **Additional Redirect URLs**:
   - `https://*-akashpardeshi188-1744s-projects.vercel.app/**` (Vercel Preview deployments)
   - `http://localhost:3000/**` (local development)
3. Ensure the confirmation email template uses Supabase's `{{ .ConfirmationURL }}` or an approved `{{ .RedirectTo }}` value, not a hard-coded localhost or unrelated production URL.

For Preview signup and resend requests, the app sends the current Vercel deployment origin to Supabase using the `redirect_to` query parameter and routes the email link back to `/auth/confirmed`. The landing page removes token fragments from the address bar and asks the user to sign in again. Vercel's `VERCEL_URL` is used automatically in Preview; do not copy `APP_BASE_URL` or production payment settings into Preview.

For a later, separately approved production cutover, set `APP_BASE_URL` and `NEXT_PUBLIC_SITE_URL` to the stable HTTPS application domain and configure the production Supabase Auth redirect allowlist explicitly.

## What this change adds

- Signup and password login are sent to Supabase Auth instead of immediately navigating to the dashboard.
- Signup confirmation links return to the current Preview deployment, when the staging Auth redirect allowlist permits it.
- Session access and refresh tokens are stored in HttpOnly cookies and verified with Supabase Auth.
- Dashboard pages require a valid session; dashboard users without a company are redirected to onboarding.
- The onboarding completion endpoint calls the `complete_client_onboarding` and `save_client_onboarding_details` RPCs with the signed-in user's token. These functions enforce user/company assignment inside Postgres.
- Non-admin users are redirected away from `/admin`.

## Important limitations before public launch

- Authentication URL settings and Vercel Preview environment variables still need verification through the respective dashboards.
- Test account creation in an isolated staging mailbox, confirmation links, login, logout, company onboarding, expired-session refresh, and cross-company access in the hosted Preview.
- The main dashboard overview and recovery status controls now use company-scoped Supabase APIs. Several secondary screens/actions still use the client-side store and are not fully backed by the database.
- PayPal subscription creation, webhook verification, durable payment persistence, and end-to-end sandbox tests remain launch blockers.
- Do not enable real payment collection or outbound customer messages until the full staging flow passes.
