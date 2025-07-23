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
import { getProductById, updateProduct } from "@/api/product";
import { convertApiImagesToFormImages } from "@/lib/imageUtils";

interface FormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  isPublished: boolean;
  isFeature: boolean; 
  brochure: string;
  brandId: number | null;
  categoryId: number | null;
  colorIds: number[];
  featureTagIds: number[];
  marketingTagIds: number[];
  specs: { key: string; value: string }[];
  images: { file?: File; preview: string; existingPath?: string }[];
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  isPublished: true,
  isFeature: true,
  brochure: "",
  brandId: null,
  categoryId: null,
  colorIds: [],
  featureTagIds: [],
  marketingTagIds: [],
  specs: [{ key: "", value: "" }],
  images: [],
};

// Fetch product data using the centralized image utilities
const fetchProduct = async (id: string): Promise<FormData & { id: string }> => {
  const data = await getProductById(Number(id));
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock,
    isPublished: data.isPublished,
    isFeature: data.isFeature,
    brochure: data.brochure || "",
    brandId: data.brandId || null,
    categoryId: data.categoryId || null,
    colorIds:
      data.colors?.map((colorRelation: { color: { id: number } }) => colorRelation.color.id) || [],
    featureTagIds:
      data.featureTags?.map((tagRelation: { tag: { id: number } }) => tagRelation.tag.id) || [],
    marketingTagIds:
      data.marketingTags?.map((tagRelation: { tag: { id: number } }) => tagRelation.tag.id) || [],
    specs: data.specs
      ? Object.entries(data.specs).map(([key, value]) => ({
          key,
          value: String(value),
        }))
      : [{ key: "", value: "" }],
    images: convertApiImagesToFormImages(data.images || []),
  };
};

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProduct(id);
        setForm(data);
      } catch {
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

  const validateForm = (): boolean => {
    // Required field validations
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (form.price <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }

    if (form.stock < 0) {
      toast.error("Stock quantity cannot be negative");
      return false;
    }

    if (form.images.length === 0) {
      toast.error("At least one product image is required");
      return false;
    }

    // Validate specifications (only if any spec has a key or value)
    const hasIncompleteSpecs = form.specs.some(
      (spec) => (spec.key && !spec.value) || (!spec.key && spec.value)
    );
    if (hasIncompleteSpecs) {
      toast.error("Please complete all specification key-value pairs or remove empty ones");
      return false;
    }

    // Validate brochure URL if provided
    if (form.brochure && !isValidUrl(form.brochure)) {
      toast.error("Please enter a valid brochure URL");
      return false;
    }

    return true;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (form.images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    files.forEach((file) => {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not a valid image format`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { file, preview }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleCancel = () => {
    router.push("/admin/product/all-products");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const specsObject = form.specs.reduce((acc, spec) => {
        if (spec.key && spec.value) {
          acc[spec.key] = spec.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", String(form.price));
      formData.append("stock", String(form.stock));
      formData.append("isPublished", String(form.isPublished));
      formData.append("isFeature", String(form.isFeature));
      formData.append("brochure", form.brochure);

      if (form.brandId) formData.append("brandId", String(form.brandId));
      if (form.categoryId)
        formData.append("categoryId", String(form.categoryId));

      formData.append("colorIds", JSON.stringify(form.colorIds));
      formData.append("featureTagIds", JSON.stringify(form.featureTagIds));
      formData.append("marketingTagIds", JSON.stringify(form.marketingTagIds));

      // Separate new and existing images
      const existingImagePaths: string[] = [];
      form.images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        } else if (img.existingPath) {
          existingImagePaths.push(img.existingPath);
        }
      });
      formData.append("specs", JSON.stringify(specsObject));

      // Always send the existing images as a JSON string
      formData.append("existingImages", JSON.stringify(existingImagePaths));

      await updateProduct(Number(id), formData);
      toast.success("Product updated successfully!");
      router.push("/admin/product/all-products");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { errors?: string; message?: string } }; message?: string })?.response?.data?.errors ||
        (error as { response?: { data?: { errors?: string; message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "An unexpected error occurred";
      
      toast.error(`Failed to update product: ${typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Enter product name"
                    required
                  />

                  <DefaultTextarea
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>
              </ComponentCard>

              {/* Product Images */}
              <ComponentCard
                title="Product Images"
                desc="Update product images (at least 1 image required, up to 10 images)"
              >
                <PhotoUpload
                  label="Product Images"
                  images={form.images.map((img) => img.file).filter((f): f is File => !!f)}
                  required={true}
                  imagePreviews={form.images.map((img) => img.preview)}
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
                specifications={form.specs}
                onSpecificationsChange={(specs) =>
                  setForm((prev) => ({ ...prev, specs }))
                }
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
                    value={form.price}
                    onChange={handleFormChange}
                    min={0.01}
                    step={0.01}
                    placeholder="0.00"
                    required
                    helpText="Enter the selling price (must be greater than 0)"
                  />

                  <DefaultNumberInput
                    label="Stock Quantity"
                    name="stock"
                    value={form.stock}
                    onChange={handleFormChange}
                    min={0}
                    placeholder="0"
                    required
                    helpText="Available quantity in inventory"
                  />

                  <DefaultCheckbox
                    label="Published"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleFormChange}
                    helpText="Make this product visible to customers"
                  />

                   <DefaultCheckbox
                    label="Feature"
                    name="isFeature"
                    checked={form.isFeature}
                    onChange={handleFormChange}
                    helpText="Make this product a featured item"
                  />
                </div>
              </ComponentCard>

              {/* Brand, Category, Colors, and Tags */}
              <ComponentCard
                title="Product Attributes"
                desc="Update brand, category, colors, and tags"
              >
                <AttributeSelector
                  selectedBrandId={form.brandId}
                  selectedCategoryId={form.categoryId}
                  onBrandChange={(brandId) =>
                    setForm((prev) => ({ ...prev, brandId }))
                  }
                  onCategoryChange={(categoryId) =>
                    setForm((prev) => ({ ...prev, categoryId }))
                  }
                  selectedColorIds={form.colorIds}
                  onColorsChange={(colorIds) =>
                    setForm((prev) => ({ ...prev, colorIds }))
                  }
                  selectedFeatureTagIds={form.featureTagIds}
                  onFeatureTagsChange={(featureTagIds) =>
                    setForm((prev) => ({ ...prev, featureTagIds }))
                  }
                  selectedMarketingTagIds={form.marketingTagIds}
                  onMarketingTagsChange={(marketingTagIds) =>
                    setForm((prev) => ({ ...prev, marketingTagIds }))
                  }
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
                    value={form.brochure}
                    onChange={handleFormChange}
                    helpText="Supported formats: PDF, DOC, DOCX, PPT, PPTX (max 50MB)"
                  />

                  {/* URL Preview */}
                  {form.brochure && (
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
                          {form.brochure}
                        </p>
                      </div>
                      <a
                        href={form.brochure}
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
      <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 sm:w-full sm:max-w-sm ">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-center space-x-4">
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