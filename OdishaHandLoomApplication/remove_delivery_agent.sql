-- Migration Script: Remove DELIVERY_AGENT Role
-- 1. Update existing DELIVERY_AGENT users to be normal CUSTOMERs (or delete them if preferred, but updating is safer)
UPDATE users 
SET role = 'CUSTOMER' 
WHERE role = 'DELIVERY_AGENT';

-- 2. Verify no DELIVERY_AGENT roles remain
SELECT count(*) FROM users WHERE role = 'DELIVERY_AGENT';

-- 3. (Optional) If there is a check constraint on the role column, drop and recreate it
-- Check for constraint
-- SELECT conname FROM pg_constraint WHERE conrelid = 'users'::regclass AND contype = 'c';
-- ALTER TABLE users DROP CONSTRAINT <constraint_name>;
-- ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('ADMIN', 'SELLER', 'CUSTOMER'));
