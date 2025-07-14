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
    }, {} as Record<string, string>);

    const submitData = {
      ...formData,
      specs: specsObject,
      images,
      featureTags: selectedFeatureTags,
      marketingTags: selectedMarketingTags,
      colors: selectedColors,
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
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
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

              {/* Product Images -  */}
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
            </div>
          </form>
        </div>
      </div>

      {/* Floating Action Card */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Last saved: Never</span>
            </div>

            <div className="h-4 w-px bg-gray-300"></div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
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