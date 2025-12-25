-- E-commerce Sample Data
-- Use this after creating the schema

-- Clear existing data (optional - use with caution)
-- DELETE FROM order_item;
-- DELETE FROM orders;
-- DELETE FROM cart_item;
-- DELETE FROM cart;
-- DELETE FROM product;
-- DELETE FROM users;

-- Insert sample users
-- Password is 'password123' hashed with BCrypt
INSERT INTO users (name, email, password) VALUES
('John Doe', 'john@example.com', '$2a$10$aRrBR7VNiW0GRXR/9E3zCOKYTCJLq3dE7HKqvNFq8kJ2LqHJqXxCm'),
('Jane Smith', 'jane@example.com', '$2a$10$aRrBR7VNiW0GRXR/9E3zCOKYTCJLq3dE7HKqvNFq8kJ2LqHJqXxCm'),
('Mike Johnson', 'mike@example.com', '$2a$10$aRrBR7VNiW0GRXR/9E3zCOKYTCJLq3dE7HKqvNFq8kJ2LqHJqXxCm'),
('Sarah Williams', 'sarah@example.com', '$2a$10$aRrBR7VNiW0GRXR/9E3zCOKYTCJLq3dE7HKqvNFq8kJ2LqHJqXxCm');

-- Insert sample products
INSERT INTO product (name, price, stock, category, description) VALUES
('Laptop Dell XPS 15', 1299.99, 50, 'Electronics', 'High-performance laptop with 15.6 inch display'),
('iPhone 15 Pro', 999.99, 100, 'Electronics', 'Latest iPhone with A17 Pro chip'),
('Samsung Galaxy S24', 899.99, 80, 'Electronics', 'Flagship Android smartphone'),
('Sony WH-1000XM5', 349.99, 200, 'Accessories', 'Noise-cancelling wireless headphones'),
('Apple AirPods Pro', 249.99, 150, 'Accessories', 'True wireless earbuds with ANC'),
('Logitech MX Master 3', 99.99, 120, 'Accessories', 'Wireless ergonomic mouse'),
('Mechanical Keyboard RGB', 129.99, 90, 'Accessories', 'Gaming mechanical keyboard'),
('LG 27 inch Monitor', 299.99, 60, 'Electronics', '4K UHD IPS monitor'),
('Samsung 1TB SSD', 89.99, 200, 'Storage', 'High-speed NVMe SSD'),
('Webcam HD 1080p', 79.99, 100, 'Accessories', 'Full HD webcam for streaming'),
('USB-C Hub 7-in-1', 49.99, 180, 'Accessories', 'Multi-port USB-C adapter'),
('Wireless Charger', 29.99, 250, 'Accessories', 'Fast wireless charging pad'),
('Laptop Stand', 39.99, 150, 'Accessories', 'Ergonomic aluminum laptop stand'),
('Gaming Mouse Pad', 19.99, 300, 'Accessories', 'Extended RGB gaming mouse pad'),
('Portable SSD 500GB', 69.99, 120, 'Storage', 'Compact external SSD');

-- Insert sample cart for user 1
INSERT INTO cart (user_id) VALUES (1);

-- Insert cart items for user 1
INSERT INTO cart_item (product_id, quantity) VALUES
(1, 1),  -- Laptop
(4, 1),  -- Headphones
(6, 1);  -- Mouse

-- Insert sample orders
INSERT INTO orders (user_id, total_amount) VALUES
(1, 1749.97),  -- John's order
(2, 1149.98),  -- Jane's order
(3, 449.97);   -- Mike's order

-- Insert order items
-- Order 1 (John)
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1299.99),  -- Laptop
(1, 4, 1, 349.99),   -- Headphones
(1, 6, 1, 99.99);    -- Mouse

-- Order 2 (Jane)
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
(2, 2, 1, 999.99),   -- iPhone
(2, 12, 5, 29.99);   -- Wireless Chargers

-- Order 3 (Mike)
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
(3, 7, 1, 129.99),   -- Keyboard
(3, 8, 1, 299.99),   -- Monitor
(3, 14, 1, 19.99);   -- Mouse Pad
