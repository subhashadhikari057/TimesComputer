"use client";

import { useState } from "react";
import { icons, Plus } from "lucide-react";
import ComponentCard from "@/components/common/ComponentsCard";
import AddDetailsPopup from "./add_details_popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import Dropdown from "@/components/form/form-elements/dropdown";
import PhotoUpload from "./photoUpload";
import IconUpload from "./iconUpload";

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface BrandCategorySelectorProps {
  brands: Brand[];
  categories: Category[];
  selectedBrandId: number | null;
  selectedCategoryId: number | null;
  onBrandChange: (brandId: number | null) => void;
  onCategoryChange: (categoryId: number | null) => void;
}

export default function BrandCategorySelector({
  brands,
  categories,
  selectedBrandId,
  selectedCategoryId,
  onBrandChange,
  onCategoryChange,
}: BrandCategorySelectorProps) {
  const [showAddBrandPopup, setShowAddBrandPopup] = useState(false);
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "" });
  const [newCategory, setNewCategory] = useState({ name: "" });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [icons, setIcons] = useState<File[]>([]);
  const [iconPreviews, setIconPreviews] = useState<string[]>([]);

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

  const handleIconsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setIcons((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeIcon = (index: number) => {
    setIcons((prev) => prev.filter((_, i) => i !== index));
    setIconPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onBrandChange(value === "" ? null : Number(value));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onCategoryChange(value === "" ? null : Number(value));
  };

  const handleSaveBrand = () => {
    // TODO: Implement brand saving logic
    console.log("Saving brand:", newBrand);
    setNewBrand({ name: "" });
    setShowAddBrandPopup(false);
  };

  const handleSaveCategory = () => {
    // TODO: Implement category saving logic
    console.log("Saving category:", newCategory);
    setNewCategory({ name: "" });
    setShowAddCategoryPopup(false);
  };

  const handleCancelBrand = () => {
    setNewBrand({ name: "" });
    setShowAddBrandPopup(false);
  };

  const handleCancelCategory = () => {
    setNewCategory({ name: "" });
    setShowAddCategoryPopup(false);
  };

  return (
    <ComponentCard
      title="Brand & Category"
      desc="Select the brand and category for this product"
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Brand Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700"
            >
              Brand
            </label>
            <button
              type="button"
              onClick={() => setShowAddBrandPopup(true)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus size={14} className="mr-1" />
              Add Brand
            </button>
          </div>
          <select
            id="brand"
            name="brand"
            value={selectedBrandId || ""}
            onChange={handleBrandChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-all duration-200"
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <button
              type="button"
              onClick={() => setShowAddCategoryPopup(true)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus size={14} className="mr-1" />
              Add Category
            </button>
          </div>
          <select
            id="category"
            name="category"
            value={selectedCategoryId || ""}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-all duration-200"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Brand Popup */}
      <AddDetailsPopup
        isOpen={showAddBrandPopup}
        onClose={() => setShowAddBrandPopup(false)}
        title="Add New Brand"
        description="Create a new brand for your products"
        onSave={handleSaveBrand}
        onCancel={handleCancelBrand}
        saveButtonText="Add Brand"
        maxWidth="md"
      >
        <div className="space-y-8">
          <DefaultInput
            label="Brand Name"
            name="brandName"
            value={newBrand.name}
            onChange={(e) =>
              setNewBrand((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter brand name (e.g., Apple, Samsung)"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <PhotoUpload
              images={images}
              imagePreviews={imagePreviews}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              maxImages={1}
              maxSizeText="up to 10MB each"
              acceptedFormats="PNG"
              uploadText="Click to upload images"
            />

            <IconUpload
              images={icons}
              imagePreviews={iconPreviews}
              onImageUpload={handleIconsUpload}
              onRemoveImage={removeIcon}
              maxImages={1}
            />
          </div>
        </div>
      </AddDetailsPopup>

      {/* Add Category Popup */}
      <AddDetailsPopup
        isOpen={showAddCategoryPopup}
        onClose={() => setShowAddCategoryPopup(false)}
        title="Add New Category"
        description="Create a new category for your products"
        onSave={handleSaveCategory}
        onCancel={handleCancelCategory}
        saveButtonText="Add Category"
        maxWidth="md"
      >
        <div className="space-y-4">
          <DefaultInput
            label="Category Name"
            name="categoryName"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter category name (e.g., Laptops, Smartphones)"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <PhotoUpload
              images={images}
              imagePreviews={imagePreviews}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              maxImages={1}
              maxSizeText="up to 10MB each"
              acceptedFormats="PNG"
              uploadText="Click to upload images"
            />

            <IconUpload
              images={icons}
              imagePreviews={iconPreviews}
              onImageUpload={handleIconsUpload}
              onRemoveImage={removeIcon}
              maxImages={1}
            />
          </div>
        </div>
      </AddDetailsPopup>
    </ComponentCard>
  );
}
