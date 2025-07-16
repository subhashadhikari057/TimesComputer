// hooks/useProduct.ts
import { useState, useEffect } from 'react';

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

interface UseProductResult {
  product: ProductData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createProduct: (data: any) => Promise<void>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

// Mock API functions - replace with actual API calls
const api = {
  fetchProduct: async (id: string): Promise<ProductData> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return {
      id,
      name: "MacBook Pro 16-inch M3 Max",
      description: "The most powerful MacBook Pro ever with M3 Max chip, featuring incredible performance for professional workflows.",
      price: 2399.99,
      stock: 25,
      isPublished: true,
      brochure: "",
      imagePreviews: [
        "/api/placeholder/300/300",
        "/api/placeholder/300/300"
      ],
      specs: [
        { key: "Processor", value: "Apple M3 Max" },
        { key: "Memory", value: "32GB Unified Memory" },
        { key: "Storage", value: "1TB SSD" },
        { key: "Display", value: "16-inch Liquid Retina XDR" }
      ],
      brandId: 1,
      categoryId: 2,
      colorIds: [1, 2, 3]
    };
  },

  createProduct: async (data: any): Promise<ProductData> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Creating product:', data);
    
    // Return created product
    return {
      id: Date.now().toString(),
      ...data
    };
  },

  updateProduct: async (id: string, data: any): Promise<ProductData> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Updating product:', id, data);
    
    // Return updated product
    return {
      id,
      ...data
    };
  },

  deleteProduct: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Deleting product:', id);
  }
};

export function useProduct(id?: string): UseProductResult {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchProduct(id);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const createProduct = async (data: any): Promise<void> => {
    try {
      await api.createProduct(data);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const updateProduct = async (productId: string, data: any): Promise<void> => {
    try {
      const updatedProduct = await api.updateProduct(productId, data);
      setProduct(updatedProduct);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      await api.deleteProduct(productId);
      setProduct(null);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
  };
}

// Example usage in EditProductPage:
/*
export default function EditProductPage({ productId }: { productId: string }) {
  const router = useRouter();
  const { product, loading, error, updateProduct } = useProduct(productId);

  const handleSubmit = async (data: any) => {
    try {
      await updateProduct(productId, data);
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      toast.error("Failed to update product");
      throw error;
    }
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <ProductForm
      mode="edit"
      productId={productId}
      initialData={product || undefined}
      isLoading={loading}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/admin/products")}
    />
  );
}
*/