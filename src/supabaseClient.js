
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kxkifhcpombomfkderhk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a2lmaGNwb21ib21ma2RlcmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzAwMDEsImV4cCI6MjA4MTY0NjAwMX0.xMF-bytbQr095km5-SD4mqTinATZ5-Ov-sVkqQNZJtw';

export const supabase = createClient(supabaseUrl, supabaseKey);
