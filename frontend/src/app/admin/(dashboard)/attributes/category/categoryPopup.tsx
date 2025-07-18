"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";
import IconUpload from "@/components/admin/product/iconUpload";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/api/category";


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
          imagePreview: initialData.image,
          iconPreview: initialData.icon,
        });
      } else {
        setForm(INITIAL_FORM_DATA);
      }
      setShowValidation(false);
      setError(null);
    }
  }, [isOpen]);

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
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditMode ? "update" : "create"} category`;
      setError(errorMessage);
      toast.error(
        `Error ${isEditMode ? "updating" : "creating"} category: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (files: File[], imageType: "image" | "icon") => {
    const file = files[0];
    if (!file) return;

    setError(null);

    let allowedTypes: string[];
    let errorMessage: string;

    if (imageType === "icon") {
      allowedTypes = ["image/svg+xml"];
      errorMessage = "Invalid file type. Please upload SVG files only for icons.";
    } else {
      allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      errorMessage = "Invalid file type. Please upload PNG, JPG, or WebP files.";
    }

    if (!allowedTypes.includes(file.type)) {
      setError(errorMessage);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large. Please upload files smaller than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewKey = imageType === "image" ? "imagePreview" : "iconPreview";
      setForm((prev) => ({
        ...prev,
        [imageType]: file,
        [previewKey]: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (imageType: "image" | "icon") => {
    const previewKey = imageType === "image" ? "imagePreview" : "iconPreview";
    setForm((prev) => ({
      ...prev,
      [imageType]: undefined,
      [previewKey]: "",
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
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <DefaultInput
          label="Category Name"
          name="name"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter category name (e.g., Electronics, Clothing)"
          required
        />

        <div className="grid gap-4 grid-cols-2">
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
            acceptedFormats="PNG, JPG, WebP"
            uploadText="Click to upload image"
          />

          <IconUpload
            label="Category Icon"
            required
            images={form.icon ? [form.icon] : []}
            imagePreviews={form.iconPreview ? [form.iconPreview] : []}
            onImageUpload={(e) =>
              handleImageUpload(Array.from(e.target.files || []), "icon")
            }
            onRemoveImage={() => handleRemove("icon")}
            maxImages={1}
            acceptedFormats="SVG"
            maxSizeText="up to 10MB each"
            uploadText="Click to upload SVG icon"
          />
        </div>

        {!isFormValid() && showValidation && !loading && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-medium">
              Required fields missing:
            </p>
            <ul className="text-sm text-amber-600 mt-1 list-disc list-inside">
              {form.name.trim() === "" && <li>Category name</li>}
              {!form.image && form.imagePreview === "" && <li>Category image</li>}
              {!form.icon && form.iconPreview === "" && <li>Category icon</li>}
            </ul>
          </div>
        )}
      </div>
    </AddDetailsPopup>
  );
}
