"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";

import { toast } from "sonner";
import { createBrand, updateBrand } from "@/api/brand";

interface BrandFormData {
  id?: number;
  name: string;
  image?: File;
  imagePreview: string;
}

interface BrandPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: number;
    name: string;
    image: string;
  };
}

const INITIAL_FORM_DATA: BrandFormData = {
  name: "",
  imagePreview: "",
};

export default function BrandPopup({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: BrandPopupProps) {
  const [form, setForm] = useState<BrandFormData>(INITIAL_FORM_DATA);
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
      (form.image !== null || form.imagePreview !== "")
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

      if (isEditMode) {
        await updateBrand(form.id!, formData);
        toast.success("Brand updated successfully!");
      } else {
        await createBrand(formData);
        toast.success("Brand created successfully!");
      }

      if (onSuccess) {
        onSuccess();
      }

      handleCancel();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditMode ? "update" : "create"} brand`;

      setError(errorMessage);
      toast.error(errorMessage);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} brand:`,
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (files: File[], imageType: "image") => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    let allowedTypes: string[] = [];
    let errorMessage: string = "";

    if (imageType === "image") {
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
      const previewKey = "imagePreview";
      setForm((prev) => ({
        ...prev,
        [imageType]: file,
        [previewKey]: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (imageType: "image") => {
    const previewKey = "imagePreview";
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
      title={isEditMode ? "Edit Brand" : "Add New Brand"}
      description={
        isEditMode
          ? "Edit the brand for your products"
          : "Create a new brand for your products"
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
          : "Add Brand"
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
          label="Brand Name"
          name="name"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter brand name (e.g., Apple, Samsung)"
          required
        />

        {/* Image Upload */}
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
            Please fill in all required fields: name and image.
          </p>
        )}
      </div>
    </AddDetailsPopup>
  );
}
