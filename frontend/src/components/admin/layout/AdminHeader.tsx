"use client";

import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AddDetailsPopup from "@/components/common/popup";
import { changePassword, logout } from "@/api/auth";
import { DeleteConfirmation } from "@/components/common/helper_function";

interface User {
  id: number;
  name: string;
  email?: string;
}

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userDropdownOpen: boolean;
  setUserDropdownOpen: (open: boolean) => void;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  userDropdownOpen,
  setUserDropdownOpen,
}: HeaderProps) {
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const displayName = user?.name || "Admin";
  const userEmail = user?.email || "";

  const closeAllMenus = () => {
    setUserDropdownOpen(false);
    setLogoutConfirmOpen(false);
    setChangePasswordOpen(false);
  };

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logout successful!");
      router.push("/admin/login");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setLogoutConfirmOpen(false);
    }
    closeAllMenus();
  };

  const handleDropdownItemClick = (action: () => void) => {
    action();
    setUserDropdownOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between w-full px-4 py-4">
          {/* Sidebar toggle */}
          <button
            onClick={() => {
              closeAllMenus();
              setSidebarOpen(!sidebarOpen);
            }}
            className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>

          {/* Center title */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-[16px] sm:text-[18px] font-bold text-gray-800">
              {loading ? "Loading..." : `Welcome back, ${displayName}`}
            </h1>
            <p className="hidden md:block text-[14px] text-gray-500">
              Monitor, manage, and move forward.
            </p>
          </div>

          {/* User dropdown */}
          <UserDropdown
            displayName={displayName}
            userEmail={userEmail}
            isOpen={userDropdownOpen}
            onToggle={() => setUserDropdownOpen(!userDropdownOpen)}
            onClose={() => setUserDropdownOpen(false)}
            onChangePassword={() =>
              handleDropdownItemClick(() => setChangePasswordOpen(true))
            }
            onLogout={() =>
              handleDropdownItemClick(() => setLogoutConfirmOpen(true))
            }
          />
        </div>
      </header>

      {/* Modals */}
      <DeleteConfirmation
        isOpen={logoutConfirmOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to sign in again to access your account."
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogOut}
        isLoading={isLoggingOut}
        confirmButtonText="Log Out"
      />

      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSuccess={() => {
          setChangePasswordOpen(false);
          toast.success("Password changed successfully!");
        }}
      />
    </>
  );
}

// User Dropdown Component
function UserDropdown({
  displayName,
  userEmail,
  isOpen,
  onToggle,
  onClose,
  onChangePassword,
  onLogout,
}: {
  displayName: string;
  userEmail: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="relative">
      {/* Dropdown trigger */}
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Avatar displayName={displayName} />
        {/* Desktop: show name and chevron */}
        <span className="hidden lg:block text-sm font-medium text-gray-700">
          {displayName}
        </span>
        <ChevronDown
          size={18}
          className={`hidden lg:block text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dropdown content - Mobile first, then responsive */}
          <div className=" fixed left-0 right-0 top-[88px] z-50 bg-white border border-gray-200 shadow-xl sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2 sm:w-56 sm:rounded-lg sm:border sm:shadow-lg">
            <div className="py-1">
              {/* User profile section */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Avatar displayName={displayName} size="w-8 h-8" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <DropdownItem
                  icon={Settings}
                  text="Change Password"
                  onClick={onChangePassword}
                />
              </div>

              <div className="border-t border-gray-100">
                <DropdownItem
                  icon={LogOut}
                  text="Log Out"
                  onClick={onLogout}
                  danger
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Avatar Component
function Avatar({
  displayName,
  size = "w-10 h-10",
}: {
  displayName: string;
  size?: string;
}) {
  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-violet-500 to-purple-600",
    "from-cyan-500 to-blue-500",
  ];

  let hash = 0;
  for (let i = 0; i < displayName.length; i++) {
    hash = displayName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradientColor = colors[Math.abs(hash) % colors.length];

  const names = displayName.trim().split(" ");
  const initials =
    names.length === 1
      ? names[0].substring(0, 2).toUpperCase()
      : (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();

  return (
    <div
      className={`${size} rounded-full flex items-center justify-center bg-gradient-to-br ${gradientColor} shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ring-2 ring-white/20`}
    >
      <span className="text-white font-bold text-sm">{initials}</span>
    </div>
  );
}

// Dropdown Item Component
function DropdownItem({
  icon: Icon,
  text,
  onClick,
  danger = false,
}: {
  icon: React.ElementType;
  text: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left transition-colors ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Icon size={16} />
      <span>{text}</span>
    </button>
  );
}

// Change Password Modal Component
function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await changePassword(formData);
      onSuccess();
    } catch (error: unknown) {
      let errorMessage = "Failed to change password. Please try again.";

      const errorObj = error as { response?: { status?: number; data?: { message?: string | Array<{ message?: string }>; error?: string } } };
      if (errorObj?.response?.status === 400) {
        if (errorObj?.response?.data?.message) {
          if (Array.isArray(errorObj.response.data.message)) {
            errorMessage = errorObj.response.data.message
              .map((err: { message?: string }) => err.message || err)
              .join(", ");
          } else {
            errorMessage = errorObj.response.data.message as string;
          }
        } else if (errorObj?.response?.data?.error) {
          errorMessage = errorObj.response.data.error;
        }
      } else if (errorObj?.response?.status === 401) {
        errorMessage = "Current password is incorrect.";
      } else if (errorObj?.response?.status === 403) {
        errorMessage = "You don't have permission to change password.";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    setShowPasswords({ old: false, new: false, confirm: false });
    onClose();
  };

  // Updated to work with DefaultInput's onChange signature
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      description="Update your account password"
      onSave={handleSubmit}
      saveButtonText="Change Password"
      cancelButtonText="Cancel"
      isLoading={isLoading}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Current Password */}
        <PasswordFieldWithToggle
          label="Current Password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleInputChange("oldPassword")}
          placeholder="Enter current password"
          showPassword={showPasswords.old}
          onToggleVisibility={() => togglePasswordVisibility("old")}
          error={errors.oldPassword}
          disabled={isLoading}
          required
        />

        {/* New Password */}
        <PasswordFieldWithToggle
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange("newPassword")}
          placeholder="Enter new password"
          showPassword={showPasswords.new}
          onToggleVisibility={() => togglePasswordVisibility("new")}
          error={errors.newPassword}
          disabled={isLoading}
          helpText="Password must be at least 8 characters long"
          required
        />

        {/* Confirm Password */}
        <PasswordFieldWithToggle
          label="Confirm New Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange("confirmPassword")}
          placeholder="Confirm new password"
          showPassword={showPasswords.confirm}
          onToggleVisibility={() => togglePasswordVisibility("confirm")}
          error={errors.confirmPassword}
          disabled={isLoading}
          required
        />
      </div>
    </AddDetailsPopup>
  );
}

// Enhanced Password Field Component using DefaultInput
function PasswordFieldWithToggle({
  label,
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  onToggleVisibility,
  error,
  disabled,
  required = false,
  helpText,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  error?: string;
  disabled: boolean;
  required?: boolean;
  helpText?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-3 py-2.5 pr-12 border rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-300"
          }`}
          placeholder={placeholder}
          required={required}
        />
        <button
          tabIndex={-1}
          type="button"
          onClick={onToggleVisibility}
          disabled={disabled}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}