"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import AddDetailsPopup from "../../../common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "../photoUpload";
import IconUpload from "../iconUpload";
import { categoryService, Category } from "@/services/categoryService";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";

interface CategorySelectorProps {
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

interface CategoryFormData {
  name: string;
  image: File | null;
  imagePreview: string;
  icon: File | null;
  iconPreview: string;
}

const INITIAL_CATEGORY_FORM: CategoryFormData = {
  name: "",
  image: null,
  imagePreview: "",
  icon: null,
  iconPreview: "",
};

export default function CategorySelector({
  selectedCategoryId,
  onCategoryChange,
}: CategorySelectorProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const [form, setForm] = useState<CategoryFormData>({
    ...INITIAL_CATEGORY_FORM,
  });
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load categories");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (updates: Partial<CategoryFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleImageUpload = (files: File[], imageType: "image" | "icon") => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewKey = imageType === "image" ? "imagePreview" : "iconPreview";
      updateForm({
        [imageType]: file,
        [previewKey]: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (imageType: "image" | "icon") => {
    const previewKey = imageType === "image" ? "imagePreview" : "iconPreview";
    updateForm({
      [imageType]: null,
      [previewKey]: "",
    });
  };

  const handleCategoryChange = (value: string | number | null) => {
    onCategoryChange(value as number | null);
  };

  const isFormValid = () => {
    return form.name.trim() !== "" && form.image !== null && form.icon !== null;
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      const newCategory = await categoryService.createCategory({
        name: form.name,
        image: form.image!,
        icon: form.icon!,
      });

      setCategories((prev) => [...prev, newCategory]);
      handleCancel();
    } catch (err) {
      setError("Failed to create category");
      console.error("Error creating category:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...INITIAL_CATEGORY_FORM });
    setShowValidation(false);
    setError(null);
    setShowAddPopup(false);
  };

  // Convert categories to dropdown options
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <button
          type="button"
          onClick={() => router.push('/admin/attributes/category')}
          disabled={loading}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} className="mr-1" />
          Add Category
        </button>
      </div>

      <Dropdown
        id="category"
        name="category"
        value={selectedCategoryId}
        onChange={handleCategoryChange}
        options={categoryOptions}
        placeholder="Select a category"
        disabled={loading}
        size="md"
      />

      {/* Add Category Popup */}
      <AddDetailsPopup
        isOpen={showAddPopup}
        onClose={handleCancel}
        title="Add New Category"
        description="Create a new category for your products"
        onSave={handleSave}
        onCancel={handleCancel}
        saveButtonText={loading ? "Creating..." : "Add Category"}
        maxWidth="md"
      >
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <DefaultInput
            label="Category Name *"
            name="categoryName"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            placeholder="Enter category name (e.g., Laptops, Smartphones)"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <PhotoUpload
              label="Category Image"
               required
                images={form.image ? [form.image] : []}
                imagePreviews={form.imagePreview ? [form.imagePreview] : []}
                onImageUpload={(e) =>
                  handleImageUpload(Array.from(e.target.files || []), "image")
                }
                onRemoveImage={() => handleRemove("image")}
                maxImages={1}
                maxSizeText="up to 10MB each"
                acceptedFormats="PNG, JPG"
                uploadText="Click to upload image"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Icon *
              </label>
              <IconUpload
                images={form.icon ? [form.icon] : []}
                imagePreviews={form.iconPreview ? [form.iconPreview] : []}
                onImageUpload={(e) =>
                  handleImageUpload(Array.from(e.target.files || []), "icon")
                }
                onRemoveImage={() => handleRemove("icon")}
                maxImages={1}
              />
            </div>
          </div>

          {!isFormValid() && showValidation && !loading && (
            <p className="text-sm text-red-600">
              Please fill in all required fields: name, image, and icon.
            </p>
          )}
        </div>
      </AddDetailsPopup>
    </div>
  );
}
