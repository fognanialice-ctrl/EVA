-- ============================================================================
-- 006_member_rls_policies.sql
-- EVA — Scoped RLS policies for member app
--
-- REPLACES the broad "any authenticated user = full CRUD" policies with
-- scoped member policies. Dashboard is unaffected (uses service_role key
-- which bypasses RLS entirely).
-- ============================================================================

-- ============================================================================
-- DROP ALL BROAD POLICIES (from 002_rls_policies.sql)
-- ============================================================================

-- contacts (4 broad + 1 from migration 005)
DROP POLICY IF EXISTS "Authenticated users can view all contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can delete contacts" ON contacts;
DROP POLICY IF EXISTS "Members can update own contact" ON contacts;

-- tags (4)
DROP POLICY IF EXISTS "Authenticated users can view all tags" ON tags;
DROP POLICY IF EXISTS "Authenticated users can insert tags" ON tags;
DROP POLICY IF EXISTS "Authenticated users can update tags" ON tags;
DROP POLICY IF EXISTS "Authenticated users can delete tags" ON tags;

-- contact_tags (3)
DROP POLICY IF EXISTS "Authenticated users can view all contact tags" ON contact_tags;
DROP POLICY IF EXISTS "Authenticated users can insert contact tags" ON contact_tags;
DROP POLICY IF EXISTS "Authenticated users can delete contact tags" ON contact_tags;

-- events (4)
DROP POLICY IF EXISTS "Authenticated users can view all events" ON events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON events;

-- event_registrations (4)
DROP POLICY IF EXISTS "Authenticated users can view all registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can insert registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can update registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can delete registrations" ON event_registrations;

-- payments (4)
DROP POLICY IF EXISTS "Authenticated users can view all payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can insert payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can update payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can delete payments" ON payments;

-- activity_log (4 + 1 service_role)
DROP POLICY IF EXISTS "Authenticated users can view all activity logs" ON activity_log;
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON activity_log;
DROP POLICY IF EXISTS "Authenticated users can update activity logs" ON activity_log;
DROP POLICY IF EXISTS "Authenticated users can delete activity logs" ON activity_log;
DROP POLICY IF EXISTS "Service role can insert activity logs" ON activity_log;

-- event_expenses (4, from 004_event_expenses.sql)
DROP POLICY IF EXISTS "Authenticated users can read event_expenses" ON event_expenses;
DROP POLICY IF EXISTS "Authenticated users can insert event_expenses" ON event_expenses;
DROP POLICY IF EXISTS "Authenticated users can update event_expenses" ON event_expenses;
DROP POLICY IF EXISTS "Authenticated users can delete event_expenses" ON event_expenses;


-- ============================================================================
-- NEW SCOPED MEMBER POLICIES
-- ============================================================================
-- Members use the anon key (respects RLS). These policies scope access
-- to their own data only. The dashboard uses service_role (bypasses RLS)
-- so it is completely unaffected by these changes.
-- ============================================================================

-- ── CONTACTS ────────────────────────────────────────────────────────────────
-- Members can only see and update their own contact row.

CREATE POLICY "Members can view own contact"
  ON contacts FOR SELECT
  TO authenticated
  USING (auth_user_id = (SELECT auth.uid()));

CREATE POLICY "Members can update own contact"
  ON contacts FOR UPDATE
  TO authenticated
  USING (auth_user_id = (SELECT auth.uid()))
  WITH CHECK (auth_user_id = (SELECT auth.uid()));

-- ── EVENTS ──────────────────────────────────────────────────────────────────
-- Members can see events that are visible (not draft or cancelled).

CREATE POLICY "Members can view visible events"
  ON events FOR SELECT
  TO authenticated
  USING (status IN ('published', 'registration_open', 'registration_closed', 'completed'));

-- ── EVENT_REGISTRATIONS ─────────────────────────────────────────────────────
-- Members can see, create, and update only their OWN registrations
-- (identified via contact_id → contacts.auth_user_id).

CREATE POLICY "Members can view own registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (
    contact_id IN (
      SELECT id FROM contacts WHERE auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Members can insert own registrations"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (
    contact_id IN (
      SELECT id FROM contacts WHERE auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Members can update own registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (
    contact_id IN (
      SELECT id FROM contacts WHERE auth_user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    contact_id IN (
      SELECT id FROM contacts WHERE auth_user_id = (SELECT auth.uid())
    )
  );

-- ── PAYMENTS ────────────────────────────────────────────────────────────────
-- Members can only see their own payments (read-only).

CREATE POLICY "Members can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    contact_id IN (
      SELECT id FROM contacts WHERE auth_user_id = (SELECT auth.uid())
    )
  );

-- ── TAGS ────────────────────────────────────────────────────────────────────
-- No member access. Tags are admin-only.

-- ── CONTACT_TAGS ────────────────────────────────────────────────────────────
-- No member access. Tag assignments are admin-only.

-- ── ACTIVITY_LOG ────────────────────────────────────────────────────────────
-- No member access. Keep service_role INSERT for system triggers.

CREATE POLICY "Service role can insert activity logs"
  ON activity_log FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ── EVENT_EXPENSES ──────────────────────────────────────────────────────────
-- No member access. Budget tracking is admin-only.
