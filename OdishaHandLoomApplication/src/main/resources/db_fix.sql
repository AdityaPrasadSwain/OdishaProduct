-- Comprehensive Fix for is_out_of_stock Column

-- 1. Add the column if it doesn't exist (Idempotent check not standard SQL, running blindly is safe if done once)
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS is_out_of_stock BOOLEAN DEFAULT FALSE; 
-- Note: 'IF NOT EXISTS' might not work in older Postgres without a block. 
-- Assuming column might exist but data is bad.

-- 2. Update existing NULL values to FALSE
UPDATE products
SET is_out_of_stock = FALSE
WHERE is_out_of_stock IS NULL;

-- 3. Sync existing data based on stock quantity (Critical)
UPDATE products
SET is_out_of_stock = CASE
    WHEN stock_quantity <= 0 THEN TRUE
    ELSE FALSE
END;

-- 4. Enforce Default Value
ALTER TABLE products
ALTER COLUMN is_out_of_stock SET DEFAULT FALSE;

-- 5. Enforce NOT NULL Constraint (Safe now that data is fixed)
ALTER TABLE products
ALTER COLUMN is_out_of_stock SET NOT NULL;
