-- Add coordinate columns to shipments table
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS shipping_latitude DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS shipping_longitude DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS seller_latitude DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS seller_longitude DOUBLE PRECISION;
