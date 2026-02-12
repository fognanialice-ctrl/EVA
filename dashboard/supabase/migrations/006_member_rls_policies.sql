-- 006_member_rls_policies.sql
-- EVA — Scoped RLS policies for member app
--
-- Replaces the broad "any authenticated user = full CRUD" policies with
-- scoped member policies. Dashboard is unaffected (uses service_role key
-- which bypasses RLS entirely).

-- Drop broad policies: contacts (4 broad + 1 from migration 005)
DROP POLICY IF EXISTS "Authenticated users can view all contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can delete contacts" ON contacts;
DROP POLICY IF EXISTS "Members can update own contact" ON contacts;

-- Drop broad policies: tags
DROP POLICY IF EXISTS "Authenticated users can view all tags" ON tags;
DROP POLICY IF EXISTS "Authenticated users can insert tags" ON tags;
DROP POLICY IF EXISTS "Authenticated users can update tags" ON tags;
DROP POLICY IF EXISTS "Authenticated users can delete tags" ON tags;

-- Drop broad policies: contact_tags
DROP POLICY IF EXISTS "Authenticated users can view all contact tags" ON contact_tags;
DROP POLICY IF EXISTS "Authenticated users can insert contact tags" ON contact_tags;
DROP POLICY IF EXISTS "Authenticated users can delete contact tags" ON contact_tags;

-- Drop broad policies: events
DROP POLICY IF EXISTS "Authenticated users can view all events" ON events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON events;

-- Drop broad policies: event_registrations
DROP POLICY IF EXISTS "Authenticated users can view all registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can insert registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can update registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can delete registrations" ON event_registrations;

-- Drop broad policies: payments
DROP POLICY IF EXISTS "Authenticated users can view all payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can insert payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can update payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can delete payments" ON payments;

-- Drop broad policies: activity_log
DROP POLICY IF EXISTS "Authenticated users can view all activity logs" ON activity_log;
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON activity_log;
DROP POLICY IF EXISTS "Authenticated users can update activity logs" ON activity_log;
DROP POLICY IF EXISTS "Authenticated users can delete activity logs" ON activity_log;
DROP POLICY IF EXISTS "Service role can insert activity logs" ON activity_log;

-- Drop broad policies: event_expenses
DROP POLICY IF EXISTS "Authenticated users can read event_expenses" ON event_expenses;
DROP POLICY IF EXISTS "Authenticated users can insert event_expenses" ON event_expenses;
DROP POLICY IF EXISTS "Authenticated users can update event_expenses" ON event_expenses;
DROP POLICY IF EXISTS "Authenticated users can delete event_expenses" ON event_expenses;


-- New scoped member policies

-- Contacts: own row only
CREATE POLICY "Members can view own contact"
  ON contacts FOR SELECT
  TO authenticated
  USING (auth_user_id = (SELECT auth.uid()));

CREATE POLICY "Members can update own contact"
  ON contacts FOR UPDATE
  TO authenticated
  USING (auth_user_id = (SELECT auth.uid()))
  WITH CHECK (auth_user_id = (SELECT auth.uid()));

-- Events: visible statuses only (not draft or cancelled)
CREATE POLICY "Members can view visible events"
  ON events FOR SELECT
  TO authenticated
  USING (status IN ('published', 'registration_open', 'registration_closed', 'completed'));

-- Event registrations: own only (via contact_id lookup)
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

-- Payments: own only, read-only
CREATE POLICY "Members can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    contact_id IN (
      SELECT id FROM contacts WHERE auth_user_id = (SELECT auth.uid())
    )
  );

-- Activity log: service_role insert only (for system triggers)
CREATE POLICY "Service role can insert activity logs"
  ON activity_log FOR INSERT
  TO service_role
  WITH CHECK (true);

-- No member access to: tags, contact_tags, event_expenses
