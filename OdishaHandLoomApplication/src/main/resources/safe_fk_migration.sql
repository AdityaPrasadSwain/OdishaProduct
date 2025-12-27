-- Safe Migration Script for ReturnRequest Foreign Key
-- Run this script manually in your PostgreSQL database

-- 1. Detect invalid references (Verification Step)
-- Run this first to see what will be deleted
/*
SELECT r.id, r.order_id
FROM return_requests r
LEFT JOIN orders o ON r.order_id = o.id
WHERE o.id IS NULL;
*/

-- 2. Clean invalid rows
-- Since the application enforces strict data integrity (order cannot be null), 
-- we delete orphan return requests that reference non-existent orders.
DELETE FROM return_requests
WHERE order_id IS NOT NULL 
AND order_id NOT IN (SELECT id FROM orders);

-- 3. Add the Constraint
-- This adds a strict Foreign Key constraint. 
-- Note: Cascading is NOT enabled, as per requirements.
ALTER TABLE return_requests
ADD CONSTRAINT fk_return_order
FOREIGN KEY (order_id) 
REFERENCES orders(id);

-- 4. Verification
-- Ensure the constraint exists
-- SELECT conname FROM pg_constraint WHERE conname = 'fk_return_order';
