-- ============================================================
-- KBK Wholesale - Supabase Database Setup
-- Run this in Supabase SQL Editor (one-time setup)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Categories Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Products Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_name TEXT NOT NULL,
  category_id TEXT DEFAULT '',
  category_name TEXT DEFAULT '',
  brand TEXT DEFAULT '',
  description TEXT DEFAULT '',
  specifications JSONB DEFAULT '{}',
  features JSONB DEFAULT '[]',
  colors JSONB DEFAULT '[]',
  model_number TEXT DEFAULT '',
  stock_status TEXT DEFAULT 'in_stock',
  featured BOOLEAN DEFAULT false,
  images JSONB DEFAULT '[]',
  warranty TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Brands Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  logo TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Contact Table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  map_link TEXT DEFAULT '',
  working_hours TEXT DEFAULT ''
);

-- ─── Settings Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT DEFAULT 'KBK Wholesale',
  logo TEXT DEFAULT '/logo.png',
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  vision TEXT DEFAULT '',
  hero_title TEXT DEFAULT '',
  hero_subtitle TEXT DEFAULT ''
);

-- ─── Enable Row Level Security (RLS) ──────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ─── Public Read Policies (anyone can view) ────────────────
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can view brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Anyone can view contact" ON contact FOR SELECT USING (true);
CREATE POLICY "Anyone can view settings" ON settings FOR SELECT USING (true);

-- ─── Admin Write Policies (only logged-in users can edit) ──
CREATE POLICY "Admin can insert categories" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update categories" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete categories" ON categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert brands" ON brands FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update brands" ON brands FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete brands" ON brands FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert contact" ON contact FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update contact" ON contact FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert settings" ON settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update settings" ON settings FOR UPDATE USING (auth.role() = 'authenticated');

-- ─── Insert Default Data ──────────────────────────────────
INSERT INTO contact (phone, whatsapp, email, address, working_hours)
VALUES ('+91 99762 89418', '+91 99762 89418', 'info@kbkwholesale.in', 'Karambakkudi, Pudukkottai District, Tamil Nadu - 622302', 'Mon – Sat: 9:00 AM – 7:00 PM');

INSERT INTO settings (company_name, logo, tagline, description, vision, hero_title, hero_subtitle)
VALUES ('KBK Wholesale', '/logo.png', 'Your Trusted Mobile Accessories Wholesale Partner', 'Premium mobile accessories wholesale supplier', 'To be India''s leading B2B distributor', 'KBK Wholesale', 'Premium Mobile Accessories');

-- ─── Insert Default Categories ────────────────────────────
INSERT INTO categories (category_name, slug, description) VALUES
('Chargers', 'chargers', 'Fast chargers and adapters'),
('TWS Earbuds', 'earbuds', 'True wireless stereo earbuds'),
('Power Banks', 'powerbanks', 'High capacity power banks'),
('Data Cables', 'cables', 'USB cables and adapters'),
('Smart Watches', 'smartwatches', 'Smart wearable devices'),
('Bluetooth Speakers', 'speakers', 'Portable wireless speakers'),
('Tempered Glass', 'temperedglass', 'Premium screen protectors'),
('Neckbands', 'neckbands', 'Wireless neckband earphones');

-- ─── Insert Default Brands ────────────────────────────────
INSERT INTO brands (brand_name, description) VALUES
('Anker', 'Premium charging accessories'),
('Baseus', 'Innovative mobile accessories'),
('Boult', 'Audio products'),
('Fire-Boltt', 'Smart wearables'),
('JBL', 'Audio equipment'),
('Spigen', 'Mobile protection'),
('OnePlus', 'Premium tech accessories');

-- ─── Done! ────────────────────────────────────────────────
-- Your database is ready. You can now use the admin panel.
