-- Use this query to inspect the latest OTPs generated for a specific email.
-- Replace 'user@email.com' with the email you are testing.

SELECT 
    email, 
    otp, 
    used, 
    attempt_count, 
    expiry_time, 
    created_at 
FROM otps 
WHERE email = 'swainaditya650@gmail.com' -- Replace with your test email
ORDER BY created_at DESC;
