"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";

import { toast } from "sonner";
import { createBrand, updateBrand } from "@/api/brand";
import { capitalizeFirstWord } from "@/components/common/helper_function";
import { getImageUrl } from "@/lib/imageUtils";

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
  const [showValidation, setShowValidation] = useState(false);

  const isEditMode = Boolean(initialData?.id);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          id: initialData.id,
          name: initialData.name,
          imagePreview: getImageUrl(initialData.image),
        });
      } else {
        setForm(INITIAL_FORM_DATA);
      }
      setShowValidation(false);
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setForm(INITIAL_FORM_DATA);
    setShowValidation(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isFormValid = () => {
    return (
      form.name.trim() !== "" &&
      (form.image !== undefined || form.imagePreview !== "")
    );
  };

  const handleSave = async () => {
    setShowValidation(true);
    if (!isFormValid()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      
      // Only append image if we have a new file
      if (form.image) {
        formData.append("image", form.image);
      }

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
    } catch (err) {
      const error = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Unknown error occurred";

      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate")
      ) {
        toast.error(
          "Brand name already exists. Please choose a different name."
        );
      } else {
        toast.error(`Failed to ${isEditMode ? "update" : "create"} brand`);
      }


    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = capitalizeFirstWord(value);
    setForm((prev) => ({ ...prev, name: capitalizedValue }));
  };

  // Simplified image upload handler for single image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload PNG, JPG, or WebP files.");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size too large. Please upload files smaller than 10MB.");
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

  // Simplified remove handler for single image
  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      image: undefined,
      imagePreview: "",
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
        {/* Name Field */}
        <DefaultInput
          label="Brand Name"
          name="name"
          value={form.name}
          onChange={handleNameChange}
          placeholder="Enter brand name (e.g., Apple, Samsung)"
          required
        />

        {/* Image Upload - Convert single values to arrays for PhotoUpload */}
        <div className="grid gap-4 grid-cols-1">
          <div>
            <PhotoUpload
              label="Brand Image"
              required={true}
              images={form.image ? [form.image] : []}
              imagePreviews={form.imagePreview ? [form.imagePreview] : []}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              maxImages={1}
              maxSizeText="up to 10MB"
              acceptedFormats="PNG, JPG, WebP"
              uploadText="Click to upload brand image"
            />
          </div>
        </div>

        {/* Validation Message */}
        {!isFormValid() && showValidation && !loading && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-medium">
              Required fields missing:
            </p>
            <ul className="text-sm text-amber-600 mt-1 list-disc list-inside">
              {form.name.trim() === "" && <li>Brand name</li>}
              {!form.image && form.imagePreview === "" && <li>Brand image</li>}
            </ul>
          </div>
        )}
      </div>
    </AddDetailsPopup>
  );
}