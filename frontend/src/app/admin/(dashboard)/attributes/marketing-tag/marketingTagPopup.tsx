"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import { toast } from "sonner";
import { createMarketingTag, updateMarketingTag } from "@/api/marketingTag";
import { capitalizeFirstWord } from "@/components/common/helper_function";


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
      form.name.trim() !== "");
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

      if (isEditMode) {
        await updateMarketingTag(form.id!, {name: form.name});
        toast.success("Marketing Tag updated successfully!");
      } else {
        await createMarketingTag({name: form.name});
        toast.success("Marketing Tag created successfully!");
      }
      if (onSuccess) {
        onSuccess();
      }

      handleCancel();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error occurred";

      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate")
      ) {
        toast.error(
          "Tag Name already exists. Please choose a different name."
        );
      } else {
        toast.error(`Failed to ${isEditMode ? "update" : "create"} tag`);
      }


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

        <DefaultInput
          label="Marketing Tag"
          name="name"
          value={form.name}
          onChange={handleNameChange}
          placeholder="Enter Marketing Tag name (e.g., Electronics, Clothing)"
          required
        />

      

        {!isFormValid() && showValidation && !loading && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-medium">
              Required fields missing:
            </p>
            <ul className="text-sm text-amber-600 mt-1 list-disc list-inside">
              {form.name.trim() === "" && <li>Marketing Tag name</li>}
            </ul>
          </div>
        )}
      </div>
    </AddDetailsPopup>
  );
}