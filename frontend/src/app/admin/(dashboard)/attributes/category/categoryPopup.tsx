"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";
import IconUpload from "@/components/admin/product/iconUpload";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/api/category";
import { capitalizeFirstWord } from "@/components/common/helper_function";
import { getImageUrl } from "@/lib/imageUtils";

interface CategoryFormData {
  id?: number;
  name: string;
  image?: File;
  imagePreview: string;
  icon?: File;
  iconPreview: string;
}

interface CategoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: number;
    name: string;
    image: string;
    icon: string;
  };
}

const INITIAL_FORM_DATA: CategoryFormData = {
  name: "",
  imagePreview: "",
  iconPreview: "",
};

export default function CategoryPopup({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: CategoryPopupProps) {
  const [form, setForm] = useState<CategoryFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const isEditMode = Boolean(initialData?.id);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          id: initialData.id,
          name: initialData.name,
          imagePreview: getImageUrl(initialData.image),
          iconPreview: getImageUrl(initialData.icon),
        });
      } else {
        setForm(INITIAL_FORM_DATA);
      }
      setShowValidation(false);
      setError(null);
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setForm(INITIAL_FORM_DATA);
    setShowValidation(false);
    setError(null);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isFormValid = () => {
    return (
      form.name.trim() !== "" &&
      (form.image || form.imagePreview) &&
      (form.icon || form.iconPreview)
    );
  };

  const handleSave = async () => {
    setShowValidation(true);
    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("name", form.name);
      if (form.image) formData.append("image", form.image);
      if (form.icon) formData.append("icon", form.icon);

      if (isEditMode) {
        await updateCategory(form.id!, formData);
        toast.success("Category updated successfully!");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully!");
      }

      if (onSuccess) {
        onSuccess();
      }

      handleCancel();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error occurred";

      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate")
      ) {
        toast.error(
          "Category name already exists. Please choose a different name."
        );
      } else {
        toast.error(`Failed to ${isEditMode ? "update" : "create"} category`);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = capitalizeFirstWord(value);
    setForm((prev) => ({ ...prev, name: capitalizedValue }));
  };

  // Fixed image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type for regular images
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload PNG, JPG, or WebP files.");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large. Please upload files smaller than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Fixed icon upload handler
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type for icons (SVG only)
    if (file.type !== "image/svg+xml") {
      setError("Invalid file type. Please upload SVG files only for icons.");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large. Please upload files smaller than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((prev) => ({
        ...prev,
        icon: file,
        iconPreview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Fixed remove handlers
  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      image: undefined,
      imagePreview: "",
    }));
  };

  const removeIcon = () => {
    setForm((prev) => ({
      ...prev,
      icon: undefined,
      iconPreview: "",
    }));
  };

  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditMode ? "Edit Category" : "Add New Category"}
      description={
        isEditMode
          ? "Edit the category details. Only upload new files if you want to replace them."
          : "Create a new category for your products. Both image and icon are required."
      }
      onSave={handleSave}
      onCancel={handleCancel}
      saveButtonText={
        loading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update Category"
          : "Add Category"
      }
      isLoading={loading}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <DefaultInput
          label="Category Name"
          name="name"
          value={form.name}
          onChange={handleNameChange}
          placeholder="Enter category name (e.g., Electronics, Clothing)"
          required
        />

        <div className="grid gap-4 grid-cols-2">
          <PhotoUpload
            label="Category Image"
            required
            images={form.image ? [form.image] : []}
            imagePreviews={form.imagePreview ? [form.imagePreview] : []}
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
            maxImages={1}
            maxSizeText="up to 10MB"
            acceptedFormats="PNG, JPG, WebP"
            uploadText="Click to upload image"
          />

          <IconUpload
            label="Category Icon"
            required
            images={form.icon ? [form.icon] : []}
            imagePreviews={form.iconPreview ? [form.iconPreview] : []}
            onImageUpload={handleIconUpload}
            onRemoveImage={removeIcon}
            maxImages={1}
            acceptedFormats="SVG"
            maxSizeText="up to 10MB"
            uploadText="Click to upload SVG icon"
          />
        </div>

        {/* Validation Message */}
        {!isFormValid() && showValidation && !loading && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-medium">
              Required fields missing:
            </p>
            <ul className="text-sm text-amber-600 mt-1 list-disc list-inside">
              {form.name.trim() === "" && <li>Category name</li>}
              {!form.image && form.imagePreview === "" && (
                <li>Category image</li>
              )}
              {!form.icon && form.iconPreview === "" && <li>Category icon</li>}
            </ul>
          </div>
        )}
      </div>
    </AddDetailsPopup>
  );
}