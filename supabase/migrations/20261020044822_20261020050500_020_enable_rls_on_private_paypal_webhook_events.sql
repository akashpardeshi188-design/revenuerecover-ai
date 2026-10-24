-- Staging migration record: version 20261020044822, name 20261020050500_020_enable_rls_on_private_paypal_webhook_events.
-- Defense in depth for the private PayPal webhook idempotency/event log.
-- Anonymous and authenticated roles have no direct table privileges; keep it that way.
-- The server-side SECURITY DEFINER event processor is owned by postgres and bypasses RLS.
ALTER TABLE private.paypal_webhook_events
  ENABLE ROW LEVEL SECURITY;
