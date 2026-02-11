-- ============================================================================
-- 002_rls_policies.sql
-- EVA Dashboard - Row Level Security Policies
-- Admin-only dashboard: authenticated users get full access
-- ============================================================================

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CONTACTS
-- ============================================================================

CREATE POLICY "Authenticated users can view all contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert contacts"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- TAGS
-- ============================================================================

CREATE POLICY "Authenticated users can view all tags"
  ON tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tags"
  ON tags FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- CONTACT_TAGS
-- ============================================================================

CREATE POLICY "Authenticated users can view all contact tags"
  ON contact_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert contact tags"
  ON contact_tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contact tags"
  ON contact_tags FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- EVENTS
-- ============================================================================

CREATE POLICY "Authenticated users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- EVENT_REGISTRATIONS
-- ============================================================================

CREATE POLICY "Authenticated users can view all registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert registrations"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete registrations"
  ON event_registrations FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- PAYMENTS
-- ============================================================================

CREATE POLICY "Authenticated users can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- ACTIVITY_LOG
-- Authenticated users get full access.
-- Service role (system) can also insert for automated logging.
-- ============================================================================

CREATE POLICY "Authenticated users can view all activity logs"
  ON activity_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert activity logs"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update activity logs"
  ON activity_log FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete activity logs"
  ON activity_log FOR DELETE
  TO authenticated
  USING (true);

-- Allow the service_role (used by server-side functions / triggers) to insert
-- activity log entries for system-level actions.
CREATE POLICY "Service role can insert activity logs"
  ON activity_log FOR INSERT
  TO service_role
  WITH CHECK (true);
