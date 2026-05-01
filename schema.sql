-- =============================================================================
--  ROSEWELL HEALTH — SUPABASE SCHEMA
--  Copy and paste this entire file into:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================================


-- 1. DEPARTMENTS / SERVICES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS departments (
    id                SERIAL PRIMARY KEY,
    code              TEXT UNIQUE NOT NULL,
    name              TEXT NOT NULL,
    description       TEXT,
    clinician         TEXT,
    fee               NUMERIC(10, 2),
    available_windows TEXT
);


-- 2. APPOINTMENTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS appointments (
    id                 SERIAL PRIMARY KEY,
    patient_name       TEXT NOT NULL,
    patient_email      TEXT NOT NULL,
    service_code       TEXT NOT NULL,
    appointment_date   TEXT NOT NULL,
    sessions_requested INTEGER DEFAULT 1,
    transaction_id     TEXT,
    created_at         TIMESTAMPTZ DEFAULT NOW()
);


-- 3. SEED DEPARTMENTS (default clinic services)
--    Safe to run multiple times — skips if code already exists
-- =============================================================================
INSERT INTO departments (code, name, description, clinician, fee, available_windows)
VALUES
    (
        'WELLNESS',
        'Wellness Consultation',
        'General wellness assessments and preventive care for all age groups.',
        'Dr. Maria Santos',
        1500.00,
        'Mon–Fri  8:00 AM – 5:00 PM'
    ),
    (
        'PEDIATRICS',
        'Pediatrics Visit',
        'Child health services including check-ups, immunizations, and developmental reviews.',
        'Dr. James Reyes',
        1200.00,
        'Mon–Sat  9:00 AM – 4:00 PM'
    ),
    (
        'CARDIOLOGY',
        'Cardiology Review',
        'Heart health evaluations, ECG readings, and cardiovascular risk assessments.',
        'Dr. Elena Cruz',
        2500.00,
        'Tue–Thu  10:00 AM – 3:00 PM'
    ),
    (
        'WOMENS_HEALTH',
        'Women''s Health Consultation',
        'OB-GYN consultations, reproductive health screenings, and prenatal guidance.',
        'Dr. Sofia Lim',
        1800.00,
        'Mon–Fri  9:00 AM – 5:00 PM'
    )
ON CONFLICT (code) DO NOTHING;


-- =============================================================================
--  DONE. You should now see:
--  • departments table  (4 rows seeded)
--  • appointments table (empty — filled when users book)
-- =============================================================================
