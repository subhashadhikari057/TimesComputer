"use client";

import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Settings,
  LogOut,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  X,
  LoaderCircleIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AddDetailsPopup from "@/components/common/popup";
import { changePassword, logout } from "@/api/auth"; // Import your API functions

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const displayName = user?.name || "Admin";
  const userEmail = user?.email || `${displayName.toLowerCase()}@example.com`;

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setLogoutConfirmOpen(false);
    setChangePasswordOpen(false);
  };

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    try {
      await logout(); // Use your API function
      localStorage.removeItem('user');
      setUser(null);
      toast.success("Logout successful!");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setLogoutConfirmOpen(false);
    }
    closeAllMenus();
  };

  const handleBackdropClick = (e: React.MouseEvent, callback: () => void) => {
    if (e.target === e.currentTarget) callback();
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
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
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

          {/* Right controls */}
          <div className="flex items-center">
            {/* Desktop user dropdown */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setUserDropdownOpen(!userDropdownOpen);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  aria-haspopup="true"
                  aria-expanded={userDropdownOpen}
                >
                  <Avatar displayName={displayName} />
                  <span className="hidden lg:inline-block text-sm font-medium text-gray-700">
                    {displayName}
                  </span>
                  <ChevronDown 
                    size={18} 
                    className={`text-gray-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Desktop dropdown menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        {/* User info section */}
                        <UserProfile displayName={displayName} userEmail={userEmail} size="w-8 h-8" compact />
                        
                        {/* Menu items */}
                        <div className="py-1">
                          <DropdownItem 
                            icon={Settings} 
                            text="Change Password" 
                            onClick={() => setChangePasswordOpen(true)}
                          />
                        </div>
                        
                        <div className="border-t border-gray-100">
                          <DropdownItem
                            icon={LogOut}
                            text="Log Out"
                            danger
                            onClick={() => setLogoutConfirmOpen(true)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => {
                setUserDropdownOpen(false);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg transition-colors hover:bg-gray-50"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <MoreVertical size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={(e) => handleBackdropClick(e, () => setMobileMenuOpen(false))}
        >
          <div className="fixed top-[73px] left-0 right-0 bg-white shadow-xl border-b border-gray-200">
            <div className="px-4 py-4">
              <UserProfile displayName={displayName} userEmail={userEmail} />
              
              <div className="space-y-2 mb-4">
                <MobileMenuButton
                  label="Change Password"
                  icon={<Settings size={18} />}
                  onClick={() => setChangePasswordOpen(true)}
                />
              </div>

              <LogoutButton onClick={() => setLogoutConfirmOpen(true)} />
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {logoutConfirmOpen && (
        <ConfirmationModal
          title="Confirm Logout"
          message="Are you sure you want to log out? You will need to sign in again to access your account."
          onClose={() => setLogoutConfirmOpen(false)}
          onConfirm={handleLogOut}
          isLoading={isLoggingOut}
          confirmText="Log Out"
          icon={<LogOut className="w-6 h-6 text-red-600" />}
        />
      )}

      {/* Change Password Modal */}
      {changePasswordOpen && (
        <ChangePasswordModal
          isOpen={changePasswordOpen}
          onClose={() => setChangePasswordOpen(false)}
          onSuccess={() => {
            setChangePasswordOpen(false);
            toast.success("Password changed successfully!");
          }}
        />
      )}
    </>
  );
}

// Reusable Components
function Avatar({ displayName, size = "w-10 h-10" }: { displayName: string; size?: string }) {
  // Simple color generation based on name
  const colors = [
    'from-purple-500 to-pink-500', 'from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-500', 'from-violet-500 to-purple-600', 'from-cyan-500 to-blue-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < displayName.length; i++) {
    hash = displayName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradientColor = colors[Math.abs(hash) % colors.length];

  // Get initials
  const names = displayName.trim().split(' ');
  const initials = names.length === 1 
    ? names[0].substring(0, 2).toUpperCase() 
    : (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();

  return (
    <div className={`
      ${size} 
      rounded-full 
      flex 
      items-center 
      justify-center 
      bg-gradient-to-br ${gradientColor}
      shadow-lg
      hover:shadow-xl
      hover:scale-105
      transition-all 
      duration-300
      ring-2
      ring-white/20
    `}>
      <span className="text-white font-bold text-sm">
        {initials}
      </span>
    </div>
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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!oldPassword) newErrors.oldPassword = "Current password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    if (newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await changePassword({
        oldPassword,
        newPassword,
        confirmPassword
      });

      onSuccess();
    } catch (error: any) {
      console.error('Change password error:', error); // Debug log
      
      let errorMessage = "Failed to change password. Please try again.";
      
      if (error?.response?.status === 400) {
        if (error?.response?.data?.message) {
          if (Array.isArray(error.response.data.message)) {
            errorMessage = error.response.data.message
              .map((err: any) => err.message || err)
              .join(', ');
          } else {
            errorMessage = error.response.data.message;
          }
        } else if (error?.response?.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error?.response?.status === 401) {
        errorMessage = "Current password is incorrect.";
      } else if (error?.response?.status === 403) {
        errorMessage = "You don't have permission to change password.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password *
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`w-full px-3 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.oldPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter current password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password *
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-3 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.newPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </AddDetailsPopup>
  );
}

function UserProfile({ 
  displayName, 
  userEmail, 
  size = "w-10 h-10", 
  compact = false 
}: { 
  displayName: string; 
  userEmail: string; 
  size?: string;
  compact?: boolean;
}) {
  const containerClass = compact 
    ? "px-4 py-3 border-b border-gray-100" 
    : "flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100";
    
  return (
    <div className={containerClass}>
      <div className="flex items-center space-x-3">
        <Avatar displayName={displayName} size={size} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        </div>
      </div>
    </div>
  );
}

function DropdownItem({
  icon: Icon,
  text,
  danger = false,
  onClick,
}: {
  icon: React.ElementType;
  text: string;
  danger?: boolean;
  onClick?: () => void;
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

function MobileMenuButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="w-full flex items-center space-x-3 py-2.5 px-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors text-gray-600">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-900 flex-1">{label}</span>
      <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
    </button>
  );
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
    >
      <LogOut size={16} />
      <span className="font-medium text-sm">Log Out</span>
    </button>
  );
}

function ConfirmationModal({
  title,
  message,
  onClose,
  onConfirm,
  isLoading,
  confirmText,
  icon,
}: {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  confirmText: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={(e) => e.target === e.currentTarget && onClose()} 
      />
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-md mx-4 sm:mx-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
                {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading && <LoaderCircleIcon className="mr-2 animate-spin" size={18} />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}