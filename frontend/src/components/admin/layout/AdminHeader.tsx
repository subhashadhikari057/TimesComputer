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

  const Avatar = (
    <div className="w-10 h-10 border border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
      {/* Replace with <Image /> when integrating user avatar */}
      <div className="w-full h-full rounded-full bg-gray-100" />
    </div>
  );

  return (
    <>
      <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between w-full px-4 py-4">
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
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
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
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
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border"
                    role="menu"
                  >
                    <DropdownItem icon={UserCircle} text="Edit Profile" />
                    <DropdownItem icon={Settings} text="Account Settings" />
                    <hr className="my-1 border-gray-100" />
                    <DropdownItem icon={LogOut} text="Log Out" danger />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="px-4 py-4 space-y-4">
            <MobileMenuItem label="Theme" icon={<Moon size={18} />} />
            <MobileMenuItem label="Notifications" icon={<Bell size={18} />} />
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-3 mb-3">{Avatar}
                <span className="text-sm font-medium text-gray-700">Asmit</span>
              </div>
              <div className="space-y-2">
                <DropdownItem icon={UserCircle} text="Edit Profile" />
                <DropdownItem icon={Settings} text="Account Settings" />
                <DropdownItem icon={LogOut} text="Log Out" danger />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlays */}
      {userDropdownOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
      )}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  );
}

function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="p-1 rounded-lg"
      aria-label={label}
    >
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
}: {
  icon: React.ElementType;
  text: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={() => alert(`${text} clicked`)} // placeholder action
      className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left ${
        danger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"
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
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button className="p-2 rounded-lg hover:bg-gray-100">{icon}</button>
    </div>
  );
}
