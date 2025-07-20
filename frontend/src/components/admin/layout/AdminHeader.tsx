"use client";

import axios, { apiRequest } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  UserCircle,
  Moon,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
 
}

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userDropdownOpen: boolean;
  setUserDropdownOpen: (open: boolean) => void;
   user?: User | null;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  userDropdownOpen,
  setUserDropdownOpen,
  user,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const displayName = user?.name || "Admin";

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024 && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleMobileMenuToggle = () => {
    setUserDropdownOpen(false);
    closeSidebarOnMobile();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogOut = async () => {
    try {
      const response = await apiRequest("POST", "/auth/refresh/logout");
      toast.success("Logout successful!");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
    closeAllMenus();
  };

  const handleSidebarToggle = () => {
    closeAllMenus();
    setSidebarOpen(!sidebarOpen);
  };

  const handleUserDropdownToggle = () => {
    setMobileMenuOpen(false);
    closeSidebarOnMobile();
    setUserDropdownOpen(!userDropdownOpen);
  };

  const Avatar = ({ size = "w-10 h-10" }: { size?: string }) => (
    <div className={`${size} border border-gray-300 rounded-full overflow-hidden flex items-center justify-center`}>
      <div className="w-full h-full rounded-full bg-gray-100" />
    </div>
  );

  return (
    <>
      {/* Header  */}
      <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-[999]">
        <div className="flex items-center justify-between w-full px-4 py-4">
          {/* Sidebar toggle */}
          <button
            onClick={handleSidebarToggle}
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
              Welcome back, {displayName}
            </h1>
            <p className="hidden md:block text-[14px] text-gray-500">
              Monitor, manage, and move forward.
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center">
            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-2">
              <IconButton icon={<Moon size={18} />} label="Toggle Theme" />
              <IconButton icon={<Bell size={18} />} label="Notifications" />

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={handleUserDropdownToggle}
                  className="flex items-center space-x-2 p-2 rounded-lg"
                  aria-haspopup="true"
                  aria-expanded={userDropdownOpen}
                >
                  <Avatar />
                  <span className="hidden lg:inline-block text-sm font-medium text-gray-700">
                    Asmit
                  </span>
                  <ChevronDown size={18} className="text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1  border border-gray-200"
                    role="menu"
                  >
                    <DropdownItem icon={UserCircle} text="Edit Profile" />
                    <DropdownItem icon={Settings} text="Account Settings" />
                    <hr className="my-1 border-gray-100" />
                    <DropdownItem icon={LogOut} text="Log Out" danger onClick={handleLogOut} />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={handleMobileMenuToggle}
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
        <div className="md:hidden fixed inset-0 z-[998] bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="absolute top-[73px] right-0 left-0 bg-white shadow-xl">
            <div className="px-4 py-6">
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                  <Avatar size="w-12 h-12" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Asmit</p>
                  <p className="text-xs text-gray-500">asmit@example.com</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 mb-6">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Quick Actions
                </h3>
                <MobileMenuButton label="Dark Mode" icon={<Moon size={20} />} />
                <MobileMenuButton 
                  label="Notifications" 
                  icon={<Bell size={20} />} 
                  badge="3"
                />
              </div>

              {/* Account Section */}
              <div className="space-y-3 mb-6">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Account
                </h3>
                <MobileMenuButton label="Edit Profile" icon={<UserCircle size={20} />} />
                <MobileMenuButton label="Settings" icon={<Settings size={20} />} />
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogOut}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop user dropdown overlay */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-[25] hidden md:block"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </>
  );
}

function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="p-1 rounded-lg" aria-label={label}>
      <div className=" cursor-pointer w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100">
        {icon}
      </div>
    </button>
  );
}

function DropdownItem({
  icon: Icon,
  text,
  danger,
  onClick,
}: {
  icon: React.ElementType;
  text: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      alert(text);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
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
  badge,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  badge?: string;
}) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      alert(`${label} placeholder`);
    }
  };

  return (
    <button
      className="w-full flex items-center space-x-3 py-3 px-4 text-left hover:bg-gray-50 rounded-lg transition-colors group"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-900">{label}</span>
      </div>
      {badge && (
        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full">
          <span className="text-xs font-medium">{badge}</span>
        </div>
      )}
      <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
    </button>
  );
}