-- ============================================================
-- श्री राम राज्य महायज्ञ - FIX: Add Missing Password Column
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add password column if it doesn't exist
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS password TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'registrations';
