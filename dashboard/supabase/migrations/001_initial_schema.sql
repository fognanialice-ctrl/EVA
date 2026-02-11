-- EVA Dashboard — Initial Schema
-- All enums match TypeScript types exactly

-- Enum types
CREATE TYPE contact_source AS ENUM ('website_form', 'whatsapp', 'manual', 'referral', 'instagram');
CREATE TYPE contact_status AS ENUM ('lead', 'contacted', 'confirmed', 'attended', 'inactive');
CREATE TYPE preferred_contact_method AS ENUM ('whatsapp', 'email', 'phone');
CREATE TYPE billing_type AS ENUM ('persona_fisica', 'partita_iva');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'registration_open', 'registration_closed', 'completed', 'cancelled');
CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'waitlisted', 'cancelled', 'attended', 'no_show');
CREATE TYPE registration_source AS ENUM ('dashboard', 'public_form', 'whatsapp', 'manual');
CREATE TYPE payment_method AS ENUM ('paypal', 'bank_transfer', 'cash', 'other');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========== CONTACTS ==========
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Base (primo contatto)
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  -- Profilo (arricchimento progressivo)
  city TEXT,
  date_of_birth DATE,
  profession TEXT,
  instagram_handle TEXT,
  preferred_contact_method preferred_contact_method,
  dietary_requirements TEXT,
  allergies_sensitivities TEXT,
  notes TEXT,
  -- Tracking
  source contact_source NOT NULL DEFAULT 'manual',
  source_detail TEXT,
  status contact_status NOT NULL DEFAULT 'lead',
  subscribed_to_mailing BOOLEAN NOT NULL DEFAULT true,
  referred_by UUID REFERENCES contacts(id) ON DELETE SET NULL,
  -- GDPR
  gdpr_consent BOOLEAN NOT NULL DEFAULT false,
  gdpr_consent_date TIMESTAMPTZ,
  photo_consent BOOLEAN NOT NULL DEFAULT false,
  -- Fatturazione
  billing_type billing_type,
  codice_fiscale TEXT,
  partita_iva TEXT,
  ragione_sociale TEXT,
  billing_address TEXT,
  billing_cap TEXT,
  billing_city TEXT,
  billing_province TEXT,
  sdi_code TEXT,
  pec TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_source ON contacts(source);
CREATE INDEX idx_contacts_city ON contacts(city);
CREATE INDEX idx_contacts_subscribed ON contacts(subscribed_to_mailing);

-- ========== TAGS ==========
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#E8E2DA'
);

CREATE TABLE contact_tags (
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (contact_id, tag_id)
);

-- ========== EVENTS ==========
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  venue_name TEXT,
  venue_address TEXT,
  city TEXT,
  capacity INTEGER NOT NULL DEFAULT 25,
  ticket_price_cents INTEGER NOT NULL DEFAULT 0,
  status event_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_slug ON events(slug);

-- ========== EVENT REGISTRATIONS ==========
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  status registration_status NOT NULL DEFAULT 'pending',
  dietary_requirements TEXT,
  notes TEXT,
  plus_one BOOLEAN NOT NULL DEFAULT false,
  plus_one_name TEXT,
  registration_source registration_source NOT NULL DEFAULT 'dashboard',
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  attended_at TIMESTAMPTZ,
  UNIQUE(event_id, contact_id)
);

CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_registrations_contact ON event_registrations(contact_id);
CREATE INDEX idx_registrations_status ON event_registrations(status);

-- ========== PAYMENTS ==========
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  registration_id UUID REFERENCES event_registrations(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  paypal_order_id TEXT,
  description TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_contact ON payments(contact_id);
CREATE INDEX idx_payments_event ON payments(event_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ========== ACTIVITY LOG ==========
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  description TEXT NOT NULL,
  metadata JSONB,
  performed_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_created ON activity_log(created_at DESC);
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);

-- ========== VIEWS ==========
CREATE VIEW event_registration_summary AS
SELECT
  e.id AS event_id,
  e.title,
  e.event_date,
  e.capacity,
  COUNT(er.id) AS total_registrations,
  COUNT(er.id) FILTER (WHERE er.status = 'confirmed') AS confirmed_count,
  COUNT(er.id) FILTER (WHERE er.status = 'waitlisted') AS waitlisted_count,
  COUNT(er.id) FILTER (WHERE er.status = 'attended') AS attended_count,
  COUNT(er.id) FILTER (WHERE er.status = 'cancelled') AS cancelled_count,
  COALESCE(SUM(p.amount_cents) FILTER (WHERE p.status = 'completed'), 0) AS total_revenue_cents
FROM events e
LEFT JOIN event_registrations er ON e.id = er.event_id
LEFT JOIN payments p ON e.id = p.event_id
GROUP BY e.id, e.title, e.event_date, e.capacity;

CREATE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM contacts) AS total_contacts,
  (SELECT COUNT(*) FROM contacts WHERE subscribed_to_mailing = true) AS mailing_subscribers,
  (SELECT COUNT(*) FROM events WHERE event_date >= CURRENT_DATE) AS upcoming_events,
  (SELECT COALESCE(SUM(amount_cents), 0) FROM payments WHERE status = 'completed') AS total_revenue_cents;
