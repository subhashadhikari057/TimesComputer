"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import { toast } from "sonner";
import { createColor, updateColor } from "@/api/color";
import { capitalizeFirstWord } from "@/components/common/helper_function";

interface ColorFormData {
  id?: number;
  name: string;
  hexCode: string;
}

interface ColorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: number;
    name: string;
    hexCode: string;
  };
}

const INITIAL_FORM_DATA: ColorFormData = {
  name: "",
  hexCode: "#000000",
};



export default function ColorPopup({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: ColorPopupProps) {
  const [form, setForm] = useState<ColorFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const isEditMode = Boolean(initialData?.id);

  // Validate and format hex code
  const validateHexCode = (value: string): string => {
    // Remove any non-hex characters except #
    let cleaned = value.replace(/[^#0-9A-Fa-f]/g, "");

    // Ensure it starts with #
    if (!cleaned.startsWith("#")) {
      cleaned = "#" + cleaned.replace(/#/g, "");
    }

    // Limit to 7 characters (#RRGGBB)
    if (cleaned.length > 7) {
      cleaned = cleaned.substring(0, 7);
    }

    return cleaned;
  };

  // Check if hex code is valid
  const isValidHexCode = (hex: string): boolean => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    return hexPattern.test(hex);
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          id: initialData.id,
          name: initialData.name,
          hexCode: initialData.hexCode,
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
    return form.name.trim() !== "" && isValidHexCode(form.hexCode);
  };

  const handleHexCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedHex = validateHexCode(e.target.value);
    setForm((prev) => ({ ...prev, hexCode: validatedHex }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = capitalizeFirstWord(value);
    setForm((prev) => ({ ...prev, name: capitalizedValue }));
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("hexCode", form.hexCode);

      if (isEditMode) {
        await updateColor(form.id!, formData);
        toast.success("Color updated successfully!");
      } else {
        await createColor(formData);
        toast.success("Color created successfully!");
      }

      if (onSuccess) {
        onSuccess();
      }

      handleCancel();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error occurred";

      // Handle specific duplicate errors
      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate")
      ) {
        toast.error(
          "Color name already exists. Please choose a different name."
        );
      } else {
        toast.error(`Failed to ${isEditMode ? "update" : "create"} color`);
      }


    } finally {
      setLoading(false);
    }
  };

  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditMode ? "Edit Color" : "Add New Color"}
      description={
        isEditMode
          ? "Edit the color option for your products"
          : "Create a new color option for your products"
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
          : "Add Color"
      }
      isLoading={loading}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Name Field */}
        <DefaultInput
          label="Color Name"
          name="name"
          value={form.name}
          onChange={handleNameChange}
          placeholder="Enter color name (e.g., Ocean Blue, Forest Green)"
          required
        />

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color *
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={isValidHexCode(form.hexCode) ? form.hexCode : "#000000"}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, hexCode: e.target.value }))
              }
              className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={form.hexCode}
              onChange={handleHexCodeChange}
              placeholder="#000000"
              maxLength={7}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-blue-500 ${
                form.hexCode && !isValidHexCode(form.hexCode)
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          {form.hexCode && !isValidHexCode(form.hexCode) && (
            <p className="text-sm text-red-600 mt-1">
              Please enter a valid hex code (e.g., #FF5733)
            </p>
          )}
        </div>

        {/* Validation Message */}
        {!isFormValid() && showValidation && !loading && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-medium">
              Required fields missing:
            </p>
            <ul className="text-sm text-amber-600 mt-1 list-disc list-inside">
              {form.name.trim() === "" && <li>Color name</li>}
              {!isValidHexCode(form.hexCode) && <li>Valid hex code</li>}
            </ul>
          </div>
        )}
      </div>
    </AddDetailsPopup>
  );
}
