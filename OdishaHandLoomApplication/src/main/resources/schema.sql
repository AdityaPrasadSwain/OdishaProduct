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
