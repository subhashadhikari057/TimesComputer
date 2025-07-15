"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ComponentCard from "@/components/common/ComponentsCard";
import AddDetailsPopup from "./add_details_popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "./photoUpload";
import IconUpload from "./iconUpload";
import { brandService, Brand } from "@/services/brandService";
import { categoryService, Category } from "@/services/categoryService";

interface BrandCategorySelectorProps {
  selectedBrandId: number | null;
  selectedCategoryId: number | null;
  onBrandChange: (brandId: number | null) => void;
  onCategoryChange: (categoryId: number | null) => void;
}

interface FormData {
  name: string;
  images: File[];
  imagePreviews: string[];
  icons: File[];
  iconPreviews: string[];
}

export default function BrandCategorySelector({
  selectedBrandId,
  selectedCategoryId,
  onBrandChange,
  onCategoryChange,
}: BrandCategorySelectorProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBrandPopup, setShowBrandPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

  // Combined form state
  const [brandForm, setBrandForm] = useState<FormData>({
    name: "",
    images: [],
    imagePreviews: [],
    icons: [],
    iconPreviews: [],
  });

  const [categoryForm, setCategoryForm] = useState<FormData>({
    name: "",
    images: [],
    imagePreviews: [],
    icons: [],
    iconPreviews: [],
  });

  // Validation state
  const [showBrandValidation, setShowBrandValidation] = useState(false);
  const [showCategoryValidation, setShowCategoryValidation] = useState(false);

  // Load initial data
  useEffect(() => {
    loadBrandsAndCategories();
  }, []);

  const loadBrandsAndCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const [brandsData, categoriesData] = await Promise.all([
        brandService.getAllBrands(),
        categoryService.getAllCategories(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load brands and categories");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generic image upload handler
  const handleImageUpload = (
    files: File[],
    formType: 'brand' | 'category',
    imageType: 'images' | 'icons'
  ) => {
    const setForm = formType === 'brand' ? setBrandForm : setCategoryForm;
    const previewKey = imageType === 'images' ? 'imagePreviews' : 'iconPreviews';

    setForm(prev => ({
      ...prev,
      [imageType]: files,
    }));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm(prev => ({
          ...prev,
          [previewKey]: [e.target?.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Generic remove handler
  const handleRemove = (
    formType: 'brand' | 'category',
    imageType: 'images' | 'icons'
  ) => {
    const setForm = formType === 'brand' ? setBrandForm : setCategoryForm;
    const previewKey = imageType === 'images' ? 'imagePreviews' : 'iconPreviews';

    setForm(prev => ({
      ...prev,
      [imageType]: [],
      [previewKey]: [],
    }));
  };

  // Dropdown handlers
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onBrandChange(value === "" ? null : Number(value));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onCategoryChange(value === "" ? null : Number(value));
  };

  // Form validation
  const isFormValid = (form: FormData) => {
    return form.name.trim() !== "" && form.images.length > 0 && form.icons.length > 0;
  };

  // Generic save handler
  const handleSave = async (type: 'brand' | 'category') => {
    const form = type === 'brand' ? brandForm : categoryForm;
    const setList = type === 'brand' ? setBrands : setCategories;
    const setShowValidation = type === 'brand' ? setShowBrandValidation : setShowCategoryValidation;

    // Show validation when save is attempted
    setShowValidation(true);

    if (!isFormValid(form)) return;

    try {
      setLoading(true);
      setError(null);

      const allImages = [...form.images, ...form.icons];
      const newItem = type === 'brand' 
        ? await brandService.createBrand({ name: form.name, images: allImages })
        : await categoryService.createCategory({ name: form.name, images: allImages });

      setList((prev) => [...prev, newItem]);
      handleCancel(type);
    } catch (err) {
      setError(`Failed to create ${type}`);
      console.error(`Error creating ${type}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Generic cancel handler
  const handleCancel = (type: 'brand' | 'category') => {
    const setForm = type === 'brand' ? setBrandForm : setCategoryForm;
    const setShowPopup = type === 'brand' ? setShowBrandPopup : setShowCategoryPopup;
    const setShowValidation = type === 'brand' ? setShowBrandValidation : setShowCategoryValidation;

    setForm({
      name: "",
      images: [],
      imagePreviews: [],
      icons: [],
      iconPreviews: [],
    });
    setShowPopup(false);
    setShowValidation(false);
    setError(null);
  };

  // Render form content
  const renderFormContent = (type: 'brand' | 'category') => {
    const form = type === 'brand' ? brandForm : categoryForm;
    const showValidation = type === 'brand' ? showBrandValidation : showCategoryValidation;
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

    return (
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <DefaultInput
          label={`${capitalizedType} Name *`}
          name={`${type}Name`}
          value={form.name}
          onChange={(e) => {
            const setForm = type === 'brand' ? setBrandForm : setCategoryForm;
            setForm(prev => ({ ...prev, name: e.target.value }));
          }}
          placeholder={`Enter ${type} name (e.g., ${type === 'brand' ? 'Apple, Samsung' : 'Laptops, Smartphones'})`}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {capitalizedType} Image *
            </label>
            <PhotoUpload
              images={form.images}
              imagePreviews={form.imagePreviews}
              onImageUpload={(e) => handleImageUpload(Array.from(e.target.files || []), type, 'images')}
              onRemoveImage={() => handleRemove(type, 'images')}
              maxImages={1}
              maxSizeText="up to 10MB each"
              acceptedFormats="PNG, JPG"
              uploadText="Click to upload image"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {capitalizedType} Icon *
            </label>
            <IconUpload
              images={form.icons}
              imagePreviews={form.iconPreviews}
              onImageUpload={(e) => handleImageUpload(Array.from(e.target.files || []), type, 'icons')}
              onRemoveImage={() => handleRemove(type, 'icons')}
              maxImages={1}
            />
          </div>
        </div>

        {!isFormValid(form) && showValidation && !loading && (
          <p className="text-sm text-red-600">
            Please fill in all required fields: name, image, and icon.
          </p>
        )}
      </div>
    );
  };

  return (
    <ComponentCard
      title="Brand & Category"
      desc="Select the brand and category for this product"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-4">
            <span className="text-gray-500">Loading brands and categories...</span>
          </div>
        ) : (
          <>
            {/* Brand Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setShowBrandPopup(true);
                  }}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loading}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setShowCategoryPopup(true);
                  }}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loading}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Add Brand Popup */}
      <AddDetailsPopup
        isOpen={showBrandPopup}
        onClose={() => handleCancel('brand')}
        title="Add New Brand"
        description="Create a new brand for your products"
        onSave={() => handleSave('brand')}
        onCancel={() => handleCancel('brand')}
        saveButtonText={loading ? "Creating..." : "Add Brand"}
        maxWidth="md"
      >
        {renderFormContent('brand')}
      </AddDetailsPopup>

      {/* Add Category Popup */}
      <AddDetailsPopup
        isOpen={showCategoryPopup}
        onClose={() => handleCancel('category')}
        title="Add New Category"
        description="Create a new category for your products"
        onSave={() => handleSave('category')}
        onCancel={() => handleCancel('category')}
        saveButtonText={loading ? "Creating..." : "Add Category"}
        maxWidth="md"
      >
        {renderFormContent('category')}
      </AddDetailsPopup>
    </ComponentCard>
  );
}