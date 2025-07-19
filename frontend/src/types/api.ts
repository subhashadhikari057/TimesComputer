// TypeScript types for API responses

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  brand: Brand;
  category: Category;
  specifications?: Record<string, any>;
  features?: string[];
  isActive: boolean;
  inStock: boolean;
  stockQuantity?: number;
  createdAt: string;
  updatedAt: string;
  // Additional fields that might be in specifications
  processor?: string;
  memory?: string;
  connectivity?: string;
  switchType?: string;
  graphics?: string;
  screenSize?: string;
  resolution?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ProductFilters {
  brand?: string[];
  category?: string[];
  processor?: string[];
  memory?: string[];
  connectivity?: string[];
  switchType?: string[];
  graphics?: string[];
  screenSize?: string[];
  resolution?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  filters?: ProductFilters;
}

export interface SearchResult {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  total: number;
}
