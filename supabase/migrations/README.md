# Supabase migrations

## Changes represented in this repository

These PayPal and billing migrations were applied to RevenueRecover AI **staging only**:

- `20261020033053_017_paypal_recurring_billing_secure.sql`
- `20261020033358_018_prevent_duplicate_paypal_subscriptions_and_cancel.sql`
- `20261020033838_019_paypal_billing_status_guardrails.sql`
- `20261020044822_20261020050500_020_enable_rls_on_private_paypal_webhook_events.sql`
- `20261020044846_021_deny_direct_browser_access_to_paypal_webhook_events.sql`

The Supabase migration API assigned the actual staging ledger versions for migrations 020 and 021. Their filenames above deliberately match the recorded ledger `version` + `name` so the migration history can be compared accurately.

## Staging verification for migrations 020–021

- `private.paypal_webhook_events` has RLS enabled.
- A `deny_direct_browser_access` policy applies to `anon` and `authenticated` with `USING (false)` / `WITH CHECK (false)`.
- Direct SELECT/INSERT privileges remain absent for browser roles.
- The table and the `private.process_paypal_webhook_event` SECURITY DEFINER function are owned by `postgres`, which bypasses RLS. The webhook write path still needs an actual PayPal Sandbox end-to-end delivery test.
- The post-change Supabase Security Advisor returned **zero findings**. Performance Advisor retained only INFO-level unused-index notices; do not drop indexes without workload evidence.

## Important baseline limitation

The live staging database has recorded migrations 001–016, but their SQL files are not yet fully reconstructed/synced in this repository. The numbered PayPal delta migrations assume those earlier tables, types, helper functions, and policies already exist. **This is not a complete fresh-database migration chain.** Do not run `supabase db reset` or push the current folder into a blank database until the missing baseline migrations are recovered and tested.
