"use client";

import {
  Menu,
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  UserCircle,
  Moon,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

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

  // Close all menus/dropdowns
  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setUserDropdownOpen(false); // Close user dropdown when opening mobile menu
    // Close sidebar on mobile when opening mobile menu to prevent overlay conflicts
    if (window.innerWidth < 1024 && sidebarOpen) {
      setSidebarOpen(false);
    }
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    closeAllMenus(); // Close all menus when toggling sidebar
    setSidebarOpen(!sidebarOpen);
  };

  // Handle user dropdown toggle
  const handleUserDropdownToggle = () => {
    setMobileMenuOpen(false); // Close mobile menu when opening user dropdown
    // Close sidebar on mobile when opening user dropdown to prevent overlay conflicts
    if (window.innerWidth < 1024 && sidebarOpen) {
      setSidebarOpen(false);
    }
    setUserDropdownOpen(!userDropdownOpen);
  };

  const Avatar = (
    <div className="w-10 h-10 border border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
      {/* Replace with <Image /> when integrating user avatar */}
      <div className="w-full h-full rounded-full bg-gray-100" />
    </div>
  );
  return (
    <>
      {/* Header  */}
      <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-999">
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
              Welcome back, Asmit
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
                  {Avatar}
                  <span className="hidden lg:inline-block text-sm font-medium text-gray-700">
                    Asmit
                  </span>
                  <ChevronDown size={18} className="text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                    role="menu"
                  >
                    <DropdownItem
                      icon={UserCircle}
                      text="Edit Profile"
                      onClick={() => {
                        alert("Edit Profile");
                        setUserDropdownOpen(false);
                      }}
                    />
                    <DropdownItem
                      icon={Settings}
                      text="Account Settings"
                      onClick={() => {
                        alert("Account Settings");
                        setUserDropdownOpen(false);
                      }}
                    />
                    <hr className="my-1 border-gray-100" />
                    <DropdownItem
                      icon={LogOut}
                      text="Log Out"
                      danger
                      onClick={() => {
                        alert("Log Out");
                        setUserDropdownOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg"
              aria-label="Open mobile menu"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg relative z-50">
          <div className="px-4 py-4 space-y-4">
            <MobileMenuItem
              label="Theme"
              icon={<Moon size={18} />}
              onClick={() => {
                alert("Theme toggle placeholder");
                setMobileMenuOpen(false);
              }}
            />
            <MobileMenuItem
              label="Notifications"
              icon={<Bell size={18} />}
              onClick={() => {
                alert("Notifications placeholder");
                setMobileMenuOpen(false);
              }}
            />
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-3 mb-3">
                {Avatar}
                <span className="text-sm font-medium text-gray-700">Asmit</span>
              </div>
              <div className="space-y-2">
                <DropdownItem
                  icon={UserCircle}
                  text="Edit Profile"
                  onClick={() => {
                    alert("Edit Profile");
                    setMobileMenuOpen(false);
                  }}
                />
                <DropdownItem
                  icon={Settings}
                  text="Account Settings"
                  onClick={() => {
                    alert("Account Settings");
                    setMobileMenuOpen(false);
                  }}
                />
                <DropdownItem
                  icon={LogOut}
                  text="Log Out"
                  danger
                  onClick={() => {
                    alert("Log Out");
                    setMobileMenuOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop user dropdown overlay - only on desktop */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-40 hidden md:block"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </>
  );
}

function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="p-1 rounded-lg" aria-label={label}>
      <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100">
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
  return (
    <button
      onClick={onClick || (() => alert("test"))} // fallback to original behavior
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

function MobileMenuItem({
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
      className="flex items-center justify-between w-full py-2 px-1 hover:bg-gray-50 rounded-lg"
      onClick={onClick}
    >
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="p-2 rounded-lg hover:bg-gray-100">{icon}</div>
    </button>
  );
}
