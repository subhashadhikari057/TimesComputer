"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import { toast } from "sonner";
import { createAdminUser, updateAdminUser } from "@/api/adminUser";

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  password: string;
}

interface UserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: string;
    name: string;
    email: string;
    password?: string;
  };
}

const INITIAL_FORM_DATA: UserFormData = {
  name: "",
  email: "",
  password: "",
};

export default function UserPopup({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: UserPopupProps) {
  const [form, setForm] = useState<UserFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const isEditMode = !!initialData?.id;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          id: initialData.id,
          name: initialData.name,
          email: initialData.email,
          password: initialData.password || "",
        });
      } else {
        setForm(INITIAL_FORM_DATA);
      }
      setShowValidation(false);
      setError(null);
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setForm(INITIAL_FORM_DATA);
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

      if (isEditMode) {
        await updateAdminUser(form.id!, form);
        toast.success("Admin user updated successfully!");
      } else {
        await createAdminUser(form);
        toast.success("Admin user created successfully!");
      }

      if (onSuccess) {
        onSuccess();
      }

      handleCancel();
    } catch (err: unknown) {
      toast.error("failed to save admin user");
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
    if (error) setError(null);
  };

  const getValidationMessage = () => {
    if (form.name.trim() === "") return "Name is required.";
    if (form.email.trim() === "") return "Email is required.";
    if (!isValidEmail(form.email.trim()))
      return "Please enter a valid email address.";
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

        <DefaultInput
          label="Full Name"
          name="name"
          value={form.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter admin user's full name"
          required
        />

        <DefaultInput
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter admin user's email address"
          required
        />

        {!isEditMode && (
          <DefaultInput
            label="Password"
            name="password"
            type="password"
            value={form.password || ""}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Enter a secure password"
            required
          />
        )}

        {!isFormValid() && showValidation && !loading && (
          <p className="text-sm text-red-600">{getValidationMessage()}</p>
        )}
      </div>
    </AddDetailsPopup>
  );
}