"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import ComponentCard from "@/components/common/ComponentsCard";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import DefaultTextarea from "@/components/form/form-elements/DefaultTextarea";
import DefaultNumberInput from "@/components/form/form-elements/DefaultNumberInput";
import DefaultCheckbox from "@/components/form/form-elements/DefaultCheckbox";
import PhotoUpload from "@/components/admin/product/photoUpload";
import BrandCategorySelector from "@/components/admin/product/brandCategory";
import Specifications from "@/components/admin/product/specification";
import Variant from "@/components/admin/product/variant";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isPublished: boolean;
  brochure: string;
  brandId: number | null;
  categoryId: number | null;
}

interface VariantOption {
  id: string;
  name: string;
  value: string;
}

interface VariantGroup {
  id: string;
  name: string;
  options: VariantOption[];
}

interface VariantCombination {
  id: string;
  combination: { [groupId: string]: string };
  price: number;
  stock: number;
  sku: string;
  isEnabled: boolean;
}

export default function CreateProductPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    isPublished: true,
    brochure: "",
    brandId: null,
    categoryId: null,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFeatureTags, setSelectedFeatureTags] = useState<number[]>([]);
  const [selectedMarketingTags, setSelectedMarketingTags] = useState<number[]>(
    []
  );
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [variants, setVariants] = useState<VariantGroup[]>([]);
  const [variantCombinations, setVariantCombinations] = useState<
    VariantCombination[]
  >([]);

  // Mock data - replace with actual API calls
  const brands = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Samsung" },
    { id: 3, name: "Dell" },
  ];

  const categories = [
    { id: 1, name: "Laptops" },
    { id: 2, name: "Smartphones" },
    { id: 3, name: "Tablets" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const handleBrandChange = (brandId: number | null) => {
    setFormData((prev) => ({ ...prev, brandId }));
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setFormData((prev) => ({ ...prev, categoryId }));
  };

  const handleSpecificationsChange = (
    newSpecs: { key: string; value: string }[]
  ) => {
    setSpecs(newSpecs);
  };

  const handleVariantsChange = (newVariants: VariantGroup[]) => {
    setVariants(newVariants);
  };

  const handleVariantCombinationsChange = (
    newCombinations: VariantCombination[]
  ) => {
    setVariantCombinations(newCombinations);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    // Create previews
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Convert specs array to object
    const specsObject = specs.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, any>);

    const submitData = {
      ...formData,
      specs: specsObject,
      images,
      featureTags: selectedFeatureTags,
      marketingTags: selectedMarketingTags,
      colors: selectedColors,
      variants,
      variantCombinations,
    };

    console.log("Product data:", submitData);
    // Here you would send the data to your API
  };

  const handleDiscard = () => {
    // Reset form or navigate away
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      isPublished: true,
      brochure: "",
      brandId: null,
      categoryId: null,
    });
    setImages([]);
    setImagePreviews([]);
    setSelectedFeatureTags([]);
    setSelectedMarketingTags([]);
    setSelectedColors([]);
    setSpecs([{ key: "", value: "" }]);
    setVariants([]);
    setVariantCombinations([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Main Content with bottom padding for sticky footer */}
      <div className="pb-24">
        <div className="p-6">
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
            {/* Product Details Section - Takes 3/5 of space */}
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
                  images={images}
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
                onSpecificationsChange={handleSpecificationsChange}
              />

              {/* Variants */}
              <Variant
                variants={variants}
                variantCombinations={variantCombinations}
                onVariantsChange={handleVariantsChange}
                onCombinationsChange={handleVariantCombinationsChange}
              />
            </div>

            {/* Pricing & Actions Section - Takes 2/5 of space */}
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
              <BrandCategorySelector
                brands={brands}
                categories={categories}
                selectedBrandId={formData.brandId}
                selectedCategoryId={formData.categoryId}
                onBrandChange={handleBrandChange}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Floating Action Card */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-40">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Last saved: Never</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-gray-100 transition-all duration-200"
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}