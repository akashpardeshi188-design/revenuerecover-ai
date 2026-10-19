# Staging Supabase auth integration

This branch wires sign-in, sign-up, the email-confirmation callback, password reset, client onboarding, and the dashboard overview to the RevenueRecover AI staging Supabase project.

## Environment

Set these in local environment configuration or on the matching Vercel project:

- NEXT_PUBLIC_SUPABASE_URL — project URL.
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — public publishable key for the same project.

Do not use a Supabase secret/service-role key in a browser variable. The checked-in .env.example has a placeholder, not a usable key.

## Supabase Auth dashboard settings

1. Configure the site URL to the staging web application's origin.
2. Add the staging web origin and /auth/callback redirect to the allowed redirect URLs.
3. Keep email confirmation enabled for customer signup.
4. Customize confirmation/reset emails only after the callback URL is allowed.
5. Use test accounts and test payment credentials until the full flow passes in staging.

## Database changes

Staging migrations 014 and 015 introduce a restricted tenant self-onboarding RPC and a tenant-scoped onboarding details RPC. They create/assign a customer's company only for the signed-in user; signup metadata cannot assign an admin role or another company's ID.

The earlier staging migrations 001–013 were applied through the Supabase connection but are not yet reconstructed as a complete, reproducible supabase/migrations history in this repository. Do not run a fresh database reset from this repository until that baseline history is checked in and reviewed.

## Verification status

- Staging database: 22 of 22 public tables have RLS enabled; the earlier tenant-isolation transaction suite passed 24 of 24 database-level tests.
- The dashboard overview now reads recovery opportunities, customer requests, and payments through the authenticated Supabase session.
- Signup/onboarding UI changes are on this branch, but still require a local/CI Next.js build and an external browser email-confirmation test.
- Payment-provider checkout, provider webhook signature validation, real outbound messaging, and other feature subpages still need independent end-to-end verification. Some secondary pages still use the local demo store; the UI marks Live mode as experimental to avoid implying otherwise.
- The available Vercel connection did not show a project linked to this repository. No production deployment or live payment action was attempted.

## Suggested validation before merge

1. Install dependencies and run npm run lint and npm run build.
2. Sign up with a test mailbox, open the confirmation email, and verify it reaches onboarding.
3. Complete onboarding with a disposable staging business and verify the company/profile/onboarding rows.
4. Sign out/in, check password reset, and confirm a separate user cannot read tenant rows.
5. Test payment sandbox/webhook paths only after the correct staging provider secrets and callback URLs are configured.
