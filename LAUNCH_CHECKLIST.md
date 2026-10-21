# RevenueRecover AI — Launch Checklist

Last checked: 2026-10-22
Branch: `feature/staging-mvp-integrated-2026-10-20`
Draft PR: https://github.com/akashpardeshi188-design/revenuerecover-ai/pull/5

## Legend
- ✅ Verified by repository/database inspection in this session.
- 🟡 Code exists, but runtime/end-to-end verification is still pending.
- ⬜ Not yet verified or requires account-side configuration.
- Never mark a payment, deployment, or security test ✅ unless the exact test actually passed.

## A. Code and database work

- ✅ Pricing page lists Growth at **$999/month** and Revenue Partner at **$1,299/month**.
- ✅ Razorpay amount map defines Growth = 999 USD and Revenue Partner = 1,299 USD.
- ✅ Razorpay recurring checkout route exists and only accepts Growth / Revenue Partner purchase keys.
- ✅ Razorpay verification route exists; source checks callback HMAC, authenticated company, pending checkout, provider subscription details, and configured plan ID before linking.
- 🟡 Razorpay webhook route exists and has signature-verification code; delivery and processing still require a real sandbox event test.
- ✅ PayPal recurring-subscription creation route exists and checks the configured provider plan against the selected monthly quote.
- 🟡 PayPal webhook route exists and is designed to verify provider events; a real signed sandbox webhook still needs testing.
- ✅ Separate Razorpay and PayPal subscription cancellation routes exist.
- ✅ Dashboard summary and recovery-opportunity API routes resolve authenticated context and use Supabase data rather than treating client-only data as authoritative.
- ✅ Staging migration 023 hardened Razorpay RPC permissions and invalid/null plan-key validation; previous staging Security Advisor re-check returned zero findings.

## B. Still to verify — do not call these complete yet

- ⬜ Run `npm ci` on the current PR head and resolve any lockfile/dependency errors.
- ⬜ Run lint, TypeScript checks, and `npm run build` on the current PR head.
- ⬜ Review current PR head CI results after the latest changes.
- ⬜ Test signup, email confirmation/resend, login/session refresh, and company onboarding in Preview.
- ⬜ Test cross-company/tenant isolation against staging with two separate test companies.
- ⬜ Test Razorpay sandbox subscription creation for both plans and verify the callback.
- ⬜ Deliver a signed Razorpay sandbox webhook and verify database activation, duplicate-event handling, failures, and cancellation.
- ⬜ Test PayPal sandbox subscription approval for the configured plans.
- ⬜ Deliver a verified PayPal sandbox webhook and test activation, duplicate events, failures, and cancellation.
- ⬜ Confirm dashboard access changes only after the server-verified subscription state changes.
- ⬜ Inspect actual Vercel Preview and Production environment variable names/targets; never print secret values to logs.
- ⬜ Verify the exact deployment URL and deployment state for the intended branch/commit.
- ⬜ Complete a final production smoke test only after staging checks pass.

## C. Required Vercel / gateway configuration

- ⬜ Configure staging Supabase URL + publishable key + server-only service-role key in the correct Vercel environment.
- ⬜ Configure Razorpay sandbox key ID, key secret, Growth plan ID, Revenue Partner plan ID, and webhook secret.
- ⬜ Configure PayPal sandbox mode, client credentials, matching monthly plan IDs, and webhook ID.
- ⬜ Confirm confirmation/return URLs point to the intended Preview or production domain.
- ⬜ Set live credentials only in Production after sandbox validation; keep secrets server-side and never commit them.
- ⬜ Configure corresponding live plans/webhooks when ready to accept customer payments.

## D. Release decisions

- ⬜ Keep PR #5 in draft until the build and required staging tests pass.
- ⬜ Restore/reconstruct the missing SQL baseline for recorded migrations 001–016 before using this migration folder on a blank database. Do not reset the working staging database.
- ⬜ Do not promote to production or claim the product is fully launch-ready until deployment and payment end-to-end checks pass.

## Current honest status

Pricing and important payment/auth/dashboard source files are present on the PR branch, and staging security hardening was previously verified. This checklist does **not** certify the current branch as fully built, deployed, or payment-tested. The remaining release gate is build/CI confirmation, account-side sandbox configuration, and real sandbox end-to-end tests.
