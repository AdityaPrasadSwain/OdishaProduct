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
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS edited BOOLEAN DEFAULT FALSE;
