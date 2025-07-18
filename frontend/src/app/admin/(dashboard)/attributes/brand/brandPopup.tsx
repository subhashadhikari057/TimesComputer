"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";
import IconUpload from "@/components/admin/product/iconUpload";
import { toast } from "sonner";
import { createBrand, updateBrand } from "@/api/brand";

interface BrandFormData {
  id?: number;
  name: string;
  image: File | null;
  imagePreview: string;
  iconPreview: string;
}

// Interface for data coming from the table (with string URLs)  //remove this
interface BrandData {
  id?: number;
  name: string;
  image?: string | File;
  [key: string]: any; // Allow other properties
}

interface BrandPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<BrandData>;
}

const INITIAL_FORM_DATA: BrandFormData = {
  name: "",
  image: null,
  imagePreview: "",
  iconPreview: "",
};

export default function BrandPopup({
  isOpen,
  onClose,
  initialData = {},
}: BrandPopupProps) {
  const [form, setForm] = useState<BrandFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const isEditMode = initialData && initialData.id;

  // Reset form when popup opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      const updatedForm: BrandFormData = {
        ...INITIAL_FORM_DATA,
        id: initialData.id,
        name: initialData.name || "",
      };

      // Handle existing images for edit mode
      if (initialData.image && typeof initialData.image === "string") {
        updatedForm.imagePreview = initialData.image;
        updatedForm.image = null;
      } else if (initialData.image instanceof File) {
        updatedForm.image = initialData.image;
      }

      setForm(updatedForm);
      setShowValidation(false);
      setError(null);
    }
  }, [isOpen]);

  const resetForm = () => {
    const resetData: BrandFormData = {
      ...INITIAL_FORM_DATA,
      id: initialData.id,
      name: initialData.name || "",
    };

    if (initialData.image && typeof initialData.image === "string") {
      resetData.imagePreview = initialData.image;
    }

    if (initialData.icon && typeof initialData.icon === "string") {
      resetData.iconPreview = initialData.icon;
    }

    setForm(resetData);
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
      (form.image !== null || form.imagePreview !== "")
    );
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      if (!form.image) {
        setError("Both image and icon are required.");
        setLoading(false);
        return;
      }

      const saveData = {
        name: form.name,
        image: form.image,
      };

      if (isEditMode) {
        await updateBrand(initialData.id!, saveData);
        toast.success("Brand updated successfully!");
      } else {
        await createBrand(saveData);
        toast.success("Brand created successfully!");
      }

      handleCancel();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message ||
        `Failed to ${isEditMode ? "update" : "create"} brand`;

      setError(errorMessage);
      toast.error(errorMessage);
      console.error(`Error ${isEditMode ? "updating" : "creating"} brand:`, err);
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
      allowedTypes = ['image/svg+xml'];
      errorMessage = "Invalid file type. Please upload SVG files only for icons.";
    } else {
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      errorMessage = "Invalid file type. Please upload PNG, JPG, or WebP files.";
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
      setForm(prev => ({
        ...prev,
        [imageType]: file,
        [previewKey]: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (imageType: "image" | "icon") => {
    const previewKey = imageType === "image" ? "imagePreview" : "iconPreview";
    setForm(prev => ({
      ...prev,
      [imageType]: null,
      [previewKey]: "",
    }));
  };

  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditMode ? "Edit Brand" : "Add New Brand"}
      description={isEditMode ? "Edit the brand for your products" : "Create a new brand for your products"}
      onSave={handleSave}
      onCancel={handleCancel}
      saveButtonText={
        loading
          ? isEditMode ? "Updating..." : "Creating..."
          : isEditMode ? "Update" : "Add Brand"
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
          label="Brand Name *"
          name="name"
          value={form.name}
          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter brand name (e.g., Apple, Samsung)"
          required
        />

        {/* Image and Icon Upload */}
        <div className="grid gap-4 grid-cols-2">
          <div>
            <PhotoUpload
              label="Brand Image"
              required={true}
              images={form.image ? [form.image] : []}
              imagePreviews={form.imagePreview ? [form.imagePreview] : []}
              onImageUpload={(e) =>
                handleImageUpload(Array.from(e.target.files || []), "image")
              }
              onRemoveImage={() => handleRemove("image")}
              maxImages={1}

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