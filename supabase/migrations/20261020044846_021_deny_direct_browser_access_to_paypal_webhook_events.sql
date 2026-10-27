-- Staging migration record: version 20261020044846, name 021_deny_direct_browser_access_to_paypal_webhook_events.
-- Explicitly deny all direct browser-role access to the private webhook event log.
-- The postgres-owned SECURITY DEFINER webhook processor bypasses RLS and is the intended write path.
CREATE POLICY deny_direct_browser_access
  ON private.paypal_webhook_events
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
