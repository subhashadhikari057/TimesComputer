"use client";

import { useState, useEffect } from "react";
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

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: ProductFormData & {
    id?: string;
    images?: File[];
    imagePreviews?: string[];
    specs?: { key: string; value: string }[];
    brandId?: number | null;
    categoryId?: number | null;
    colorIds?: number[];
  };
  productId?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const INITIAL_FORM_DATA: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  isPublished: true,
  brochure: "",
};

const INITIAL_SPECS = [{ key: "", value: "" }];

export default function ProductForm({
  mode,
  initialData,
  productId,
  onSubmit,
  onCancel,
  isLoading = false
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || INITIAL_FORM_DATA
  );
  const [images, setImages] = useState<File[]>(initialData?.images || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.imagePreviews || []
  );
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    initialData?.specs || INITIAL_SPECS
  );
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(
    initialData?.brandId || null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    initialData?.categoryId || null
  );
  const [productColorIds, setProductColorIds] = useState<number[]>(
    initialData?.colorIds || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData(initialData);
      setImages(initialData.images || []);
      setImagePreviews(initialData.imagePreviews || []);
      setSpecs(initialData.specs || INITIAL_SPECS);
      setSelectedBrandId(initialData.brandId || null);
      setSelectedCategoryId(initialData.categoryId || null);
      setProductColorIds(initialData.colorIds || []);
    }
  }, [initialData, mode]);

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

  const resetForm = () => {
    if (mode === 'create') {
      setFormData(INITIAL_FORM_DATA);
      setImages([]);
      setImagePreviews([]);
      setSpecs(INITIAL_SPECS);
      setSelectedBrandId(null);
      setSelectedCategoryId(null);
      setProductColorIds([]);
    } else {
      // For edit mode, reset to initial data
      if (initialData) {
        setFormData(initialData);
        setImages(initialData.images || []);
        setImagePreviews(initialData.imagePreviews || []);
        setSpecs(initialData.specs || INITIAL_SPECS);
        setSelectedBrandId(initialData.brandId || null);
        setSelectedCategoryId(initialData.categoryId || null);
        setProductColorIds(initialData.colorIds || []);
      }
    }
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
        brandId: selectedBrandId,
        categoryId: selectedCategoryId,
        specs: specsObject,
        images,
        selectedColors: productColorIds,
        ...(mode === 'edit' && { id: productId }),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = mode === 'create' ? 'Create New Product' : 'Edit Product';
  const pageDescription = mode === 'create' 
    ? 'Add a new product to your inventory' 
    : 'Update product information';
  const submitButtonText = mode === 'create' ? 'Save Product' : 'Update Product';
  const submitButtonTextMobile = mode === 'create' ? 'Save' : 'Update';

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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="pb-24">
        <div className="p-6">
          {/* Header with back button for edit mode */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              {mode === 'edit' && onCancel && (
                <button
                  onClick={onCancel}
                  className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {pageTitle}
            </h1>
            <p className="text-gray-600">{pageDescription}</p>
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
                desc="Upload product images (up to 10 images)"
              >
                <PhotoUpload
                  label="Product Images"
                  images={images}
                  required={mode === 'create'}
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
                desc="Set pricing and stock information"
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
                desc="Set brand, category, and colors"
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
                onClick={mode === 'create' ? resetForm : onCancel}
                size="sm"
                className="flex-1 sm:flex-none py-2"
                disabled={isSubmitting}
              >
                <span className="sm:hidden">
                  {mode === 'create' ? 'Discard' : 'Cancel'}
                </span>
                <span className="hidden sm:inline">
                  {mode === 'create' ? 'Discard' : 'Cancel'}
                </span>
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
                <span className="sm:hidden">{submitButtonTextMobile}</span>
                <span className="hidden sm:inline">{submitButtonText}</span>
              </DefaultButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}