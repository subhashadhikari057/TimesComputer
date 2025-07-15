"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import ComponentCard from "@/components/common/ComponentsCard";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import DefaultTextarea from "@/components/form/form-elements/DefaultTextarea";
import DefaultNumberInput from "@/components/form/form-elements/DefaultNumberInput";
import DefaultCheckbox from "@/components/form/form-elements/DefaultCheckbox";
import DefaultSelect from "@/components/form/form-elements/DefaultSelect";
import PhotoUpload from "@/components/admin/product/photoUpload";
import BrandCategorySelector from "@/components/admin/product/brandCategory";
import Specifications from "@/components/admin/product/specification";
import Colors from "@/components/admin/product/colors";

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

const initialFormData: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  stock: 0,
  isPublished: true,
  brochure: "",
  brandId: null,
  categoryId: null,
};

const initialSpecs = [{ key: "", value: "" }];

export default function CreateProductPage() {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFeatureTags, setSelectedFeatureTags] = useState<number[]>([]);
  const [selectedMarketingTags, setSelectedMarketingTags] = useState<number[]>(
    []
  );
  const [specs, setSpecs] =
    useState<{ key: string; value: string }[]>(initialSpecs);
  const [variants, setVariants] = useState<VariantGroup[]>([]);
  const [variantCombinations, setVariantCombinations] = useState<
    VariantCombination[]
  >([]);
  const [colors, setColors] = useState<
    { id: number; name: string; hex: string }[]
  >([
    { id: 1, name: "Black", hex: "#000000" },
    { id: 2, name: "White", hex: "#FFFFFF" },
    { id: 3, name: "Red", hex: "#EF4444" },
    { id: 4, name: "Blue", hex: "#3B82F6" },
  ]);
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);

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

  const resetForm = () => {
    setFormData(initialFormData);
    setImages([]);
    setImagePreviews([]);
    setSelectedFeatureTags([]);
    setSelectedMarketingTags([]);
    setSpecs(initialSpecs);
    setVariants([]);
    setVariantCombinations([]);
    setColors([
      { id: 1, name: "Black", hex: "#000000" },
      { id: 2, name: "White", hex: "#FFFFFF" },
      { id: 3, name: "Red", hex: "#EF4444" },
      { id: 4, name: "Blue", hex: "#3B82F6" },
    ]);
    setSelectedColorIds([]);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Convert specs array to object
    const specsObject = specs.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, string>);

    const submitData = {
      ...formData,
      specs: specsObject,
      images,
      featureTags: selectedFeatureTags,
      marketingTags: selectedMarketingTags,
      variants,
      variantCombinations,
      productColors: colors,
      selectedColors: selectedColorIds,
    };

    console.log("Product data:", submitData);
    // Here you would send the data to your API
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
                onSpecificationsChange={setSpecs}
              />

              {/* Variants
              <Variant
                variants={variants}
                variantCombinations={variantCombinations}
                onVariantsChange={setVariants}
                onCombinationsChange={setVariantCombinations}
              /> */}
            </div>

            {/* Pricing & Actions Section - Takes 2/5 of space */}
            <div className="xl:col-span-2 space-y-6">
              {/* Pricing & Inventory */}
              <ComponentCard
                title="Pricing & Inventory"
                desc="Set pricing and stock information"
              >
                <div className="grid grid-cols-1 gap-6">
                  <DefaultSelect
                    label="Brand"
                    name="brandId"
                    value={formData.brandId?.toString() || ""}
                    onChange={handleInputChange}
                    required
                    options={brands.map(brand => ({ id: brand.id, name: brand.name }))}
                    placeholder="Select a brand"
                  />

                  <DefaultSelect
                    label="Category"
                    name="categoryId"
                    value={formData.categoryId?.toString() || ""}
                    onChange={handleInputChange}
                    required
                    options={categories.map(category => ({ id: category.id, name: category.name }))}
                    placeholder="Select a category"
                  />

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
                selectedBrandId={formData.brandId}
                selectedCategoryId={formData.categoryId}
                onBrandChange={handleBrandChange}
                onCategoryChange={handleCategoryChange}
              />

              <Colors
                colors={colors}
                selectedColorIds={selectedColorIds}
                onColorsChange={setColors}
                onSelectedColorsChange={setSelectedColorIds}
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
                onClick={resetForm}
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
