"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";
import ComponentCard from "@/components/common/ComponentsCard";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import DefaultTextarea from "@/components/form/form-elements/DefaultTextarea";
import DefaultNumberInput from "@/components/form/form-elements/DefaultNumberInput";
import DefaultCheckbox from "@/components/form/form-elements/DefaultCheckbox";
import PhotoUpload from "@/components/admin/product/photoUpload";
import Specifications from "@/components/admin/product/specification";
import AttributeSelector from "@/components/admin/product/attributes";
import DefaultButton from "@/components/form/form-elements/DefaultButton";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  isPublished: boolean;
  brochure: string;
}

interface ProductData extends ProductFormData {
  id: string;
  images?: File[];
  imagePreviews?: string[];
  specs?: { key: string; value: string }[];
  brandId?: number | null;
  categoryId?: number | null;
  colorIds?: number[];
}

const INITIAL_SPECS = [{ key: "", value: "" }];

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

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    isPublished: true,
    brochure: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(INITIAL_SPECS);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [productColorIds, setProductColorIds] = useState<number[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProduct(id);
        setProductData(data);
        
        // Update form state with loaded data
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          isPublished: data.isPublished,
          brochure: data.brochure,
        });
        setImages(data.images || []);
        setImagePreviews(data.imagePreviews || []);
        setSpecs(data.specs || INITIAL_SPECS);
        setSelectedBrandId(data.brandId || null);
        setSelectedCategoryId(data.categoryId || null);
        setProductColorIds(data.colorIds || []);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    router.push("/admin/product/all-products");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsSubmitting(true);

    try {
      const specsObject = specs.reduce((acc, spec) => {
        if (spec.key && spec.value) {
          acc[spec.key] = spec.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const submitData = {
        ...formData,
        id,
        brandId: selectedBrandId,
        categoryId: selectedCategoryId,
        specs: specsObject,
        images,
        selectedColors: productColorIds,
      };

      // TODO: Replace with actual API call
      console.log("Updating product:", submitData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      toast.success("Product updated successfully!");

      // Redirect to products list
      router.push("/admin/product/all-products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  // Error state
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
    <div className="min-h-screen bg-gray-50 relative">
      <div className="pb-24">
        <div className="p-6">
          {/* Header with back button */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={handleCancel}
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edit Product
            </h1>
            <p className="text-gray-600">Update product information</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 xl:grid-cols-5 gap-6"
          >
            {/* Product Details Section */}
            <div className="xl:col-span-3 space-y-6">
              {/* Basic Information */}
              <ComponentCard
                title="Basic Information"
                desc="Update the basic details of your product"
              >
                <div className="grid grid-cols-1 gap-6">
                  <DefaultInput
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />

                  <DefaultTextarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>
              </ComponentCard>

              {/* Product Images */}
              <ComponentCard
                title="Product Images"
                desc="Update product images (up to 10 images)"
              >
                <PhotoUpload
                  label="Product Images"
                  images={images}
                  required={false}
                  imagePreviews={imagePreviews}
                  onImageUpload={handleImageUpload}
                  onRemoveImage={removeImage}
                  maxImages={10}
                  maxSizeText="up to 10MB each"
                  acceptedFormats="PNG, JPG, GIF"
                  uploadText="Click to upload product images"
                />
              </ComponentCard>

              {/* Specifications */}
              <Specifications
                specifications={specs}
                onSpecificationsChange={setSpecs}
              />
            </div>

            {/* Pricing & Actions Section */}
            <div className="xl:col-span-2 space-y-6">
              {/* Pricing & Inventory */}
              <ComponentCard
                title="Pricing & Inventory"
                desc="Update pricing and stock information"
              >
                <div className="grid grid-cols-1 gap-6">
                  <DefaultNumberInput
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    required
                    helpText="Enter the selling price"
                  />

                  <DefaultNumberInput
                    label="Stock Quantity"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min={0}
                    placeholder="0"
                    required
                    helpText="Available quantity in inventory"
                  />

                  <DefaultCheckbox
                    label="Published"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleCheckboxChange}
                    helpText="Make this product visible to customers"
                  />
                </div>
              </ComponentCard>

              {/* Brand & Category */}
              <ComponentCard
                title="Product Attributes"
                desc="Update brand, category, and colors"
              >
                <AttributeSelector
                  selectedBrandId={selectedBrandId}
                  selectedCategoryId={selectedCategoryId}
                  onBrandChange={setSelectedBrandId}
                  onCategoryChange={setSelectedCategoryId}
                  selectedColorIds={productColorIds}
                  onColorsChange={setProductColorIds}
                />
              </ComponentCard>

              <ComponentCard
                title="Brochure"
                desc="Update the URL to an existing document"
              >
                <div className="space-y-4">
                  {/* URL Input */}
                  <DefaultInput
                    type="url"
                    placeholder="https://example.com/brochure.pdf"
                    label="Brochure URL"
                    name="brochure"
                    value={formData.brochure}
                    onChange={handleInputChange}
                    helpText="Supported formats: PDF, DOC, DOCX, PPT, PPTX (max 50MB)"
                  />

                  {/* URL Preview */}
                  {formData.brochure && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">
                          {formData.brochure}
                        </p>
                      </div>
                      <a
                        href={formData.brochure}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Preview
                      </a>
                    </div>
                  )}
                </div>
              </ComponentCard>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Action Card */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between space-x-4">
            {/* Last saved info - hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 flex-shrink-0">
              <span>Last saved: Never</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <DefaultButton
                variant="secondary"
                onClick={handleCancel}
                size="sm"
                className="flex-1 sm:flex-none py-2"
                disabled={isSubmitting}
              >
                <span className="sm:hidden">Cancel</span>
                <span className="hidden sm:inline">Cancel</span>
              </DefaultButton>

              <DefaultButton
                variant="primary"
                onClick={handleSubmit}
                icon={Save}
                iconPosition="left"
                size="sm"
                className="flex-1 sm:flex-none py-2"
                disabled={isSubmitting}
              >
                <span className="sm:hidden">Update</span>
                <span className="hidden sm:inline">Update Product</span>
              </DefaultButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}