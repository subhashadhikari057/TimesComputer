"use client";

import { useState, useEffect } from "react";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import { toast } from "sonner";
import { resetAdminPassword } from "@/api/adminUser";

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: {
    id: string;
    name: string;
    email: string;
    password: string;
  };
}

const INITIAL_FORM_DATA: ResetPasswordFormData = {
  newPassword: "",
  confirmPassword: "",
};

export default function ResetPasswordPopup({
  isOpen,
  onClose,
  onSuccess,
  user,
}: ResetPasswordPopupProps) {
  const [form, setForm] = useState<ResetPasswordFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM_DATA);
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
      form.newPassword.trim() !== "" &&
      form.confirmPassword.trim() !== "" &&
      form.newPassword === form.confirmPassword
    );
  };

  const handleSave = async () => {
    setShowValidation(true);
    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      const data = await resetAdminPassword(user?.id!, form);
      
      toast.success(`Password reset successfully for ${user?.name}!`);

      if (onSuccess) {
        onSuccess();
      }

      handleCancel();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password";

      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error resetting password:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ResetPasswordFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const getValidationMessage = () => {
    if (form.newPassword.trim() === "") return "New password is required.";
    if (form.confirmPassword.trim() === "") return "Please confirm your password.";
    if (form.newPassword !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const getPasswordStrength = () => {
    const password = form.newPassword;
    if (password.length === 0) return "";
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*#?&]/.test(password)) strength++;

    switch (strength) {
      case 0:
      case 1:
      case 2:
        return "text-red-500";
      case 3:
        return "text-yellow-500";
      case 4:
      case 5:
        return "text-green-500";
      default:
        return "";
    }
  };

  const getStrengthText = () => {
    const password = form.newPassword;
    if (password.length === 0) return "";
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*#?&]/.test(password)) strength++;

    switch (strength) {
      case 0:
      case 1:
      case 2:
        return "Weak";
      case 3:
        return "Medium";
      case 4:
      case 5:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={handleCancel}
      title="Reset Password"
      description={
        user 
          ? `Reset password for ${user.name} (${user.email})`
          : "Reset user password"
      }
      onSave={handleSave}
      onCancel={handleCancel}
      saveButtonText={loading ? "Resetting..." : "Reset Password"}
      isLoading={loading}
      maxWidth="md"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <DefaultInput
            label="New Password"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            placeholder="Enter new password"
            required
          />
          {form.newPassword && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Strength:</span>
              <span className={getPasswordStrength()}>{getStrengthText()}</span>
            </div>
          )}
        </div>

        <DefaultInput
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          placeholder="Confirm new password"
          required
        />

        {!isFormValid() && showValidation && !loading && (
          <p className="text-sm text-red-600">{getValidationMessage()}</p>
        )}
      </div>
    </AddDetailsPopup>
  );
}