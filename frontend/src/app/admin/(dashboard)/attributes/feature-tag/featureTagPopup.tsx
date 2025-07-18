"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import { toast } from "sonner";
import { createFeatureTag, updateFeatureTag } from "@/api/featureTag";


interface FeatureTagFormData {
  id?: number;
  name: string;
}

interface FeatureTagPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: number;
    name: string;
  };
}

const INITIAL_FORM_DATA: FeatureTagFormData = {
  name: "",
 
};

export default function FeatureTagPopup({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: FeatureTagPopupProps) {
  const [form, setForm] = useState<FeatureTagFormData>(INITIAL_FORM_DATA);
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
      form.name.trim() !== "");
  };

  const handleSave = async () => {
    setShowValidation(true);
    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("name", form.name);

      if (isEditMode) {
        await updateFeatureTag(form.id!, form);
        toast.success("FeatureTag updated successfully!");
      } else {
        await createFeatureTag(form);
        toast.success("FeatureTag created successfully!");
      }
      if (onSuccess) {
        onSuccess();
      }

      handleCancel();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditMode ? "update" : "create"} Feature Tag`;
      setError(errorMessage);
      toast.error(
        `Error ${isEditMode ? "updating" : "creating"} featureTag: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditMode ? "Edit Feature Tag" : "Add New Feature Tag"}
      description={
        isEditMode
          ? "Edit the Feature Tag details. "
          : "Create a new Feature Tag for your products."
      }
      onSave={handleSave}
      onCancel={handleCancel}
      saveButtonText={
        loading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
            ? "Update Feature Tag"
            : "Add FeatureTag"
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
          label="Feature Tag"
          name="name"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter Feature Tag name (e.g., Electronics, Clothing)"
          required
        />

      

        {!isFormValid() && showValidation && !loading && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-medium">
              Required fields missing:
            </p>
            <ul className="text-sm text-amber-600 mt-1 list-disc list-inside">
              {form.name.trim() === "" && <li>FeatureTag name</li>}
            </ul>
          </div>
        )}
      </div>
    </AddDetailsPopup>
  );
}