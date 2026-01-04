CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    sender_id UUID,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    order_id UUID,
    reel_id UUID,
    comment_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Manual migration for invoice feature if Hibernate update fails
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(255);


-- Migration for Category Image Upload feature (Fixing "column active does not exist" error)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

-- Migration for Review Edit feature

-- Migration for Shipments Status Constraint (Fixing "shipments_status_check" violation)
ALTER TABLE shipments DROP CONSTRAINT IF EXISTS shipments_status_check;
ALTER TABLE shipments ADD CONSTRAINT shipments_status_check 
CHECK (status IN (
    'CREATED', 'ASSIGNED', 'PACKED', 'READY_TO_SHIP', 'DISPATCHED', 'IN_TRANSIT', 
    'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'RTO_INITIATED', 
    'RTO_COMPLETED', 'RETURN_REQUESTED', 'RETURN_APPROVED', 
    'PICKUP_INITIATED', 'PICKUP_COMPLETED', 'RETURN_IN_TRANSIT', 
    'RETURN_DELIVERED', 'REFUND_PROCESSED', 'COD_PENDING',
    'COD_COLLECTED', 'COD_SETTLED'
));

-- Logistics: Shipment Payments
CREATE TABLE IF NOT EXISTS shipment_payments (
    id UUID PRIMARY KEY,
    shipment_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL DEFAULT 'UPI_QR',
    status VARCHAR(50) NOT NULL,
    transaction_ref VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logistics: Agent Earnings
CREATE TABLE IF NOT EXISTS agent_earnings (
    id UUID PRIMARY KEY,
    agent_id UUID NOT NULL,
    shipment_id UUID NOT NULL,
    distance_km DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logistics: Shipment Failures
CREATE TABLE IF NOT EXISTS shipment_failures (
    id UUID PRIMARY KEY,
    shipment_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    reason VARCHAR(500) NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logistics: Add Coordinates to Shipments
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS shipping_latitude DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS shipping_longitude DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS seller_latitude DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS seller_longitude DOUBLE PRECISION;

-- Migration for Orders Status Constraint (Fixing "orders_status_check" violation)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
CHECK (status IN (
    'PENDING', 'CONFIRMED', 'SELLER_CONFIRMED', 'PACKED', 'READY_TO_SHIP', 
    'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 
    'DELIVERY_FAILED', 'RETURN_REQUESTED', 'RETURNED', 'REPLACED', 
    'REPLACEMENT_REQUESTED', 'ORDER_CANCELLED_BY_SELLER', 'CANCELLED', 
    'RTO_INITIATED', 'RTO_COMPLETED', 'INVOICE_SENT', 'SHIPPED'
));
