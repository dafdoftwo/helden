-- Sample data for Helden e-commerce store
-- Insert this after running the schema creation script

-- Categories
INSERT INTO categories (name, slug, description, image_url, is_active)
VALUES 
('Women', 'women', 'Women''s fashion collection', '/images/categories/women.jpg', true),
('Men', 'men', 'Men''s fashion collection', '/images/categories/men.jpg', true),
('Accessories', 'accessories', 'Fashion accessories', '/images/categories/accessories.jpg', true);

-- Subcategories
INSERT INTO subcategories (category_id, name, slug, description, image_url, is_active)
VALUES 
-- Women subcategories
(1, 'Abayas', 'abayas', 'Elegant abayas collection', '/images/subcategories/abayas.jpg', true),
(1, 'Dresses', 'dresses', 'Women''s dresses', '/images/subcategories/dresses.jpg', true),
(1, 'Tops', 'tops', 'Women''s tops', '/images/subcategories/tops.jpg', true),

-- Men subcategories
(2, 'Thobes', 'thobes', 'Men''s thobes collection', '/images/subcategories/thobes.jpg', true),
(2, 'Shirts', 'shirts', 'Men''s shirts', '/images/subcategories/shirts.jpg', true),
(2, 'Jackets', 'jackets', 'Men''s jackets', '/images/subcategories/jackets.jpg', true),

-- Accessories subcategories
(3, 'Bags', 'bags', 'Fashion bags', '/images/subcategories/bags.jpg', true),
(3, 'Footwear', 'footwear', 'Shoes and sandals', '/images/subcategories/footwear.jpg', true),
(3, 'Hijabs & Scarves', 'hijabs-scarves', 'Hijabs and scarves collection', '/images/subcategories/hijabs.jpg', true);

-- Products for Women's Abayas
INSERT INTO products (
  name, slug, description, price, discount_price, stock, 
  is_active, category_id, subcategory_id, main_image, 
  additional_images, colors, sizes, is_new, is_featured, sku
)
VALUES 
(
  'Elegant Black Abaya', 
  'elegant-black-abaya',
  'A sophisticated black abaya with delicate embroidery, perfect for special occasions.',
  599.00,
  499.00,
  15,
  true,
  1, -- Women category
  1, -- Abayas subcategory
  '/images/products/abaya1.jpg',
  ARRAY['/images/products/abaya1.jpg', '/images/products/abaya2.jpg', '/images/products/abaya3.jpg'],
  ARRAY['Black', 'Navy', 'Brown'],
  ARRAY['S', 'M', 'L', 'XL'],
  true,
  true,
  'WA-001'
),
(
  'Casual Daily Abaya', 
  'casual-daily-abaya',
  'A comfortable everyday abaya made with breathable fabric for daily wear.',
  399.00,
  null,
  8,
  true,
  1, -- Women category
  1, -- Abayas subcategory
  '/images/products/abaya4.jpg',
  ARRAY['/images/products/abaya4.jpg', '/images/products/abaya5.jpg', '/images/products/abaya6.jpg'],
  ARRAY['Black', 'Gray'],
  ARRAY['S', 'M', 'L'],
  true,
  false,
  'WA-002'
),
(
  'Embellished Special Occasion Abaya', 
  'embellished-special-occasion-abaya',
  'A luxurious abaya with stunning embellishments, perfect for weddings and formal events.',
  799.00,
  649.00,
  12,
  true,
  1, -- Women category
  1, -- Abayas subcategory
  '/images/products/abaya7.jpg',
  ARRAY['/images/products/abaya7.jpg', '/images/products/abaya8.jpg', '/images/products/abaya9.jpg'],
  ARRAY['Black', 'Burgundy'],
  ARRAY['M', 'L', 'XL'],
  false,
  true,
  'WA-003'
);

-- Products for Men's Thobes
INSERT INTO products (
  name, slug, description, price, discount_price, stock, 
  is_active, category_id, subcategory_id, main_image, 
  additional_images, colors, sizes, is_new, is_featured, sku
)
VALUES 
(
  'Casual Summer Thobe', 
  'casual-summer-thobe',
  'A lightweight, breathable thobe perfect for hot summer days.',
  349.00,
  null,
  25,
  true,
  2, -- Men category
  4, -- Thobes subcategory
  '/images/products/thobe1.jpg',
  ARRAY['/images/products/thobe1.jpg', '/images/products/thobe2.jpg', '/images/products/thobe3.jpg'],
  ARRAY['White', 'Beige', 'Light Blue'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  false,
  true,
  'MT-001'
),
(
  'Premium Winter Thobe', 
  'premium-winter-thobe',
  'A premium quality thobe made with warmer fabric, ideal for cooler seasons.',
  699.00,
  599.00,
  10,
  true,
  2, -- Men category
  4, -- Thobes subcategory
  '/images/products/thobe4.jpg',
  ARRAY['/images/products/thobe4.jpg', '/images/products/thobe5.jpg', '/images/products/thobe6.jpg'],
  ARRAY['White', 'Off-White', 'Gray'],
  ARRAY['M', 'L', 'XL'],
  true,
  false,
  'MT-002'
);

-- Products for Accessories
INSERT INTO products (
  name, slug, description, price, discount_price, stock, 
  is_active, category_id, subcategory_id, main_image, 
  additional_images, colors, sizes, is_new, is_featured, sku
)
VALUES 
(
  'Handcrafted Leather Sandals', 
  'handcrafted-leather-sandals',
  'Traditional handcrafted leather sandals, combining comfort with timeless style.',
  249.00,
  null,
  30,
  true,
  3, -- Accessories category
  8, -- Footwear subcategory
  '/images/products/sandals1.jpg',
  ARRAY['/images/products/sandals1.jpg', '/images/products/sandals2.jpg', '/images/products/sandals3.jpg'],
  ARRAY['Brown', 'Black'],
  ARRAY['40', '41', '42', '43', '44', '45'],
  false,
  true,
  'AS-001'
),
(
  'Everyday Casual Bag', 
  'everyday-casual-bag',
  'A versatile everyday bag that combines style and functionality.',
  249.00,
  199.00,
  7,
  true,
  3, -- Accessories category
  7, -- Bags subcategory
  '/images/products/bag1.jpg',
  ARRAY['/images/products/bag1.jpg', '/images/products/bag2.jpg', '/images/products/bag3.jpg'],
  ARRAY['Tan', 'Black', 'Brown'],
  ARRAY['One Size'],
  true,
  false,
  'AB-001'
),
(
  'Premium Silk Hijab', 
  'premium-silk-hijab',
  'Luxurious silk hijab that drapes beautifully and adds elegance to any outfit.',
  129.00,
  null,
  50,
  true,
  3, -- Accessories category
  9, -- Hijabs & Scarves subcategory
  '/images/products/hijab1.jpg',
  ARRAY['/images/products/hijab1.jpg', '/images/products/hijab2.jpg', '/images/products/hijab3.jpg'],
  ARRAY['Black', 'Navy', 'Burgundy', 'Forest Green', 'Beige'],
  ARRAY['One Size'],
  false,
  true,
  'AH-001'
);

-- Add a sample coupon
INSERT INTO coupons (code, type, value, min_purchase, max_discount, start_date, end_date, is_active, usage_limit)
VALUES
('WELCOME10', 'percentage', 10.00, 200.00, 100.00, now(), now() + interval '30 days', true, 1000); 