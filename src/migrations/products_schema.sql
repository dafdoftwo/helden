-- Schema for Helden e-commerce store
-- This SQL file is used to create the necessary tables in Supabase

-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(category_id, name)
);

CREATE INDEX idx_subcategories_slug ON subcategories(slug);
CREATE INDEX idx_subcategories_category ON subcategories(category_id);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE SET NULL,
  main_image TEXT NOT NULL,
  additional_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  seo_title VARCHAR(255),
  seo_description TEXT,
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  sku VARCHAR(50) UNIQUE
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_is_new ON products(is_new);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  checkout_session_id VARCHAR(255),
  coupon_code VARCHAR(50),
  discount_amount DECIMAL(10, 2) DEFAULT 0
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  color VARCHAR(50),
  size VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlists (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_wishlists_product ON wishlists(product_id);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(10, 2) DEFAULT 0,
  max_discount DECIMAL(10, 2),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);

-- Create RLS policies for security
-- Products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Products are editable by admins" 
ON products FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.users.role = 'admin'
  )
);

-- Orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" 
ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Orders are viewable by admins" 
ON orders FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.users.role = 'admin'
  )
);

CREATE POLICY "Orders are editable by admins" 
ON orders FOR UPDATE USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.users.role = 'admin'
  )
);

-- Wishlists table
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlists" 
ON wishlists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own wishlists" 
ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlists" 
ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- Product reviews table
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" 
ON product_reviews FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Users can insert their own reviews" 
ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON product_reviews FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_categories_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_subcategories_timestamp
BEFORE UPDATE ON subcategories
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_coupons_timestamp
BEFORE UPDATE ON coupons
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_reviews_timestamp
BEFORE UPDATE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create function to calculate product rating
CREATE OR REPLACE FUNCTION calculate_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the products table with the new average rating
  UPDATE products
  SET avg_rating = (
    SELECT AVG(rating)
    FROM product_reviews
    WHERE product_id = NEW.product_id
    AND is_visible = TRUE
  ),
  review_count = (
    SELECT COUNT(*)
    FROM product_reviews
    WHERE product_id = NEW.product_id
    AND is_visible = TRUE
  )
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add avg_rating and review_count columns to products table if they don't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3, 2),
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create trigger for product rating calculation
CREATE TRIGGER update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION calculate_product_rating(); 