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
  description: string;
  price: number;
  stock: number;
  isPublished: boolean;
  brochure: string;
  brandId: number | null;
  categoryId: number | null;
  colorIds: number[];
  specs: { key: string; value: string }[];
  images: { file: File; preview: string }[];
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  isPublished: true,
  brochure: "",
  brandId: null,
  categoryId: null,
  colorIds: [],
  specs: [{ key: "", value: "" }],
  images: [],
};

export default function CreateProduct() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "number" ? Number(value) : value),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { file, preview }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_DATA);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      formData.append("brochure", form.brochure);
      if (form.brandId) formData.append("brandId", String(form.brandId));
      if (form.categoryId) formData.append("categoryId", String(form.categoryId));
      form.colorIds.forEach((id) => formData.append("colorIds", String(id)));
      form.images.forEach((img) => formData.append("images", img.file));
      formData.append("specs", JSON.stringify(specsObject));

      await createProduct(formData);
      toast.success("Product created successfully!");
      router.push("/admin/product/all-products");
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
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
                desc="Upload product images (up to 10 images)"
              >
                <PhotoUpload
                  label="Product Images"
                  images={form.images.map(img => img.file)}
                  required={true}
                  imagePreviews={form.images.map(img => img.preview)}
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
                onSpecificationsChange={(specs) => setForm(prev => ({ ...prev, specs }))}
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
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    required
                    helpText="Enter the selling price"
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
                </div>
              </ComponentCard>

              {/* Brand & Category */}
              <ComponentCard
                title="Product Attributes"
                desc="Set brand, category, and colors"
              >
                <AttributeSelector
                  selectedBrandId={form.brandId}
                  selectedCategoryId={form.categoryId}
                  onBrandChange={(brandId) => setForm(prev => ({ ...prev, brandId }))}
                  onCategoryChange={(categoryId) => setForm(prev => ({ ...prev, categoryId }))}
                  selectedColorIds={form.colorIds}
                  onColorsChange={(colorIds) => setForm(prev => ({ ...prev, colorIds }))}
                />
              </ComponentCard>

              <ComponentCard
                title="Brochure"
                desc="Provide a URL to an existing document"
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
                <span className="sm:hidden">Save</span>
                <span className="hidden sm:inline">Save Product</span>
              </DefaultButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}