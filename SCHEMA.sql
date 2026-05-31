-- ShorterWait — Supabase Schema
-- Run this in your Supabase SQL editor to set up the database

-- ============================================================
-- WAIT TIMES (core data table — one row per hospital+specialty)
-- Updated weekly from myplannedcare.nhs.uk scraper
-- ============================================================
CREATE TABLE IF NOT EXISTS wait_times (
  id               BIGSERIAL PRIMARY KEY,
  hospital_name    TEXT NOT NULL,
  hospital_url     TEXT NOT NULL,
  region           TEXT NOT NULL,   -- london | nwest | ney | mids | east | seast | swest
  specialty        TEXT NOT NULL,   -- exact NHS name e.g. "Ear, Nose and Throat"
  outpatient_avg   NUMERIC(5,1),    -- avg weeks to first outpatient appointment
  outpatient_8in10 NUMERIC(5,1),    -- 8-in-10 weeks to first outpatient appointment
  treatment_avg    NUMERIC(5,1),    -- avg weeks to treatment
  treatment_8in10  NUMERIC(5,1),    -- 8-in-10 weeks to treatment
  last_updated     TEXT,            -- date string from NHS page e.g. "29 May 2026"
  scraped_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wait_specialty ON wait_times(specialty);
CREATE INDEX IF NOT EXISTS idx_wait_region    ON wait_times(region);
CREATE INDEX IF NOT EXISTS idx_wait_treatment ON wait_times(treatment_avg);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT UNIQUE NOT NULL,
  postcode   TEXT,
  tier       TEXT NOT NULL DEFAULT 'free', -- free | trial | monthly | lifetime
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ALERTS (weekly email when wait times change)
-- ============================================================
CREATE TABLE IF NOT EXISTS alerts (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialty  TEXT NOT NULL,   -- must match NHS specialty name exactly
  region     TEXT,            -- optional region filter
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);

-- ============================================================
-- GP TIPS (editorial content)
-- ============================================================
CREATE TABLE IF NOT EXISTS tips (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SPECIALTY DISPLAY MAP
-- Maps frontend dropdown labels → exact NHS specialty names
-- ============================================================
CREATE TABLE IF NOT EXISTS specialty_map (
  display_name TEXT PRIMARY KEY,  -- shown in dropdown e.g. "ENT"
  nhs_name     TEXT NOT NULL      -- exact match in wait_times table
);

INSERT INTO specialty_map (display_name, nhs_name) VALUES
  ('Orthopaedics',   'Orthopaedics'),
  ('Ophthalmology',  'Ophthalmology'),
  ('Cardiology',     'Cardiology'),
  ('Urology',        'Urology'),
  ('Dermatology',    'Dermatology'),
  ('General Surgery','General Surgery'),
  ('Ear, Nose and Throat', 'Ear, Nose and Throat'),
  ('Gynaecology',    'Gynaecology'),
  ('Neurology',      'Neurology'),
  ('Rheumatology',   'Rheumatology'),
  ('Gastroenterology','Gastroenterology'),
  ('Pain Management','Pain Management'),
  ('Spinal Surgery', 'Spinal Surgery'),
  ('Respiratory',    'Respiratory'),
  ('Rheumatology',   'Rheumatology')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED GP TIPS
-- ============================================================
INSERT INTO tips (title, content, display_order) VALUES
  ('You have a legal right to choose your hospital',
   'Under the NHS Constitution and the NHS e-Referral Service, you have the right to choose any NHS or independent sector provider for your first outpatient appointment. Your GP must offer you at least five choices. Most patients are never told this.',
   1),
  ('Ask your GP to use NHS e-Referral Service',
   'When your GP refers you, they should use the NHS e-Referral Service (NHS e-RS, formerly Choose and Book). This lets you pick your provider and appointment time online. If they book directly without giving you a choice, you can ask them to re-refer via e-RS.',
   2),
  ('Shorter waits are often just 13 miles away',
   'NHS data shows the average extra distance to access a significantly shorter wait is just 13 miles. A hospital in the next town may have a wait that is 10-14 weeks shorter for the same procedure.',
   3),
  ('Independent sector providers count too',
   'The NHS commissions many independent (private) hospitals to treat NHS patients at no cost to you. These often have shorter waits and high patient satisfaction scores. They appear on e-RS alongside NHS trusts.',
   4),
  ('Your GP can write a referral letter to any provider',
   'If your preferred hospital is not on e-RS, your GP can write a direct referral letter. This is less common but you are entitled to request it. Bring the hospital name and consultant details if you have them.',
   5)
ON CONFLICT DO NOTHING;
