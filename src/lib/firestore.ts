// ============================================================
// KBK Wholesale - Firestore Database Operations (with Automatic Mocking)
// ============================================================

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Category, Product, Brand, ContactInfo, CompanySettings } from '@/types';

// Detect if Firebase is using placeholder values to avoid hangs on local environment
const isMock = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
               process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'YOUR_PROJECT_ID';

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

// ─── CATEGORIES ────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (isMock) return DEMO_CATEGORIES;

  const q = query(collection(db, 'categories'), orderBy('categoryName', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
  })) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isMock) {
    return DEMO_CATEGORIES.find(c => c.slug === slug) || null;
  }

  const q = query(collection(db, 'categories'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docData = snapshot.docs[0];
  return { id: docData.id, ...docData.data() } as Category;
}

export async function addCategory(data: Omit<Category, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'categories'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  await updateDoc(doc(db, 'categories', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, 'categories', id));
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

  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

  if (filters?.categoryId) {
    constraints.unshift(where('categoryId', '==', filters.categoryId));
  }
  if (filters?.featured !== undefined) {
    constraints.unshift(where('featured', '==', filters.featured));
  }
  if (filters?.limitCount) {
    constraints.push(limit(filters.limitCount));
  }

  const q = query(collection(db, 'products'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
  })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isMock) {
    return DEMO_PRODUCTS.find(p => p.id === id) || null;
  }

  const snapshot = await getDoc(doc(db, 'products', id));
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate?.() || snapshot.data().createdAt,
  } as Product;
}

export async function addProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// ─── BRANDS ───────────────────────────────────────────────

export async function getBrands(): Promise<Brand[]> {
  if (isMock) return DEMO_BRANDS;

  const q = query(collection(db, 'brands'), orderBy('brandName', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Brand[];
}

export async function addBrand(data: Omit<Brand, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'brands'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteBrand(id: string): Promise<void> {
  await deleteDoc(doc(db, 'brands', id));
}

// ─── CONTACT INFO ──────────────────────────────────────────

export async function getContactInfo(): Promise<ContactInfo | null> {
  if (isMock) return DEMO_CONTACT;

  const snapshot = await getDocs(collection(db, 'contact'));
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ContactInfo;
}

export async function updateContactInfo(id: string, data: Partial<ContactInfo>): Promise<void> {
  await updateDoc(doc(db, 'contact', id), data);
}

export async function setContactInfo(data: ContactInfo): Promise<string> {
  const ref = await addDoc(collection(db, 'contact'), data);
  return ref.id;
}

// ─── COMPANY SETTINGS ──────────────────────────────────────

export async function getCompanySettings(): Promise<CompanySettings | null> {
  if (isMock) return DEMO_SETTINGS;

  const snapshot = await getDocs(collection(db, 'settings'));
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as CompanySettings;
}

export async function updateCompanySettings(
  id: string,
  data: Partial<CompanySettings>
): Promise<void> {
  await updateDoc(doc(db, 'settings', id), data);
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

  const snapshot = await getDocs(collection(db, 'products'));
  const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[];
  const q = searchQuery.toLowerCase();
  return all.filter(
    (p) =>
      p.productName?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q)
  );
}
