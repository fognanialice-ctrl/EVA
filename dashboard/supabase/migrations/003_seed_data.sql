-- ============================================================================
-- 003_seed_data.sql
-- EVA Dashboard - Seed Data
-- ============================================================================

-- ============================================================================
-- TAGS
-- ============================================================================

INSERT INTO tags (name, color) VALUES
  ('VIP',          '#C67A5C'),
  ('artigiana',    '#8A9A7B'),
  ('prima-volta',  '#7A8FA6'),
  ('genova',       '#C9A84C'),
  ('amica-di',     '#C4A0A0'),
  ('partner',      '#B59A5B');

-- ============================================================================
-- FIRST EVENT
-- ============================================================================

INSERT INTO events (title, slug, event_date, start_time, end_time, venue_name, venue_address, city, capacity, ticket_price_cents, status)
VALUES (
  'La bellezza che nutre',
  'la-bellezza-che-nutre',
  '2026-03-14',
  '14:00',
  '19:00',
  'Dimora Almayer',
  '',
  'Genova',
  25,
  0,
  'draft'
);
