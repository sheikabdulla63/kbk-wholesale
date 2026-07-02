// ============================================================
// KBK Wholesale - TypeScript Type Definitions
// ============================================================

export interface Category {
  id: string;
  categoryName: string;
  description: string;
  image: string;
  icon?: string;
  productCount?: number;
  slug: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface Product {
  id: string;
  productName: string;
  categoryId: string;
  categoryName?: string;
  brand: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  colors: string[];
  modelNumber: string;
  stockStatus: 'in_stock' | 'out_of_stock' | 'limited';
  featured: boolean;
  images: string[];
  warranty?: string;
  compatibleDevices?: string[];
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface Brand {
  id: string;
  brandName: string;
  logo: string;
  description?: string;
  createdAt: Date | string;
}

export interface ContactInfo {
  id?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapLink: string;
  workingHours: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

export interface CompanySettings {
  id?: string;
  companyName: string;
  logo: string;
  tagline: string;
  description: string;
  vision: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
}

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  brand?: string;
  stockStatus?: string;
  featured?: boolean;
  sortBy?: 'newest' | 'oldest' | 'name_asc' | 'name_desc';
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  featuredProducts: number;
}
