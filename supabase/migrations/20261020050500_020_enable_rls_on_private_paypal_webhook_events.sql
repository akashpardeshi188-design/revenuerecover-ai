-- Defense in depth for the private PayPal webhook idempotency/event log.
-- Anonymous and authenticated roles have no direct table privileges; keep it that way.
-- The server-side SECURITY DEFINER event processor is owned by postgres, which
-- bypasses RLS. Do not FORCE ROW LEVEL SECURITY without revalidating that RPC.
ALTER TABLE private.paypal_webhook_events
  ENABLE ROW LEVEL SECURITY;
