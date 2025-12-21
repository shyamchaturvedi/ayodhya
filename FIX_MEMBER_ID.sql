-- इस स्क्रिप्ट को Supabase SQL Editor में चलाएं (Run this in Supabase SQL Editor)

-- 1. जिस यूजर की ID गलत (RR-2026-4021) है, उसे सही (RRY-2026/9011/001) करें
UPDATE registrations 
SET member_id = 'RRY-2026/9011/001', 
    payment_status = 'verified' 
WHERE member_id = 'RR-2026-4021';

-- वेरिफिकेशन के लिए: यह देखने के लिए कि अपडेट हुआ या नहीं
SELECT * FROM registrations WHERE member_id = 'RRY-2026/9011/001';
