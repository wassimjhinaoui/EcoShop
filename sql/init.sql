-- Create Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified DATETIME,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Accounts Table
CREATE TABLE accounts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(255),
    provider VARCHAR(255),
    provider_account_id VARCHAR(255),
    refresh_token TEXT,
    access_token TEXT,
    expires_at INT,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    UNIQUE KEY provider_unique (provider, provider_account_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Sessions Table
CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    expires DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Verification Tokens Table
CREATE TABLE verification_tokens (
    identifier VARCHAR(255),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires DATETIME NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- Insert Mock Users (use bcrypt hashed passwords)
-- Passwords are 'password123' for all users
INSERT INTO users (id, name, email, password, email_verified) VALUES 
('user1', 'John Doe', 'john@example.com', '$2y$10$B.jdYDL5VnpuYfHRffhn2eLGaALS18AaM0OwA.VnZpO5XSVsn7/H2', NOW()),
('user2', 'Jane Smith', 'jane@example.com', '$2y$10$B.jdYDL5VnpuYfHRffhn2eLGaALS18AaM0OwA.VnZpO5XSVsn7/H2', NOW()),
('user3', 'Lased Bliss', 'ssecritou@gmail.com', '$2y$10$0wGffNp6ioAkfgRHaOy5heprlJ0lx2grCf1DfwsDc819U5EkTUAIS', NOW());

-- Categories Table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_category_id VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Products Table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id VARCHAR(36),
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Product Variants Table (for size, color, etc.)
CREATE TABLE product_variants (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    variant_name VARCHAR(100),
    additional_price DECIMAL(10, 2) DEFAULT 0,
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    billing_address TEXT,
    payment_method VARCHAR(100),
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    variant_id VARCHAR(36),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- Cart Table
CREATE TABLE cart (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    variant_id VARCHAR(36),
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    UNIQUE KEY unique_cart_item (user_id, product_id, variant_id)
);

-- Reviews Table
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Wishlist Table
CREATE TABLE wishlist (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_item (user_id, product_id)
);

-- Discount Codes Table
CREATE TABLE discount_codes (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase_amount DECIMAL(10, 2),
    start_date DATETIME,
    end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mock Data Insertion

-- Insert Categories
INSERT INTO categories (id, name, description) VALUES
('cat1', 'Electronics', 'Latest electronic gadgets and accessories'),
('cat2', 'Audio', 'High-quality audio equipment'),
('cat3', 'Wearables', 'Smart wearable technology');

-- Insert Products
INSERT INTO products (id, name, description, price, category_id, stock_quantity, image_url, is_featured) VALUES
('prod1', 'Premium Headphones', 'High-quality wireless headphones with noise cancellation', 199.99, 'cat2', 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', TRUE),
('prod2', 'Smart Watch', 'Feature-rich smartwatch with health tracking', 299.99, 'cat3', 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', TRUE),
('prod3', 'Wireless Earbuds', 'True wireless earbuds with premium sound quality', 149.99, 'cat2', 75, 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&q=80', FALSE);

-- Insert Product Variants
INSERT INTO product_variants (id, product_id, variant_name, additional_price, stock_quantity) VALUES
('var1', 'prod1', 'Black', 0, 30),
('var2', 'prod1', 'White', 10, 20),
('var3', 'prod2', 'Small', 0, 15),
('var4', 'prod2', 'Large', 20, 15);

-- Insert Discount Codes
INSERT INTO discount_codes (id, code, description, discount_type, discount_value, min_purchase_amount, start_date, end_date) VALUES
('disc1', 'SUMMER20', 'Summer Sale 20% Off', 'percentage', 20, 100, '2024-06-01', '2024-08-31'),
('disc2', 'WELCOME10', 'New Customer $10 Off', 'fixed_amount', 10, 50, NULL, NULL);

INSERT INTO products (id, name, description, price, category_id, stock_quantity, image_url, is_featured) VALUES
('prod4', '4K Smart TV', 'Ultra HD Smart TV with HDR and built-in streaming apps', 599.99, 'cat1', 20, 'https://www.samsungshop.tn/6878-large_default/75-mu7000-uhd-4k-smart-tv.jpg', TRUE),
('prod5', 'Noise-Canceling Bluetooth Speaker', 'Portable wireless speaker with 360-degree sound', 129.99, 'cat1', 40, 'https://m.media-amazon.com/images/I/7143p+p1uGL._AC_UF1000,1000_QL80_.jpg', FALSE),
('prod6', 'Wireless Charging Pad', 'Fast-charging multi-device wireless charger', 49.99, 'cat1', 60, 'https://images.unsplash.com/photo-1615228402326-7adf9a257f2b?w=500&q=80', FALSE);
-- Additional Audio Products
INSERT INTO products (id, name, description, price, category_id, stock_quantity, image_url, is_featured) VALUES
('prod7', 'Studio Monitor Speakers', 'Professional-grade studio monitor speakers for audiophiles', 399.99, 'cat2', 15, 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=500&q=80', TRUE),
('prod8', 'Portable Digital Recorder', 'High-quality portable audio recorder for musicians and podcasters', 249.99, 'cat2', 25, 'https://m.media-amazon.com/images/I/61SKTSzL2tL.jpg', FALSE);
-- Additional Wearables Products
INSERT INTO products (id, name, description, price, category_id, stock_quantity, image_url, is_featured) VALUES
('prod9', 'Fitness Tracker Band', 'Advanced fitness tracker with heart rate and sleep monitoring', 89.99, 'cat3', 45, 'https://www.jointcorp.com/data/watermark/20230720/64b90f26759b6_.webp', FALSE),
('prod10', 'Smart Glasses', 'Augmented reality glasses with built-in camera and navigation', 449.99, 'cat3', 10, 'https://www.xrtoday.com/wp-content/uploads/2022/02/Top_6_Reasons_Buy_AR_Smart_Glasses_2022.jpg', TRUE);
-- Product Variants for New Products
INSERT INTO product_variants (id, product_id, variant_name, additional_price, stock_quantity) VALUES
('var5', 'prod4', '55-inch', 0, 10),
('var6', 'prod4', '65-inch', 200, 10),
('var7', 'prod5', 'Black', 0, 20),
('var8', 'prod5', 'Blue', 10, 20),
('var9', 'prod6', 'White', 0, 30),
('var10', 'prod6', 'Black', 0, 30),
('var11', 'prod7', 'Pair', 0, 10),
('var12', 'prod8', 'Standard', 0, 15),
('var13', 'prod9', 'Small', 0, 15),
('var14', 'prod9', 'Large', 0, 30),
('var15', 'prod10', 'Black Frame', 0, 5),
('var16', 'prod10', 'Silver Frame', 20, 5);
-- Additional Discount Codes
INSERT INTO discount_codes (id, code, description, discount_type, discount_value, min_purchase_amount, start_date, end_date) VALUES
('disc3', 'TECH25', 'Electronics Sale 25% Off', 'percentage', 25, 250, '2024-07-01', '2024-09-30'),
('disc4', 'AUDIO15', '$15 Off Audio Products', 'fixed_amount', 15, 150, '2024-05-01', '2024-12-31');
