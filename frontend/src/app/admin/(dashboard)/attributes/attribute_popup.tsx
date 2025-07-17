"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";
import IconUpload from "@/components/admin/product/iconUpload";
import { toast } from "sonner";

// Base form data interface
interface BaseFormData {
  id?: number;
  name: string;
  description?: string;
  image: File | null;
  imagePreview: string;
  icon: File | null;
  iconPreview?: string;
  color?: string;
  parentId?: number | null;
}

// Configuration for different attribute types
export interface AttributeConfig {
  type: "brand" | "category" | "color";
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  showImage?: boolean;
  showIcon?: boolean;
  showColor?: boolean;
  requiredFields: string[];
  onSave: (data: any) => Promise<void>;
}

// Predefined configurations
export const ATTRIBUTE_CONFIGS: Record<string, AttributeConfig> = {
  brand: {
    type: "brand",
    title: "Add New Brand",
    description: "Create a new brand for your products",
    nameLabel: "Brand Name",
    namePlaceholder: "Enter brand name (e.g., Apple, Samsung)",

    showImage: true,
    showIcon: true,
    showColor: false,

    requiredFields: ["name", "image", "icon"],
    onSave: async (data) => {
      // Default implementation - should be overridden
      console.log("Saving brand:", data);
    },
  },
  category: {
    type: "category",
    title: "Add New Category",
    description: "Create a new category for your products",
    nameLabel: "Category Name",
    namePlaceholder: "Enter category name (e.g., Electronics, Clothing)",
   
    showImage: true,
    showIcon: true,
    showColor: false,
    requiredFields: ["name", "image", "icon"],
    onSave: async (data) => {
      // Default implementation - should be overridden
      console.log("Saving category:", data);
    },
  },
  color: {
    type: "color",
    title: "Add New Color",
    description: "Create a new color option for your products",
    nameLabel: "Color Name",
    namePlaceholder: "Enter color name (e.g., Ocean Blue, Forest Green)",

    showImage: false,
    showIcon: false,
    showColor: true,
   requiredFields: ["name", "color"],
    onSave: async (data) => {
      // Default implementation - should be overridden
      console.log("Saving color:", data);
    },
  },
};

interface AttributePopupProps {
  isOpen: boolean;
  onClose: () => void;
  config: AttributeConfig;
  initialData?: Partial<BaseFormData>;
}

const INITIAL_FORM_DATA: BaseFormData = {
  name: "",
  description: "",
  image: null,
  imagePreview: "",
  icon: null,
  iconPreview: "",
  color: "#000000",
  parentId: null,
};

export default function AttributePopup({
  isOpen,
  onClose,
  config,
  initialData = {},
}: AttributePopupProps) {
  const [form, setForm] = useState<BaseFormData>({
    ...INITIAL_FORM_DATA,
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  // Reset form when popup opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      const updatedForm = { ...INITIAL_FORM_DATA, ...initialData };

      // Handle existing images for edit mode
      if (initialData.image && typeof initialData.image === "string") {
        updatedForm.imagePreview = initialData.image;
        updatedForm.image = null; // Will be set only if user uploads new image
      }

      // Handle existing icons for edit mode
      if (initialData.icon && typeof initialData.icon === "string") {
        updatedForm.iconPreview = initialData.icon;
        updatedForm.icon = null; // Will be set only if user uploads new icon
      }

      setForm(updatedForm);
      setShowValidation(false);
      setError(null);
    }
  }, [isOpen]);

  // Reset form when popup opens/closes
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
    return config.requiredFields.every((field) => {
      if (field === "name") return form.name.trim() !== "";
      if (field === "image")
        return form.image !== null || form.imagePreview !== "";
      if (field === "icon")
        return form.icon !== null || form.iconPreview !== "";
      if (field === "color") return form.color !== "";
      if (field === "description") return form.description?.trim() !== "";
      return true;
    });
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      // Prepare data based on config
      const saveData: any = {
        name: form.name,
      };

      if (config.showImage) saveData.image = form.image;
      if (config.showIcon) saveData.icon = form.icon;
      if (config.showColor) saveData.color = form.color;

      // Add ID if in edit mode
      if (initialData.id) saveData.id = initialData.id;

      await config.onSave(saveData);

      const isEditMode = initialData && Object.keys(initialData).length > 0;
      toast.success(
        `${config.type.charAt(0).toUpperCase() + config.type.slice(1)} ${
          isEditMode ? "updated" : "created"
        } successfully!`
      );
      handleCancel();
    } catch (err) {
      const isEditMode = initialData && Object.keys(initialData).length > 0;
      setError(`Failed to ${isEditMode ? "update" : "create"} ${config.type}`);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} ${config.type}:`,
        err
      );
    } finally {
      setLoading(false);
    }
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

  const updateForm = (updates: Partial<BaseFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const getRequiredFieldsText = () => {
    const fieldNames = config.requiredFields.map((field) => {
      switch (field) {
        case "name":
          return "name";
        case "image":
          return "image";
        case "icon":
          return "icon";
        case "color":
          return "color";
        case "description":
          return "description";
        default:
          return field;
      }
    });
    return fieldNames.join(", ");
  };

  const isEditMode = initialData && Object.keys(initialData).length > 0;

  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={handleCancel}
      title={config.title}
      description={config.description}
      onSave={handleSave}
      onCancel={handleCancel}
      saveButtonText={
        loading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update"
          : `Add ${config.type.charAt(0).toUpperCase() + config.type.slice(1)}`
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
          label={`${config.nameLabel}`}
          name="name"
          value={form.name}
          onChange={(e) => updateForm({ name: e.target.value })}
          placeholder={config.namePlaceholder}
          required
        />

        

        

        {/* Color Picker */}
        {config.showColor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={form.color}
                onChange={(e) => updateForm({ color: e.target.value })}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={form.color}
                onChange={(e) => updateForm({ color: e.target.value })}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Image and Icon Upload */}
        {(config.showImage || config.showIcon) && (
          <div
            className={`grid gap-4 ${
              config.showImage && config.showIcon
                ? "grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {config.showImage && (
              <div>
                <PhotoUpload
                  label={`${
                    config.type.charAt(0).toUpperCase() + config.type.slice(1)
                  } Image`}
                  required={config.requiredFields.includes("image")}
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
            )}

            {config.showIcon && (
              <div>
                <IconUpload
                  label={`${
                    config.type.charAt(0).toUpperCase() + config.type.slice(1)
                  } Icon`}
                  images={form.icon ? [form.icon] : []}
                  required={config.requiredFields.includes("icon")}
                  imagePreviews={form.iconPreview ? [form.iconPreview] : []}
                  onImageUpload={(e) =>
                    handleImageUpload(Array.from(e.target.files || []), "icon")
                  }
                  onRemoveImage={() => handleRemove("icon")}
                  maxImages={1}
                />
              </div>
            )}
          </div>
        )}

        {/* Validation Message */}
        {!isFormValid() && showValidation && !loading && (
          <p className="text-sm text-red-600">
            Please fill in all required fields: {getRequiredFieldsText()}.
          </p>
        )}
      </div>
    </AddDetailsPopup>
  );
}
