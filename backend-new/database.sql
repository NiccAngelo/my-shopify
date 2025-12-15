-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(500),
    category VARCHAR(100),
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create Cart Table
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Insert Sample Products
INSERT INTO products (name, description, price, image, category, stock) VALUES
('Classic White T-Shirt', 'Premium cotton t-shirt with a classic fit', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'Clothing', 50),
('Denim Jeans', 'Comfortable stretch denim jeans', 79.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 'Clothing', 30),
('Leather Sneakers', 'Handcrafted leather sneakers', 129.99, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', 'Shoes', 20),
('Cotton Hoodie', 'Cozy fleece-lined hoodie', 59.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 'Clothing', 40),
('Canvas Backpack', 'Durable canvas backpack with laptop sleeve', 49.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'Accessories', 25),
('Sports Watch', 'Water-resistant sports watch', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'Accessories', 15);