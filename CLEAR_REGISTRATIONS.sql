/*
  --- DATABASE RESET COMMAND (UPDATED) ---

  Updates: Added CASCADE to handle linked tables like 'sankalp'.
  
  Use this command in your Supabase Dashboard > SQL Editor:
*/

TRUNCATE TABLE registrations CASCADE;

/* 
   Note: This will delete data from 'registrations' AND 'sankalp' tables.
   The sequence will restart from 001.
*/
