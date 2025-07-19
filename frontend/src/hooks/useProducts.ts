// Custom hook for managing product data from API
import { useState, useEffect, useCallback } from 'react';
import { Product, ProductQuery, ApiResponse } from '@/types/api';
import { ProductService } from '@/services/productService';

interface UseProductsOptions {
  brandName?: string;
  categoryName?: string;
  initialQuery?: ProductQuery;
  autoFetch?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  fetchProducts: (query?: ProductQuery) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useProducts({
  brandName,
  categoryName,
  initialQuery = {},
  autoFetch = true
}: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [currentQuery, setCurrentQuery] = useState<ProductQuery>(initialQuery);

  const fetchProducts = useCallback(async (query: ProductQuery = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let response: ApiResponse<Product[]>;
      
      const finalQuery = { ...currentQuery, ...query };
      
      if (brandName) {
        response = await ProductService.getProductsByBrand(brandName, finalQuery);
      } else if (categoryName) {
        response = await ProductService.getProductsByCategory(categoryName, finalQuery);
      } else {
        response = await ProductService.getProducts(finalQuery);
      }
      
      if (response.success) {
        setProducts(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
        setCurrentQuery(finalQuery);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [brandName, categoryName, currentQuery]);

  const refetch = useCallback(() => {
    return fetchProducts(currentQuery);
  }, [fetchProducts, currentQuery]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts(initialQuery);
    }
  }, [brandName, categoryName, autoFetch]); // Don't include fetchProducts to avoid infinite loops

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    refetch
  };
}

// Hook specifically for brand products
export function useBrandProducts(brandName: string, initialQuery: ProductQuery = {}) {
  return useProducts({
    brandName,
    initialQuery,
    autoFetch: true
  });
}

// Hook specifically for category products
export function useCategoryProducts(categoryName: string, initialQuery: ProductQuery = {}) {
  return useProducts({
    categoryName,
    initialQuery,
    autoFetch: true
  });
}
