// hooks/useProduct.ts
import { useState, useEffect, useCallback } from 'react';
import { getProductById, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from '../api/product';

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isPublished: boolean;
  brochure: string;
  images?: File[];
  imagePreviews?: string[];
  specs?: { key: string; value: string }[];
  brandId?: number | null;
  categoryId?: number | null;
  colorIds?: number[];
}

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  isPublished: boolean;
  brochure: string;
  images?: File[];
  specs?: { key: string; value: string }[];
  brandId?: number | null;
  categoryId?: number | null;
  colorIds?: number[];
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isPublished?: boolean;
  brochure?: string;
  images?: File[];
  specs?: { key: string; value: string }[];
  brandId?: number | null;
  categoryId?: number | null;
  colorIds?: number[];
}

interface UseProductResult {
  product: ProductData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createProduct: (data: CreateProductData) => Promise<void>;
  updateProduct: (id: string, data: UpdateProductData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export function useProduct(id?: string): UseProductResult {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      // Use real API call
      const data = await getProductById(Number(id));
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  const createProduct = async (data: CreateProductData): Promise<void> => {
    try {
      // Convert to FormData for API
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v, i) => formData.append(`${key}[${i}]`, v));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });
      await apiCreateProduct(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err;
    }
  };

  const updateProduct = async (productId: string, data: UpdateProductData): Promise<void> => {
    try {
      // Convert to FormData for API
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v, i) => formData.append(`${key}[${i}]`, v));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });
      await apiUpdateProduct(Number(productId), formData);
      // Optionally refetch product
      await fetchProduct();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      await apiDeleteProduct(Number(productId));
      setProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  };

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

