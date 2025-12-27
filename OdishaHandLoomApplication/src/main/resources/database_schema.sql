-- Database Schema for Odisha Handloom Application
-- Generated based on JPA Entities

-- Drop tables if they exist to prevent conflicts during import/execution
DROP TABLE IF EXISTS seller_earnings CASCADE;
DROP TABLE IF EXISTS return_requests_v3 CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS seller_followers CASCADE;
DROP TABLE IF EXISTS reel_likes CASCADE;
DROP TABLE IF EXISTS reel_comments CASCADE;
DROP TABLE IF EXISTS review_images CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS wishlist_products CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS seller_kyc CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(255),
    role VARCHAR(50) NOT NULL, -- Enum: ADMIN, SELLER, CUSTOMER
    address TEXT,
    profile_picture_url VARCHAR(255),
    bio TEXT,
    gender VARCHAR(50),
    gst_number VARCHAR(255),
    shop_name VARCHAR(255),
    is_approved BOOLEAN,
    is_blocked BOOLEAN,
    pan_number VARCHAR(255),
    bank_account_number VARCHAR(255),
    ifsc_code VARCHAR(255),
    bank_name VARCHAR(255),
    account_holder_name VARCHAR(255),
    is_bank_verified BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(255),
    country VARCHAR(255),
    is_default BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE seller_kyc (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    pan_masked VARCHAR(255),
    pan_verified BOOLEAN DEFAULT FALSE,
    aadhaar_masked VARCHAR(255),
    aadhaar_verified BOOLEAN DEFAULT FALSE,
    gstin VARCHAR(255),
    gst_verified BOOLEAN DEFAULT FALSE,
    kyc_status VARCHAR(50) NOT NULL,
    rejection_reason VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    price DECIMAL(19, 2) NOT NULL,
    discount_price DECIMAL(19, 2),
    stock_quantity INT,
    material VARCHAR(255),
    color VARCHAR(255),
    size VARCHAR(255),
    origin VARCHAR(255),
    pack_of VARCHAR(255),
    reel_url VARCHAR(255),
    reel_caption TEXT,
    category_id UUID,
    seller_id UUID NOT NULL,
    is_approved BOOLEAN,
    average_rating DOUBLE PRECISION DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE product_images (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    position INT,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    seller_id UUID NOT NULL,
    total_amount DECIMAL(19, 2) NOT NULL,
    status VARCHAR(50),
    shipping_address TEXT,
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    address_id UUID,
    courier_name VARCHAR(255),
    tracking_id VARCHAR(255),
    invoice_sent BOOLEAN DEFAULT FALSE,
    invoice_sent_at TIMESTAMP,
    invoice_number VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INT,
    price DECIMAL(19, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE payments (
    id UUID PRIMARY KEY,
    seller_id UUID NOT NULL,
    amount DECIMAL(19, 2),
    status VARCHAR(50),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE carts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    total_amount DECIMAL(19, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY,
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INT,
    price DECIMAL(19, 2),
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE wishlists (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE wishlist_products (
    wishlist_id UUID NOT NULL,
    product_id UUID NOT NULL,
    PRIMARY KEY (wishlist_id, product_id),
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
    order_item_id UUID NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    rating INT NOT NULL,
    review_text VARCHAR(1000),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (order_item_id) REFERENCES order_items(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE review_images (
    id UUID PRIMARY KEY,
    review_id UUID NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (review_id) REFERENCES reviews(id)
);

CREATE TABLE reel_comments (
    id UUID PRIMARY KEY,
    reel_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content VARCHAR(1000) NOT NULL,
    parent_id UUID,
    seller_response BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    FOREIGN KEY (reel_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES reel_comments(id)
);

CREATE TABLE reel_likes (
    id UUID PRIMARY KEY,
    reel_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP,
    UNIQUE (reel_id, user_id),
    FOREIGN KEY (reel_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE seller_followers (
    id UUID PRIMARY KEY,
    seller_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP,
    UNIQUE (seller_id, user_id),
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL, -- Recipient
    sender_id UUID,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    order_id UUID,
    reel_id UUID,
    comment_id UUID,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY,
    user_id UUID,
    user_role VARCHAR(50) NOT NULL,
    is_active BOOLEAN,
    current_intent VARCHAR(255),
    current_step_id VARCHAR(255),
    selected_order_id UUID,
    created_at TIMESTAMP
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL,
    sender VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    options TEXT,
    payload TEXT,
    sent_at TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
);

CREATE TABLE return_requests_v3 (
    id UUID PRIMARY KEY,
    order_item_id UUID UNIQUE,
    customer_id UUID,
    seller_id UUID,
    reason VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    req_type VARCHAR(50) NOT NULL, -- REFUND, REPLACEMENT
    req_status VARCHAR(50) NOT NULL, -- PENDING, APPROVED, etc.
    proof_image_url VARCHAR(255),
    seller_remarks VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE seller_earnings (
    id UUID PRIMARY KEY,
    seller_id UUID NOT NULL,
    order_id UUID NOT NULL,
    order_item_id UUID NOT NULL UNIQUE,
    gross_amount DECIMAL(19, 2) NOT NULL,
    commission DECIMAL(19, 2) NOT NULL,
    gst_amount DECIMAL(19, 2) NOT NULL,
    net_amount DECIMAL(19, 2) NOT NULL,
    payout_status VARCHAR(50) NOT NULL,
    payout_id UUID,
    created_at TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (order_item_id) REFERENCES order_items(id)
);
