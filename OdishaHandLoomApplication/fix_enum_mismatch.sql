-- 1. Detach agents from shipments (Since the concept is removed)
UPDATE shipments SET agent_id = NULL WHERE agent_id IS NOT NULL;

-- 2. Update invalid Roles in users table
-- Replace DELIVERY_AGENT with CUSTOMER
UPDATE users 
SET role = 'CUSTOMER' 
WHERE role = 'DELIVERY_AGENT';

-- 3. Verify clean state (Should return 0 rows)
SELECT id, role FROM users WHERE role = 'DELIVERY_AGENT';

-- 4. Double check for any other potential enum issues (Optional but good practice)
-- List distinct roles to ensure only ADMIN, SELLER, CUSTOMER exist
SELECT DISTINCT role FROM users;
