"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import { toast } from "sonner";
import { createMarketingTag, updateMarketingTag } from "@/api/marketingTag";


interface MarketingTagFormData {
  id?: number;
  name: string;
}

interface MarketingTagPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: number;
    name: string;
  };
}

const INITIAL_FORM_DATA: MarketingTagFormData = {
  name: "",
 
};

export default function MarketingTagPopup({
  isOpen,
  onClose,
    onSuccess,
  initialData,
}: MarketingTagPopupProps) {
  const [form, setForm] = useState<MarketingTagFormData>(INITIAL_FORM_DATA);
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
        await updateMarketingTag(form.id!, form);
        toast.success("MarketingTag updated successfully!");
      } else {
        await createMarketingTag(form);
        toast.success("MarketingTag created successfully!");
      }
      if (onSuccess) {
        onSuccess();
      }

      handleCancel();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditMode ? "update" : "create"} Marketing Tag`;
      setError(errorMessage);
      toast.error(
        `Error ${isEditMode ? "updating" : "creating"} marketingTag: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditMode ? "Edit Marketing Tag" : "Add New Marketing Tag"}
      description={
        isEditMode
          ? "Edit the Marketing Tag details. "
          : "Create a new Marketing Tag for your products."
      }
      onSave={handleSave}
      onCancel={handleCancel}
      saveButtonText={
        loading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
            ? "Update Marketing Tag"
            : "Add Marketing Tag"
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
          label="Marketing Tag"
          name="name"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter Marketing Tag name (e.g., Electronics, Clothing)"
          required
        />

      

        {!isFormValid() && showValidation && !loading && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-medium">
              Required fields missing:
            </p>
            <ul className="text-sm text-amber-600 mt-1 list-disc list-inside">
              {form.name.trim() === "" && <li>MarketingTag name</li>}
            </ul>
          </div>
        )}
      </div>
    </AddDetailsPopup>
  );
}