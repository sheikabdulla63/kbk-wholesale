-- ============================================================
-- KBK Wholesale - Supabase Database Setup & Full Permissions
-- Run this in Supabase SQL Editor
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

-- ─── Disable RLS ───────────────────────────────────────────
ALTER TABLE IF EXISTS categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings DISABLE ROW LEVEL SECURITY;

-- ─── Grant Table Permissions ───────────────────────────────
GRANT ALL ON TABLE categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE products TO anon, authenticated, service_role;
GRANT ALL ON TABLE brands TO anon, authenticated, service_role;
GRANT ALL ON TABLE contact TO anon, authenticated, service_role;
GRANT ALL ON TABLE settings TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ─── Insert Default Data ──────────────────────────────────
INSERT INTO contact (phone, whatsapp, email, address, working_hours)
VALUES ('+91 99762 89418', '+91 99762 89418', 'info@kbkwholesale.in', 'Karambakkudi, Pudukkottai District, Tamil Nadu - 622302', 'Mon – Sat: 9:00 AM – 7:00 PM')
ON CONFLICT DO NOTHING;

INSERT INTO settings (company_name, logo, tagline, description, vision, hero_title, hero_subtitle)
VALUES ('KBK Wholesale', '/logo.png', 'Your Trusted Mobile Accessories Wholesale Partner', 'Premium mobile accessories wholesale supplier', 'To be India''s leading B2B distributor', 'KBK Wholesale', 'Premium Mobile Accessories')
ON CONFLICT DO NOTHING;
