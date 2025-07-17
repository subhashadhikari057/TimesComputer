"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";
import IconUpload from "@/components/admin/product/iconUpload";
import { toast } from "sonner";
import { categoryService } from "@/services/categoryService";

interface CategoryFormData {
  id?: number;
  name: string;
  image: File | null;
  imagePreview: string;
  icon: File | null;
  iconPreview: string;
}

interface CategoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<CategoryFormData>;
}

const INITIAL_FORM_DATA: CategoryFormData = {
  name: "",
  image: null,
  imagePreview: "",
  icon: null,
  iconPreview: "",
};

export default function CategoryPopup({
  isOpen,
  onClose,
  initialData = {},
}: CategoryPopupProps) {
  const [form, setForm] = useState<CategoryFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const isEditMode = initialData && initialData.id;

  // Reset form when popup opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      const updatedForm = { ...INITIAL_FORM_DATA, ...initialData };

      // Handle existing images for edit mode
      if (initialData.image && typeof initialData.image === "string") {
        updatedForm.imagePreview = initialData.image;
        updatedForm.image = null;
      }

      // Handle existing icons for edit mode
      if (initialData.icon && typeof initialData.icon === "string") {
        updatedForm.iconPreview = initialData.icon;
        updatedForm.icon = null;
      }

      setForm(updatedForm);
      setShowValidation(false);
      setError(null);
    }
  }, [isOpen]);

  const resetForm = () => {
    setForm({ ...INITIAL_FORM_DATA, ...initialData });
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
      (form.image !== null || form.imagePreview !== "") &&
      (form.icon !== null || form.iconPreview !== "")
    );
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      // Only pass image and icon if they are File, otherwise omit them
      const saveData: any = {
        name: form.name,
      };
      if (form.image) saveData.image = form.image;
      if (form.icon) saveData.icon = form.icon;

      if (isEditMode) {
        if (!form.image || !form.icon) {
          setError(
            "Both image and icon are required for updating the category."
          );
          setLoading(false);
          return;
        }
        await categoryService.updateCategory(initialData.id!, {
          name: form.name,
          image: form.image,
          icon: form.icon,
        });
        toast.success("Category updated successfully!");
      } else {
        await categoryService.createCategory(saveData);
        toast.success("Category created successfully!");
      }

      handleCancel();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditMode ? "update" : "create"} category`;

      setError(errorMessage);
      toast.error(errorMessage);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} category:`,
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (files: File[], imageType: "image" | "icon") => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    let allowedTypes: string[];
    let errorMessage: string;

    if (imageType === "icon") {
      allowedTypes = ["image/svg+xml"];
      errorMessage =
        "Invalid file type. Please upload SVG files only for icons.";
    } else {
      allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      errorMessage =
        "Invalid file type. Please upload PNG, JPG, or WebP files.";
    }

    if (!allowedTypes.includes(file.type)) {
      setError(errorMessage);
      return;
    }

    // Validate file size (10MB limit)
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
      [imageType]: null,
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
          ? "Edit the category for your products"
          : "Create a new category for your products"
      }
      onSave={handleSave}
      onCancel={handleCancel}
      saveButtonText={
        loading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update"
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

        {/* Name Field */}
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

        {/* Image and Icon Upload */}
        <div className="grid gap-4 grid-cols-2">
          <div>
            <PhotoUpload
              label="Category Image"
              required={true}
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
          </div>

          <div>
            <IconUpload
              label="Category Icon"
              images={form.icon ? [form.icon] : []}
              required={true}
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
        </div>

        {/* Validation Message */}
        {!isFormValid() && showValidation && !loading && (
          <p className="text-sm text-red-600">
            Please fill in all required fields: name, image, icon.
          </p>
        )}
      </div>
    </AddDetailsPopup>
  );
}
