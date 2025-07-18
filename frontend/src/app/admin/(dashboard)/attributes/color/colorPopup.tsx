"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import { toast } from "sonner";
import { createColor, updateColor } from "@/api/color";

interface ColorFormData {
  id?: number;
  name: string;
  color: string;
}

// Interface for data coming from the table
interface ColorData {
  id?: number;
  name: string;
  color?: string;
  [key: string]: any; // Allow other properties
}

interface ColorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ColorData>;
}

const INITIAL_FORM_DATA: ColorFormData = {
  name: "",
  color: "#000000",
};

export default function ColorPopup({
  isOpen,
  onClose,
  initialData = {},
}: ColorPopupProps) {
  const [form, setForm] = useState<ColorFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const isEditMode = initialData && initialData.id;

  // Reset form when popup opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      const updatedForm: ColorFormData = {
        ...INITIAL_FORM_DATA,
        id: initialData.id,
        name: initialData.name || "",
        color: initialData.color || "#000000",
      };

      setForm(updatedForm);
      setShowValidation(false);
      setError(null);
    }
  }, [isOpen]);

  const resetForm = () => {
    const resetData: ColorFormData = {
      ...INITIAL_FORM_DATA,
      id: initialData.id,
      name: initialData.name || "",
      color: initialData.color || "#000000",
    };

    setForm(resetData);
    setShowValidation(false);
    setError(null);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isFormValid = () => {
    return form.name.trim() !== "" && form.color !== "";
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      const saveData = {
        name: form.name,
        hexCode: form.color,
      };

      if (isEditMode) {
        await updateColor(initialData.id!, saveData);
        toast.success("Color updated successfully!");
      } else {
        await createColor(saveData);
        toast.success("Color created successfully!");
      }

      handleCancel();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message ||
        `Failed to ${isEditMode ? "update" : "create"} color`;

      setError(errorMessage);
      toast.error(errorMessage);
      console.error(`Error ${isEditMode ? "updating" : "creating"} color:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditMode ? "Edit Color" : "Add New Color"}
      description={isEditMode ? "Edit the color option for your products" : "Create a new color option for your products"}
      onSave={handleSave}
      onCancel={handleCancel}
      saveButtonText={
        loading
          ? isEditMode ? "Updating..." : "Creating..."
          : isEditMode ? "Update" : "Add Color"
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
          label="Color Name *"
          name="name"
          value={form.name}
          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
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
              value={form.color}
              onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
              className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={form.color}
              onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Validation Message */}
        {!isFormValid() && showValidation && !loading && (
          <p className="text-sm text-red-600">
            Please fill in all required fields: name, color.
          </p>
        )}
      </div>
    </AddDetailsPopup>
  );
}