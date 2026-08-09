-- ============================================================
-- DIGITAL CARBON AUDITOR
-- SUPABASE / POSTGRESQL DATABASE SCHEMA
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- SCANS
-- ============================================================

CREATE TABLE IF NOT EXISTS scans (
    id SERIAL PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    scanned_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP,

    total_files INTEGER DEFAULT 0,

    total_size BIGINT DEFAULT 0,

    waste_files INTEGER DEFAULT 0,

    waste_size BIGINT DEFAULT 0,

    duplicate_files INTEGER DEFAULT 0,

    duplicate_size BIGINT DEFAULT 0
);


-- ============================================================
-- SCAN RESULTS
-- ============================================================

CREATE TABLE IF NOT EXISTS scan_results (
    id SERIAL PRIMARY KEY,

    scan_id INTEGER NOT NULL
        REFERENCES scans(id)
        ON DELETE CASCADE,

    file_name TEXT NOT NULL,

    file_type VARCHAR(100),

    file_size BIGINT DEFAULT 0,

    category VARCHAR(100),

    reason TEXT,

    is_duplicate BOOLEAN DEFAULT FALSE,

    is_deletable BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- CLEANUP HISTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS cleanup_history (
    id SERIAL PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    scan_id INTEGER
        REFERENCES scans(id)
        ON DELETE SET NULL,

    cleaned_files INTEGER DEFAULT 0,

    cleaned_size BIGINT DEFAULT 0,

    estimated_carbon_saved DECIMAL(12,4) DEFAULT 0,

    cleaned_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_scans_user_id
ON scans(user_id);


CREATE INDEX IF NOT EXISTS idx_scan_results_scan_id
ON scan_results(scan_id);


CREATE INDEX IF NOT EXISTS idx_cleanup_history_user_id
ON cleanup_history(user_id);


-- ============================================================
-- CHECK CONSTRAINTS
-- ============================================================

ALTER TABLE scans
DROP CONSTRAINT IF EXISTS scans_total_files_check;

ALTER TABLE scans
ADD CONSTRAINT scans_total_files_check
CHECK (total_files >= 0);


ALTER TABLE scans
DROP CONSTRAINT IF EXISTS scans_total_size_check;

ALTER TABLE scans
ADD CONSTRAINT scans_total_size_check
CHECK (total_size >= 0);


ALTER TABLE scans
DROP CONSTRAINT IF EXISTS scans_waste_files_check;

ALTER TABLE scans
ADD CONSTRAINT scans_waste_files_check
CHECK (waste_files >= 0);


ALTER TABLE scans
DROP CONSTRAINT IF EXISTS scans_waste_size_check;

ALTER TABLE scans
ADD CONSTRAINT scans_waste_size_check
CHECK (waste_size >= 0);


ALTER TABLE scans
DROP CONSTRAINT IF EXISTS scans_duplicate_files_check;

ALTER TABLE scans
ADD CONSTRAINT scans_duplicate_files_check
CHECK (duplicate_files >= 0);


ALTER TABLE scans
DROP CONSTRAINT IF EXISTS scans_duplicate_size_check;

ALTER TABLE scans
ADD CONSTRAINT scans_duplicate_size_check
CHECK (duplicate_size >= 0);


ALTER TABLE scan_results
DROP CONSTRAINT IF EXISTS scan_results_file_size_check;

ALTER TABLE scan_results
ADD CONSTRAINT scan_results_file_size_check
CHECK (file_size >= 0);


ALTER TABLE cleanup_history
DROP CONSTRAINT IF EXISTS cleanup_history_cleaned_files_check;

ALTER TABLE cleanup_history
ADD CONSTRAINT cleanup_history_cleaned_files_check
CHECK (cleaned_files >= 0);


ALTER TABLE cleanup_history
DROP CONSTRAINT IF EXISTS cleanup_history_cleaned_size_check;

ALTER TABLE cleanup_history
ADD CONSTRAINT cleanup_history_cleaned_size_check
CHECK (cleaned_size >= 0);


ALTER TABLE cleanup_history
DROP CONSTRAINT IF EXISTS cleanup_history_carbon_check;

ALTER TABLE cleanup_history
ADD CONSTRAINT cleanup_history_carbon_check
CHECK (estimated_carbon_saved >= 0);