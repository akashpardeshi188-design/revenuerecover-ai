# Supabase migrations

## Changes represented in this repository

These billing migrations were applied to RevenueRecover AI **staging only**:

- `20261020033053_017_paypal_recurring_billing_secure.sql`
- `20261020033358_018_prevent_duplicate_paypal_subscriptions_and_cancel.sql`
- `20261020033838_019_paypal_billing_status_guardrails.sql`
- `20261020044822_20261020050500_020_enable_rls_on_private_paypal_webhook_events.sql`
- `20261020044846_021_deny_direct_browser_access_to_paypal_webhook_events.sql`
- `20261021133000_022_final_pricing_and_razorpay_subscriptions.sql`
- `20261021133100_023_harden_razorpay_rpc_permissions.sql`

The Supabase migration API assigned ledger versions when migrations were applied. The recorded versions for 020–023 are 020: `20261020044822`, 021: `20261020044846`, 022: `20261021083935`, and 023: `20261021123206`. The ledger's `name` values also reflect the migration names sent to that API; compare the live migration ledger when reconciling repository history.

## Staging verification

### PayPal webhook ledger (020–021)
- `private.paypal_webhook_events` has row-level security enabled.
- A `deny_direct_browser_access` policy applies to `anon` and `authenticated` with `USING (false)` / `WITH CHECK (false)`.
- Direct SELECT/INSERT privileges remain absent for browser roles.
- The table and the `private.process_paypal_webhook_event` SECURITY DEFINER function are owned by `postgres`, which bypasses RLS. Actual PayPal Sandbox webhook delivery still needs end-to-end testing.

### Canonical billing and Razorpay (022–023)
- New subscription prices in this branch: Growth **$999 USD/month**, Revenue Partner **$1,299 USD/month**. Starter at $497 is retained for legacy records only.
- Razorpay is the intended primary recurring gateway; PayPal is secondary. Actual Preview environment variables, provider plan IDs and webhook configuration have not been verified.
- The private Razorpay webhook ledger has RLS enabled; direct SELECT privilege is absent for `anon` and `authenticated`; `service_role` is granted access.
- Migration 023 changes the public Razorpay quote/prepare wrappers to `SECURITY INVOKER`, revokes direct execution of the generic private pricing helper, and explicitly rejects null/invalid plan keys.
- After migration 023, the staging Supabase Security Advisor returned **zero findings**. Performance Advisor has INFO-level unused-index suggestions only. Do not drop indexes without workload evidence.
- The updated Razorpay callback verification in the application also checks the provider subscription against the signed-in tenant's pending checkout and canonical plan ID, but it still requires a successful Preview build and end-to-end runtime test.

## Important baseline limitation

The live staging database has recorded migrations 001–016, but their SQL files are not yet fully reconstructed/synced in this repository. The numbered billing migrations assume those earlier tables, types, helper functions, and policies already exist. **This is not a complete fresh-database migration chain.** Do not run `supabase db reset` or push the current folder into a blank database until the missing baseline migrations are recovered and tested.

## Release gate

- This work remains on a draft pull request and must not be merged to `main` or promoted to production until a successful Preview build and the signup, onboarding, tenant-isolation, sandbox billing, webhook, retry, and cancellation tests pass.
- The latest Vercel Preview could not be confirmed because the provider reported the free-plan deployment limit. The Vercel connector also lacks access to the required project scope, so Preview environment settings have not been inspected or changed.
