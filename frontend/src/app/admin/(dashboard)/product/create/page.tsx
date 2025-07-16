"use client";

import ProductForm from "@/components/admin/product/productForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Replace with actual API call
      console.log("Creating product:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success("Product created successfully!");
      
      // Redirect to products list
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
      throw error; // Re-throw to handle in form
    }
  };

  return (
    <ProductForm
      mode="create"
      onSubmit={handleSubmit}
    />
  );
}