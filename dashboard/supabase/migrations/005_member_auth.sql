-- ============================================================================
-- 005_member_auth.sql
-- EVA Dashboard - Member Auth: link contacts to Supabase auth users
-- Enables members to log in via magic link and manage their own profile
-- ============================================================================

-- Add auth_user_id column to contacts
ALTER TABLE contacts ADD COLUMN auth_user_id UUID UNIQUE REFERENCES auth.users(id);

-- Index for fast lookups
CREATE INDEX idx_contacts_auth_user ON contacts(auth_user_id);

-- RLS policy: members can update their OWN contact row
-- (Existing "Authenticated users can update contacts" policy already allows
-- admin users to update any row. This policy specifically allows members
-- using the anon key to update only their own row.)
CREATE POLICY "Members can update own contact"
  ON contacts FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());
