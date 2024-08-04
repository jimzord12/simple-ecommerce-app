-- Create ENUM type for product categories
CREATE TYPE product_category AS ENUM ('clothing', 'electronic_devices', 'houseware', 'toys', 'books', 'sports');

-- Create ENUM type for order statuses
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'shipped', 'cancelled', 'returned');

-- Create table for customers
CREATE TABLE customers (
    customer_id serial PRIMARY KEY,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(32) NOT NULL CHECK (char_length(password) >= 8 AND char_length(password) <= 32),
    created_at timestamp NOT NULL DEFAULT current_timestamp
);

-- Create table for products
CREATE TABLE products (
    product_id serial PRIMARY KEY,
    product_name varchar(255) NOT NULL,
    category product_category NOT NULL,
    description text,
    price numeric(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity integer NOT NULL CHECK (stock_quantity >= 0)
);

-- Create table for orders
CREATE TABLE orders (
    order_id serial PRIMARY KEY,
    customer_id integer NOT NULL REFERENCES customers(customer_id),
    order_date timestamp NOT NULL DEFAULT current_timestamp,
    status order_status NOT NULL DEFAULT 'pending'
);

-- Create table for order items
CREATE TABLE order_items (
    order_item_id serial PRIMARY KEY,
    order_id integer NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id integer NOT NULL REFERENCES products(product_id),
    quantity integer NOT NULL CHECK (quantity > 0),
    price numeric(10, 2) NOT NULL CHECK (price >= 0)
);

-- Insert sample data into the tables
-- Insert sample customers
INSERT INTO customers (first_name, last_name, email, password)
VALUES ('John', 'Doe', 'john.doe@example.com', 'securepassword123'),
       ('Jane', 'Smith', 'jane.smith@example.com', 'anotherpassword321');

-- Insert sample products
INSERT INTO products (product_name, category, description, price, stock_quantity)
VALUES ('Laptop', 'electronic_devices', 'High performance laptop', 999.99, 50),
       ('T-shirt', 'clothing', 'Cotton T-shirt', 19.99, 100),
       ('Blender', 'houseware', 'Powerful kitchen blender', 49.99, 30);

-- Insert a sample order
INSERT INTO orders (customer_id, status)
VALUES (1, 'completed');

-- Add items to the sample order
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (1, 1, 1, 999.99),
       (1, 2, 2, 19.99);
