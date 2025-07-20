// Product API service functions
import api from '@/lib/api';
import { Product, Brand, ApiResponse, ProductQuery, SearchResult } from '@/types/api';

export class ProductService {
  // Get all products with optional filtering and pagination
  static async getProducts(query: ProductQuery = {}): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sort) params.append('sort', query.sort);
    if (query.search) params.append('search', query.search);
    
    // Add filters as query parameters
    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, v));
        } else if (typeof value === 'object' && value !== null) {
          // Handle price range
          if (key === 'priceRange') {
            params.append('minPrice', value.min.toString());
            params.append('maxPrice', value.max.toString());
          }
        } else if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/product?${params.toString()}`);
    return response.data;
  }

  // Get products by brand
  static async getProductsByBrand(brandName: string, query: ProductQuery = {}): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sort) params.append('sort', query.sort);
    
    // Add brand filter
    params.append('brand', brandName);
    
    // Add other filters
    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        if (key === 'brand') return; // Skip brand filter as it's already added
        
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, v));
        } else if (typeof value === 'object' && value !== null) {
          if (key === 'priceRange') {
            params.append('minPrice', value.min.toString());
            params.append('maxPrice', value.max.toString());
          }
        } else if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/product?${params.toString()}`);
    return response.data;
  }

  // Get products by category
  static async getProductsByCategory(categoryName: string, query: ProductQuery = {}): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sort) params.append('sort', query.sort);
    
    // Add category filter
    params.append('category', categoryName);
    
    // Add other filters
    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        if (key === 'category') return; // Skip category filter as it's already added
        
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, v));
        } else if (typeof value === 'object' && value !== null) {
          if (key === 'priceRange') {
            params.append('minPrice', value.min.toString());
            params.append('maxPrice', value.max.toString());
          }
        } else if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/product?${params.toString()}`);
    return response.data;
  }

  // Get single product by ID
  static async getProductById(id: string): Promise<ApiResponse<Product>> {
    const response = await api.get(`/product/${id}`);
    return response.data;
  }

  // Get single product by slug
  static async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    const response = await api.get(`/product/slug/${slug}`);
    return response.data;
  }

  // Search products
  static async searchProducts(searchQuery: string, filters?: ProductQuery): Promise<ApiResponse<SearchResult>> {
    const params = new URLSearchParams();
    params.append('q', searchQuery);
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    
    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  }
}

export class BrandService {
  // Get all brands
  static async getAllBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await api.get('/brand');
    return response.data;
  }

  // Get single brand by ID
  static async getBrandById(id: string): Promise<ApiResponse<Brand>> {
    const response = await api.get(`/brand/${id}`);
    return response.data;
  }

  // Get brand by name/slug
  static async getBrandByName(name: string): Promise<ApiResponse<Brand>> {
    // Try to find brand by name in the list of all brands
    const brandsResponse = await this.getAllBrands();
    const brand = brandsResponse.data.find(
      b => b.name.toLowerCase() === name.toLowerCase() || 
           b.slug.toLowerCase() === name.toLowerCase()
    );
    
    if (brand) {
      return {
        success: true,
        data: brand
      };
    } else {
      throw new Error(`Brand '${name}' not found`);
    }
  }
}
