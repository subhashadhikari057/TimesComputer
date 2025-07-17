"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductForm from "@/components/admin/product/productForm";

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

// Mock function to fetch product data
// TODO: Replace with actual API call
const fetchProduct = async (id: string): Promise<ProductData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data - replace with actual API response
  return {
    id,
    name: "MacBook Pro 16-inch M3 Max",
    description:
      "The most powerful MacBook Pro ever with M3 Max chip, featuring incredible performance for professional workflows.",
    price: 2399.99,
    stock: 25,
    isPublished: true,
    brochure: "",
    imagePreviews: ["/api/placeholder/300/300", "/api/placeholder/300/300"],
    specs: [
      { key: "Processor", value: "Apple M3 Max" },
      { key: "Memory", value: "32GB Unified Memory" },
      { key: "Storage", value: "1TB SSD" },
      { key: "Display", value: "16-inch Liquid Retina XDR" },
    ],
    brandId: 1,
    categoryId: 2,
    colorIds: [1, 2, 3],
  };
};

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProduct(id);
        setProductData(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product data");
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Replace with actual API call
      console.log("Updating product:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      toast.success("Product updated successfully!");

      // Redirect to products list
      router.push("/admin/product/all-products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
      throw error; // Re-throw to handle in form
    }
  };

  const handleCancel = () => {
    router.push("/admin/product/all-products");
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/admin/product/all-products")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      productId={id}
      initialData={productData || undefined}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
