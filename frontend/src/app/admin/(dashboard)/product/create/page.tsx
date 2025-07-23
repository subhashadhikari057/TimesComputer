"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import ComponentCard from "@/components/common/ComponentsCard";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import DefaultTextarea from "@/components/form/form-elements/DefaultTextarea";
import DefaultNumberInput from "@/components/form/form-elements/DefaultNumberInput";
import DefaultCheckbox from "@/components/form/form-elements/DefaultCheckbox";
import PhotoUpload from "@/components/admin/product/photoUpload";
import Specifications from "@/components/admin/product/specification";
import AttributeSelector from "@/components/admin/product/attributes";
import DefaultButton from "@/components/form/form-elements/DefaultButton";
import { createProduct } from "@/api/product";

interface FormData {
  name: string;
  slug: string;
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
  images: { file: File; preview: string }[];
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  slug: "",
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

export default function CreateProduct() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const validateForm = (): boolean => {
    // Required field validations
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!form.slug.trim()) {
      toast.error("Product slug is required");
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

    setForm((prev) => {
      const newForm = {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      };

      // Auto-generate slug when name changes
      if (name === "name" && value) {
        newForm.slug = generateSlug(value);
      }

      return newForm;
    });
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

  const resetForm = () => {
    setForm(INITIAL_FORM_DATA);
    toast.success("Form reset successfully");
  };

  const buildSubmissionData = () => {
    const specsObject = form.specs.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, string>);

    const submissionData = new FormData();
    
    // Basic fields
    submissionData.append("name", form.name);
    submissionData.append("description", form.description);
    submissionData.append("price", String(form.price));
    submissionData.append("stock", String(form.stock));
    submissionData.append("isPublished", String(form.isPublished));
    submissionData.append("isFeature", String(form.isFeature));
    submissionData.append("brochure", form.brochure);
    
    // Optional fields
    if (form.brandId) submissionData.append("brandId", String(form.brandId));
    if (form.categoryId) submissionData.append("categoryId", String(form.categoryId));
    
    // Arrays
    if (form.colorIds.length > 0) {
      submissionData.append("colorIds", JSON.stringify(form.colorIds));
    }
    if (form.featureTagIds.length > 0) {
      submissionData.append("featureTagIds", JSON.stringify(form.featureTagIds));
    }
    if (form.marketingTagIds.length > 0) {
      submissionData.append("marketingTagIds", JSON.stringify(form.marketingTagIds));
    }
    
    // Images and specs
    form.images.forEach((img) => submissionData.append("images", img.file));
    submissionData.append("specs", JSON.stringify(specsObject));

    return submissionData;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const submissionData = buildSubmissionData();
      await createProduct(submissionData);
      
      toast.success("Product created successfully!");
      router.push("/admin/product/all-products");
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { errors?: string; message?: string } }; message?: string })?.response?.data?.errors ||
        (err as { response?: { data?: { errors?: string; message?: string } }; message?: string })?.response?.data?.message ||
        (err as { message?: string })?.message ||
        "An unexpected error occurred";
      
      toast.error(`Failed to create product: ${typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="pb-24">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create New Product
            </h1>
            <p className="text-gray-600">Add a new product to your inventory</p>
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
                desc="Add the basic details of your product"
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

                  <DefaultInput
                    label="Product Slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleFormChange}
                    placeholder="product-slug (auto-generated from name)"
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
                desc="Upload product images (up to 10 images) - At least one image is required"
              >
                <PhotoUpload
                  label="Product Images"
                  images={form.images.map((img) => img.file)}
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
                desc="Set pricing and stock information"
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

              {/* Brand & Category */}
              <ComponentCard
                title="Product Attributes"
                desc="Set brand, category, colors, and tags"
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
                desc="Provide a URL to an existing document (optional)"
              >
                <div className="space-y-4">
                  <DefaultInput
                    type="url"
                    placeholder="https://example.com/brochure.pdf"
                    label="Brochure URL"
                    name="brochure"
                    value={form.brochure}
                    onChange={handleFormChange}
                    helpText="Supported formats: PDF, DOC, DOCX, PPT, PPTX (max 50MB)"
                  />

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
      <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 sm:w-full sm:max-w-sm">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <DefaultButton
                variant="secondary"
                onClick={resetForm}
                size="sm"
                className="flex-1 sm:flex-none py-2"
                disabled={isSubmitting}
              >
                <span className="sm:hidden">Discard</span>
                <span className="hidden sm:inline">Discard</span>
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
                <span className="sm:hidden">
                  {isSubmitting ? "Saving..." : "Save"}
                </span>
                <span className="hidden sm:inline">
                  {isSubmitting ? "Saving Product..." : "Save Product"}
                </span>
              </DefaultButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}