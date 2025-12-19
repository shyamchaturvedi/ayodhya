-- ============================================================
-- QUICK FIX: Enable UPDATE and DELETE on registrations
-- Run this in Supabase SQL Editor
-- ============================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public update registrations" ON registrations;
DROP POLICY IF EXISTS "Allow public delete registrations" ON registrations;

-- Create permissive policies
CREATE POLICY "Allow public update registrations" ON registrations 
FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow public delete registrations" ON registrations 
FOR DELETE USING (TRUE);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'registrations';
