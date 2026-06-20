-- ==============================================================================
-- Database Performance Optimization: Indexing Strategy
-- Target: PostgreSQL / MySQL
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. FOREIGN KEY INDEXES (Optimizes JOINs and WHERE fk_id = ?)
-- ------------------------------------------------------------------------------

-- Users & Addresses
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);

-- Order Items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_seller_id ON payments(seller_id);

-- Shipments
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_agent_id ON shipments(agent_id);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- ------------------------------------------------------------------------------
-- 2. FREQUENTLY SEARCHED COLUMNS (Optimizes WHERE clauses)
-- ------------------------------------------------------------------------------

-- Users (Unique Identifiers)
-- Note: UNIQUE constraints implicitly create an index, but we explicitly define them here if not already unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_shop_name ON users(shop_name);
CREATE INDEX IF NOT EXISTS idx_users_pan ON users(pan_number);
CREATE INDEX IF NOT EXISTS idx_users_gst ON users(gst_number);

-- Orders
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_tracking_id ON orders(tracking_id);

-- Shipment Barcodes
CREATE UNIQUE INDEX IF NOT EXISTS idx_shipment_barcodes_val ON shipments_barcodes(barcode_value);

-- Coupons
CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- ------------------------------------------------------------------------------
-- 3. COMPOSITE INDEXES (Optimizes multi-column WHERE and ORDER BY)
-- ------------------------------------------------------------------------------

-- Payments: findBySellerAndStatus
CREATE INDEX IF NOT EXISTS idx_payments_seller_status ON payments(seller_id, status);

-- Orders: findByUserIdAndCreatedAtAfter
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at);

-- Shipments: countByAgentIdAndStatus
CREATE INDEX IF NOT EXISTS idx_shipments_agent_status ON shipments(agent_id, status);

-- ------------------------------------------------------------------------------
-- END OF SCRIPT
-- ------------------------------------------------------------------------------
