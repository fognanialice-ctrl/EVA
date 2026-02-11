-- ============================================
-- 004: Event Expenses (Budget per evento)
-- ============================================

-- Enum: expense category
CREATE TYPE expense_category AS ENUM (
  'venue',
  'catering',
  'decoration',
  'staff',
  'supplies',
  'transport',
  'marketing',
  'other'
);

-- Enum: expense status
CREATE TYPE expense_status AS ENUM (
  'quoted',
  'deposit_paid',
  'paid',
  'cancelled'
);

-- Table: event_expenses
CREATE TABLE event_expenses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  supplier_name TEXT NOT NULL,
  category      expense_category NOT NULL DEFAULT 'other',
  description   TEXT,
  budgeted_cents INTEGER NOT NULL DEFAULT 0,
  paid_cents     INTEGER NOT NULL DEFAULT 0,
  status        expense_status NOT NULL DEFAULT 'quoted',
  paid_at       TIMESTAMPTZ,
  invoice_ref   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on event_id for fast lookups
CREATE INDEX idx_event_expenses_event_id ON event_expenses(event_id);

-- Trigger: auto-update updated_at
CREATE TRIGGER update_event_expenses_updated_at
  BEFORE UPDATE ON event_expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE event_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read event_expenses"
  ON event_expenses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert event_expenses"
  ON event_expenses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update event_expenses"
  ON event_expenses FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete event_expenses"
  ON event_expenses FOR DELETE
  TO authenticated
  USING (true);
