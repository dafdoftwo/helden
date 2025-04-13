-- HELDEN Store Database Setup

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  image_url TEXT,
  inventory_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_date TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB,
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Function to get order counts for specified customers
CREATE OR REPLACE FUNCTION get_customer_order_counts(user_ids UUID[])
RETURNS TABLE (
  user_id UUID,
  count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    user_id,
    COUNT(*) as count
  FROM 
    orders
  WHERE 
    user_id = ANY(user_ids)
  GROUP BY 
    user_id;
$$;

-- Function to get total spent by specified customers
CREATE OR REPLACE FUNCTION get_customer_total_spent(user_ids UUID[])
RETURNS TABLE (
  user_id UUID,
  sum FLOAT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    user_id,
    COALESCE(SUM(total), 0) as sum
  FROM 
    orders
  WHERE 
    user_id = ANY(user_ids)
  GROUP BY 
    user_id;
$$;

-- Setup RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Favorites policies
CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create a trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- Create sample admin user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'admin@helden.store',
  crypt('ABMabm2122@@', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'
)
ON CONFLICT (email) DO NOTHING;

-- Add the user to profiles with admin role
INSERT INTO profiles (id, first_name, last_name, email, role)
SELECT id, 'Admin', 'User', 'admin@helden.store', 'admin'
FROM auth.users
WHERE email = 'admin@helden.store'
ON CONFLICT (id) DO UPDATE SET role = 'admin'; 