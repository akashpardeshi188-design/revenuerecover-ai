# Staging Supabase auth integration

This branch wires email/password sign-in, sign-up, the email-confirmation callback, password reset, client onboarding, and the dashboard overview to the RevenueRecover AI staging Supabase project.

## Environment

Copy .env.example to a local .env.local and replace the placeholder publishable key. Use the same staging project URL/key pair in the deployment preview.

- NEXT_PUBLIC_SUPABASE_URL — staging project URL.
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — publishable key for that project.
- CRON_SECRET — a long random server-only secret required for both GET and POST on the scheduled growth endpoint.
- STRIPE_WEBHOOK_SECRET / RAZORPAY_WEBHOOK_SECRET — server-only webhook secrets from their provider dashboards.

Never expose a Supabase service-role/secret key or a payment-provider secret using a NEXT_PUBLIC_ variable. Real secret values must be added to the correct deployment environment privately; do not commit them.

## Supabase Auth dashboard settings

1. Configure the site URL to the staging web application's origin.
2. Add the staging web origin and /auth/callback redirect to the allowed redirect URLs.
3. Keep email confirmation enabled for customer signup.
4. Ensure the email confirmation and password recovery templates use the configured callback URL.
5. Use test mailboxes and payment test accounts only until the whole browser flow passes in staging.

## Database changes

Staging migration 014 introduces restricted client tenant self-onboarding; migration 015 saves tenant-scoped onboarding details. The authenticated caller can create/assign only its own company. Signup metadata cannot assign an admin role or another company's ID. The public RPC wrappers deny anonymous execution and delegate to private security-definer helpers.

Staging migrations 001–013 were applied to the staging database through the Supabase connection, but they are not yet reconstructed as a complete, reproducible supabase/migrations history in this repository. Do not run a fresh database reset from this repository until the original baseline migration files are checked in and reviewed.

## Approved pricing source of truth

The approved **monthly USD** pricing for the pricing page is:

- Starter — **$497/month**
- Growth — **$997/month**
- Pro — **$1,994/month**

Annual billing and localized non-USD prices are not offered on the page until those amounts are explicitly approved. The pricing page remains informational and checkout stays disabled until provider verification, subscription persistence, and staging end-to-end tests are complete.

## Verification status

- The staging database has RLS enabled on all 22 public base tables.
- The earlier tenant-isolation transaction suite passed 24/24 database-level simulated-role tests. These are not full external HTTP/JWT browser tests.
- Supabase security advisor returned zero security lint findings after migrations 014–015.
- Sign-up/login/reset-password UI, callback, protected pages, and onboarding writes are connected to the staging Supabase client. Browser confirmation email and real sign-in still require an external test mailbox/session and are not confirmed end to end.
- The dashboard overview reads recovery opportunities, customer leads, and payment rows using the authenticated Supabase session. Other feature subpages may still use local demo-store data; Live mode is marked experimental.
- Checkout UI has been disabled deliberately. PayPal order creation/capture, Razorpay order creation, and Skydo invoice routes return an unavailable response instead of creating false orders, using hard-coded credentials, or displaying fabricated bank details. The visible plan amounts need a single approved source of truth before billing is reopened.
- Stripe/Razorpay webhook signatures are checked, but event handling still uses in-memory telemetry and does not activate or persist subscriptions. Do not describe billing as production-ready.
- The cron endpoint requires CRON_SECRET. The health endpoint no longer reports a fabricated hard-coded action count.
- The Vercel preview check failed. The connected Vercel integration returned HTTP 403 (not authorized) for the RevenueRecover team/project scope, and the accessible project list contains only a different project. Vercel access must be re-authorized before preview logs/configuration can be inspected. No manual production deployment or promotion was performed. No production database change or live payment action was attempted.

## Remaining release gates

1. The lockfile includes the Supabase client packages; the latest GitHub Actions run passed changed-file TypeScript lint and the Next.js production build. Re-run after any further code changes.
2. Sign up with a test mailbox, click the email confirmation link, and verify the flow reaches onboarding.
3. Complete onboarding with a disposable staging business and verify company/profile/onboarding rows; verify another user cannot read these rows.
4. Reconcile one server-side plan-price configuration and implement provider order ownership, signature verification, durable idempotent webhook processing, and subscription activation/cancellation before re-enabling checkout.
5. Reconstruct migrations 001–013 in the repo and test the clean database bootstrap before any future reset.
6. Connect the intended RevenueRecover Vercel project, add preview-only environment settings, run preview checks, and do not promote to production before these gates pass.
