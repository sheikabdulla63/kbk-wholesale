// ============================================================
// KBK Wholesale - Database Operations (Supabase + Automatic Mock)
// ============================================================

import { supabase, isSupabaseConfigured } from './supabase';
import type { Category, Product, Brand, ContactInfo, CompanySettings } from '@/types';

// Use mock data when Supabase is not configured
const isMock = !isSupabaseConfigured;

// ─── MOCK DATA ──────────────────────────────────────────────

const DEMO_CATEGORIES: Category[] = [
  { id: 'chargers', categoryName: 'Chargers', slug: 'chargers', description: 'Fast chargers and adapters', image: '', createdAt: new Date().toISOString() },
  { id: 'earbuds', categoryName: 'TWS Earbuds', slug: 'earbuds', description: 'True wireless stereo earbuds', image: '', createdAt: new Date().toISOString() },
  { id: 'powerbanks', categoryName: 'Power Banks', slug: 'powerbanks', description: 'High capacity power banks', image: '', createdAt: new Date().toISOString() },
  { id: 'cables', categoryName: 'Data Cables', slug: 'cables', description: 'USB cables and adapters', image: '', createdAt: new Date().toISOString() },
  { id: 'smartwatches', categoryName: 'Smart Watches', slug: 'smartwatches', description: 'Smart wearable devices', image: '', createdAt: new Date().toISOString() },
  { id: 'speakers', categoryName: 'Bluetooth Speakers', slug: 'speakers', description: 'Portable wireless speakers', image: '', createdAt: new Date().toISOString() },
  { id: 'temperedglass', categoryName: 'Tempered Glass', slug: 'temperedglass', description: 'Premium screen protectors', image: '', createdAt: new Date().toISOString() },
  { id: 'neckbands', categoryName: 'Neckbands', slug: 'neckbands', description: 'Wireless neckband earphones', image: '', createdAt: new Date().toISOString() },
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: '1', productName: '65W GaN Fast Charger', categoryId: 'chargers', categoryName: 'Chargers',
    brand: 'Anker', description: 'Ultra-compact 65W GaN charger with foldable plug. Charges laptops, phones and tablets simultaneously.', specifications: { 'Output': '65W', 'Ports': 'USB-C + USB-A', 'Technology': 'GaN III' },
    features: ['65W output', 'GaN technology', 'Compact design', 'Multiple device charging'], colors: ['#FFFFFF', '#000000'],
    modelNumber: 'A2667', stockStatus: 'in_stock', featured: true, images: [],
    warranty: '18 months', createdAt: new Date().toISOString(),
  },
  {
    id: '2', productName: 'TWS Earbuds Pro X', categoryId: 'earbuds', categoryName: 'TWS Earbuds',
    brand: 'Boult', description: 'Active Noise Cancellation TWS earbuds with 30hr battery and Bluetooth 5.3.', specifications: { 'Battery': '30 hours', 'Connectivity': 'Bluetooth 5.3', 'ANC': 'Yes' },
    features: ['ANC', '30hr battery', 'IPX5 water resistant', 'Low latency gaming mode'], colors: ['#1a1a1a', '#F0F0F0', '#1E40AF'], modelNumber: 'B-ProX',
    stockStatus: 'in_stock', featured: true, images: [], warranty: '12 months', createdAt: new Date().toISOString(),
  },
  {
    id: '3', productName: '20000mAh Power Bank', categoryId: 'powerbanks', categoryName: 'Power Banks',
    brand: 'Baseus', description: 'Slim 20000mAh power bank with 22.5W fast charging. LED display shows remaining charge.', specifications: { 'Capacity': '20000mAh', 'Output': '22.5W', 'Ports': '2x USB-A + USB-C' },
    features: ['22.5W fast charge', 'LED display', 'Dual output', 'Slim profile'], colors: ['#FFFFFF', '#000000', '#1E40AF'],
    modelNumber: 'BS-20K', stockStatus: 'in_stock', featured: true, images: [],
    warranty: '12 months', createdAt: new Date().toISOString(),
  },
  {
    id: '4', productName: 'USB-C Braided Cable 2M', categoryId: 'cables', categoryName: 'Data Cables',
    brand: 'Baseus', description: '240W USB-C braided nylon cable.', specifications: { 'Length': '2M', 'Power': '240W' },
    features: ['240W charging', 'Braided nylon'], colors: ['#000000', '#C0C0C0', '#1E40AF'],
    modelNumber: 'CAT-C240', stockStatus: 'in_stock', featured: false, images: [],
    warranty: '12 months', createdAt: new Date().toISOString(),
  },
  {
    id: '5', productName: 'Smart Watch Series 5', categoryId: 'smartwatches', categoryName: 'Smart Watches',
    brand: 'Fire-Boltt', description: '1.96" AMOLED display smart watch with health tracking, GPS and 7-day battery.', specifications: { 'Display': '1.96" AMOLED', 'Battery': '7 days', 'GPS': 'Built-in' },
    features: ['AMOLED display', 'Built-in GPS', 'Heart rate monitor', 'Sleep tracking'], colors: ['#000000', '#C0C0C0', '#FFD700', '#1a1a1a'], modelNumber: 'FBS5',
    stockStatus: 'limited', featured: true, images: [], warranty: '12 months', createdAt: new Date().toISOString(),
  },
  {
    id: '6', productName: 'Bluetooth Speaker Mini', categoryId: 'speakers', categoryName: 'Bluetooth Speakers',
    brand: 'JBL', description: 'IPX7 waterproof portable speaker with 12hr playback.', specifications: { 'Battery': '12hr' },
    features: ['IPX7 waterproof', '12hr battery'], colors: ['#EF4444', '#000000', '#3B82F6'],
    modelNumber: 'JBL-GO3', stockStatus: 'in_stock', featured: false, images: [],
    warranty: '12 months', createdAt: new Date().toISOString(),
  },
  {
    id: '7', productName: 'Tempered Glass iPhone 15', categoryId: 'temperedglass', categoryName: 'Tempered Glass',
    brand: 'Spigen', description: '9H hardness, anti-fingerprint tempered glass.', specifications: { 'Hardness': '9H' },
    features: ['9H hardness', 'Anti-fingerprint'], colors: ['#FFFFFF'], modelNumber: 'TGL-I15',
    stockStatus: 'in_stock', featured: false, images: [], warranty: '6 months', createdAt: new Date().toISOString(),
  },
  {
    id: '8', productName: 'Neckband Wireless Earphones', categoryId: 'neckbands', categoryName: 'Neckbands',
    brand: 'OnePlus', description: 'Magnetic neckband with 20hr battery and fast charge.', specifications: { 'Battery': '20hr' },
    features: ['Magnetic design', '20hr battery', 'Fast charge'], colors: ['#000000', '#C0C0C0'],
    modelNumber: 'NB-E1', stockStatus: 'in_stock', featured: false, images: [],
    warranty: '12 months', createdAt: new Date().toISOString(),
  },
];

const DEMO_BRANDS: Brand[] = [
  { id: '1', brandName: 'Anker', logo: '', description: '', createdAt: new Date().toISOString() },
  { id: '2', brandName: 'Baseus', logo: '', description: '', createdAt: new Date().toISOString() },
  { id: '3', brandName: 'Boult', logo: '', description: '', createdAt: new Date().toISOString() },
  { id: '4', brandName: 'Fire-Boltt', logo: '', description: '', createdAt: new Date().toISOString() },
  { id: '5', brandName: 'JBL', logo: '', description: '', createdAt: new Date().toISOString() },
  { id: '6', brandName: 'Spigen', logo: '', description: '', createdAt: new Date().toISOString() },
  { id: '7', brandName: 'OnePlus', logo: '', description: '', createdAt: new Date().toISOString() },
];

const DEMO_CONTACT: ContactInfo = {
  id: 'contact_default',
  phone: '+91 99762 89418',
  whatsapp: '+91 99762 89418',
  email: 'info@kbkwholesale.in',
  address: 'Karambakkudi, Pudukkottai District, Tamil Nadu - 622302',
  mapLink: '',
  workingHours: 'Mon – Sat: 9:00 AM – 7:00 PM',
};

const DEMO_SETTINGS: CompanySettings = {
  id: 'settings_default',
  companyName: 'KBK Wholesale',
  logo: '/logo.png',
  tagline: 'Your Trusted Mobile Accessories Wholesale Partner',
  description: 'Premium mobile accessories wholesale supplier',
  vision: 'To be India\'s leading B2B distributor',
  heroTitle: 'KBK Wholesale',
  heroSubtitle: 'Premium Mobile Accessories',
};

// ─── Helper to map Supabase row → Product ──────────────────
function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    productName: (row.product_name as string) || '',
    categoryId: (row.category_id as string) || '',
    categoryName: (row.category_name as string) || '',
    brand: (row.brand as string) || '',
    description: (row.description as string) || '',
    specifications: (row.specifications as Record<string, string>) || {},
    features: (row.features as string[]) || [],
    colors: (row.colors as string[]) || [],
    modelNumber: (row.model_number as string) || '',
    stockStatus: (row.stock_status as 'in_stock' | 'out_of_stock' | 'limited') || 'in_stock',
    featured: (row.featured as boolean) || false,
    images: (row.images as string[]) || [],
    warranty: (row.warranty as string) || '',
    createdAt: (row.created_at as string) || new Date().toISOString(),
  };
}

function productToRow(data: Partial<Product>) {
  const row: Record<string, unknown> = {};
  if (data.productName !== undefined) row.product_name = data.productName;
  if (data.categoryId !== undefined) row.category_id = data.categoryId;
  if (data.categoryName !== undefined) row.category_name = data.categoryName;
  if (data.brand !== undefined) row.brand = data.brand;
  if (data.description !== undefined) row.description = data.description;
  if (data.specifications !== undefined) row.specifications = data.specifications;
  if (data.features !== undefined) row.features = data.features;
  if (data.colors !== undefined) row.colors = data.colors;
  if (data.modelNumber !== undefined) row.model_number = data.modelNumber;
  if (data.stockStatus !== undefined) row.stock_status = data.stockStatus;
  if (data.featured !== undefined) row.featured = data.featured;
  if (data.images !== undefined) row.images = data.images;
  if (data.warranty !== undefined) row.warranty = data.warranty;
  return row;
}

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    categoryName: (row.category_name as string) || '',
    slug: (row.slug as string) || '',
    description: (row.description as string) || '',
    image: (row.image as string) || '',
    createdAt: (row.created_at as string) || new Date().toISOString(),
  };
}

function rowToBrand(row: Record<string, unknown>): Brand {
  return {
    id: row.id as string,
    brandName: (row.brand_name as string) || '',
    logo: (row.logo as string) || '',
    description: (row.description as string) || '',
    createdAt: (row.created_at as string) || new Date().toISOString(),
  };
}

// ─── CATEGORIES ────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (isMock) return DEMO_CATEGORIES;

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('category_name', { ascending: true });

  if (error) throw error;
  return (data || []).map(rowToCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isMock) {
    return DEMO_CATEGORIES.find(c => c.slug === slug) || null;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return rowToCategory(data);
}

export async function addCategory(data: Omit<Category, 'id' | 'createdAt'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('categories')
    .insert({
      category_name: data.categoryName,
      slug: data.slug,
      description: data.description,
      image: data.image,
    })
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  const row: Record<string, unknown> = {};
  if (data.categoryName !== undefined) row.category_name = data.categoryName;
  if (data.slug !== undefined) row.slug = data.slug;
  if (data.description !== undefined) row.description = data.description;
  if (data.image !== undefined) row.image = data.image;

  const { error } = await supabase.from('categories').update(row).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ─── PRODUCTS ──────────────────────────────────────────────

export async function getProducts(filters?: {
  categoryId?: string;
  featured?: boolean;
  limitCount?: number;
}): Promise<Product[]> {
  if (isMock) {
    let result = [...DEMO_PRODUCTS];
    if (filters?.categoryId) {
      result = result.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters?.featured !== undefined) {
      result = result.filter(p => p.featured === filters.featured);
    }
    if (filters?.limitCount) {
      result = result.slice(0, filters.limitCount);
    }
    return result;
  }

  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }
  if (filters?.limitCount) {
    query = query.limit(filters.limitCount);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isMock) {
    return DEMO_PRODUCTS.find(p => p.id === id) || null;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return rowToProduct(data);
}

export async function addProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('products')
    .insert(productToRow(data))
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update(productToRow(data))
    .eq('id', id);

  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ─── BRANDS ───────────────────────────────────────────────

export async function getBrands(): Promise<Brand[]> {
  if (isMock) return DEMO_BRANDS;

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('brand_name', { ascending: true });

  if (error) throw error;
  return (data || []).map(rowToBrand);
}

export async function addBrand(data: Omit<Brand, 'id' | 'createdAt'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('brands')
    .insert({
      brand_name: data.brandName,
      logo: data.logo,
      description: data.description || '',
    })
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

export async function deleteBrand(id: string): Promise<void> {
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw error;
}

// ─── CONTACT INFO ──────────────────────────────────────────

export async function getContactInfo(): Promise<ContactInfo | null> {
  if (isMock) return DEMO_CONTACT;

  const { data, error } = await supabase
    .from('contact')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) return DEMO_CONTACT;
  return {
    id: data.id,
    phone: data.phone || '',
    whatsapp: data.whatsapp || '',
    email: data.email || '',
    address: data.address || '',
    mapLink: data.map_link || '',
    workingHours: data.working_hours || '',
  };
}

export async function updateContactInfo(id: string, data: Partial<ContactInfo>): Promise<string> {
  if (isMock) return id;

  const row: Record<string, unknown> = {};
  if (data.phone !== undefined) row.phone = data.phone;
  if (data.whatsapp !== undefined) row.whatsapp = data.whatsapp;
  if (data.email !== undefined) row.email = data.email;
  if (data.address !== undefined) row.address = data.address;
  if (data.mapLink !== undefined) row.map_link = data.mapLink;
  if (data.workingHours !== undefined) row.working_hours = data.workingHours;

  // Check if current ID is a mock string like 'contact_default' (not a UUID)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (!isUUID) {
    // Check if a row already exists in Supabase
    const { data: existing } = await supabase.from('contact').select('id').limit(1).single();
    if (existing?.id) {
      const { error } = await supabase.from('contact').update(row).eq('id', existing.id);
      if (error) throw error;
      return existing.id;
    } else {
      // Create new row
      const { data: created, error } = await supabase.from('contact').insert(row).select('id').single();
      if (error) throw error;
      return created.id;
    }
  }

  const { error } = await supabase.from('contact').update(row).eq('id', id);
  if (error) throw error;
  return id;
}

export async function setContactInfo(data: ContactInfo): Promise<string> {
  if (isMock) return 'contact_default';

  const { data: result, error } = await supabase
    .from('contact')
    .insert({
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      email: data.email || '',
      address: data.address || '',
      map_link: data.mapLink || '',
      working_hours: data.workingHours || '',
    })
    .select('id')
    .single();

  if (error) throw error;
  return result.id;
}

// ─── COMPANY SETTINGS ──────────────────────────────────────

export async function getCompanySettings(): Promise<CompanySettings | null> {
  if (isMock) return DEMO_SETTINGS;

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) return DEMO_SETTINGS;
  return {
    id: data.id,
    companyName: data.company_name || '',
    logo: data.logo || '',
    tagline: data.tagline || '',
    description: data.description || '',
    vision: data.vision || '',
    heroTitle: data.hero_title || '',
    heroSubtitle: data.hero_subtitle || '',
  };
}

export async function updateCompanySettings(
  id: string,
  data: Partial<CompanySettings>
): Promise<void> {
  const row: Record<string, unknown> = {};
  if (data.companyName !== undefined) row.company_name = data.companyName;
  if (data.logo !== undefined) row.logo = data.logo;
  if (data.tagline !== undefined) row.tagline = data.tagline;
  if (data.description !== undefined) row.description = data.description;
  if (data.vision !== undefined) row.vision = data.vision;
  if (data.heroTitle !== undefined) row.hero_title = data.heroTitle;
  if (data.heroSubtitle !== undefined) row.hero_subtitle = data.heroSubtitle;

  const { error } = await supabase.from('settings').update(row).eq('id', id);
  if (error) throw error;
}

// ─── SEARCH ───────────────────────────────────────────────

export async function searchProducts(searchQuery: string): Promise<Product[]> {
  if (isMock) {
    const q = searchQuery.toLowerCase();
    return DEMO_PRODUCTS.filter(
      (p) =>
        p.productName?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
    );
  }

  const q = searchQuery.toLowerCase();
  const { data, error } = await supabase.from('products').select('*');

  if (error) throw error;
  const all = (data || []).map(rowToProduct);
  return all.filter(
    (p) =>
      p.productName?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q)
  );
}
