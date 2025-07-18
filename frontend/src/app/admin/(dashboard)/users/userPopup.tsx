"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import { toast } from "sonner";

interface UserFormData {
  id?: number;
  name: string;
  email: string;
}

interface UserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<UserFormData>;
}

const INITIAL_FORM_DATA: UserFormData = {
  name: "",
  email: "",
};

export default function UserPopup({
  isOpen,
  onClose,
  initialData = {},
}: UserPopupProps) {
  const [form, setForm] = useState<UserFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const isEditMode = initialData && initialData.id;

  // Reset form when popup opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      const updatedForm = { ...INITIAL_FORM_DATA, ...initialData };
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

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return (
      form.name.trim() !== "" &&
      form.email.trim() !== "" &&
      isValidEmail(form.email.trim())
    );
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      const saveData = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      };

      // if (isEditMode) {
      //   await userService.updateUser(initialData.id!, saveData);
      //   toast.success("Admin user updated successfully!");
      // } else {
      //   await userService.createUser(saveData);
      //   toast.success("Admin user created successfully!");
      // }

      handleCancel();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditMode ? "update" : "create"} admin user`;

      setError(errorMessage);
      toast.error(errorMessage);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} admin user:`,
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const getValidationMessage = () => {
    if (form.name.trim() === "") {
      return "Name is required.";
    }
    if (form.email.trim() === "") {
      return "Email is required.";
    }
    if (!isValidEmail(form.email.trim())) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditMode ? "Edit Admin User" : "Add New Admin User"}
      description={
        isEditMode
          ? "Edit the admin user details"
          : "Create a new admin user account"
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
          : "Add User"
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
          label="Full Name"
          name="name"
          value={form.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter admin user's full name"
          required
        />

        {/* Email Field */}
        <DefaultInput
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter admin user's email address"
          required
        />

        {/* Validation Message */}
        {!isFormValid() && showValidation && !loading && (
          <p className="text-sm text-red-600">
            {getValidationMessage()}
          </p>
        )}
      </div>
    </AddDetailsPopup>
  );
}