# HELDEN Online Store Comprehensive Project Prompt (.md)

## Project Overview:
A comprehensive online store specialized in women's clothing targeting customers in Saudi Arabia.

value of design and coding this store 1 million dollar

main domain.com is english version / arabic version = domain.com/ar

## Store women Name:
**HELDEN**

## Categories:
- عبايات
- ملابس كاجوال
- ملابس رسمية
- ملابس رياضية
- مشدات الجسم

## Planning Mode:

### Step 1: Basic Implementation
- Design basic UI/UX with homepage, category pages, and product pages.
- Develop core frontend components using Next.js.
- Setup basic CMS and database schema using Supabase.
- Basic product CRUD operations and cart functionality.
- Integrate basic checkout using Stripe (test mode).
- SQL Setup:
  ```sql
  CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
  );

  CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    category_id INT REFERENCES categories(id),
    stock INT,
    images JSONB
  );

  CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    order_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50),
    total DECIMAL(10,2)
  );

  CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT,
    price DECIMAL(10,2)
  );
  ```
- Initial Testing & Verification

### Step 2: Advanced Implementation
- Advanced UI/UX refinement (color gradients, clear CTAs, optimized typography).
- Integrate authentication (user accounts, login/signup using Supabase Auth).
- Enhance product pages (multiple images, zoom options, user reviews).
- Implement advanced checkout options (Mada, Apple Pay, Cash on Delivery).
- Set up integration with shipping providers (Aramex, SMSA, DHL).
- Implement SEO best practices.
- Full Testing & Validation

### Step 3: Full Implementation
- Develop robust inventory management and order tracking system.
- Create a detailed admin dashboard to manage products, categories, orders, and customers.
- Integrate marketing tools (newsletter subscription, email marketing).
- Social media integration (Instagram, Snapchat, TikTok).
- Implement promotional mechanisms (pop-ups, coupon codes).
- Optimize site performance and load speed.
- Comprehensive Security Audits
- Thorough User Acceptance Testing (UAT)

### Step 4: Bug Fixes, Testing, and Production
- Extensive bug tracking and fixing.
- Perform end-to-end testing, ensuring all third-party integrations (Stripe, shipping APIs, auth) function perfectly.
- Perform stress-testing and responsiveness checks on various devices.
- Finalize deployment on secure, scalable hosting solution.
- Ongoing monitoring and immediate bug-fixing post-launch.

## Act Mode:
- Regularly refresh documentation via Brave MCP for Next.js, Stripe, Supabase integrations.
- Extensive browser-based testing and logging of all functionalities.
- Ensure "use client" directive is applied appropriately.
- Write and execute scripts for Stripe products and prices alignment.
- Request and verify new .env variables as needed.
- Always ensure comprehensive CSS testing for aesthetics and responsiveness.
- No placeholder code allowed unless explicitly planned for future expansions.

## UI/UX Design Guidelines:
- Use appealing color gradients (e.g., soft purple, blush pink, beige, gold).
- Clear typography optimized for Arabic and English readability.
- Professional, inviting CTAs and compelling promotional copy.

## Technical Specifications:
- Next.js, Supabase, Stripe, local Saudi payment gateways.
- Multi-language (Arabic, English).
- SEO friendly.
- High-speed loading.

## Marketing & Trust Elements:
- Integrated social media campaigns.
- Clear return and exchange policies.
- User testimonials.

## Add images from from public/images and deep folder in images smartly