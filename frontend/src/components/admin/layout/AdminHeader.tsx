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

  return (
    <>
      <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-99999">
        <div className="flex items-center justify-between w-full px-4 py-4">
          {/* Left - Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg cursor-pointer"
          >
            <Menu size={20} />
          </button>

          {/* Center - Welcome Text */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-[16px] sm:text-[18px] font-bold text-gray-800">
              Welcome back, Asmit
            </h1>
            <p className="hidden md:block text-[14px] text-gray-500">
              Monitor, manage, and move forward.
            </p>
          </div>

          {/* Right - Three dots (mobile) / User controls (desktop) */}
          <div className="flex items-center">
            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-2">
              <button className="p-1 rounded-lg hover:cursor-pointer">
                <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100">
                  <Moon size={18} className="text-gray-700" />
                </div>
              </button>
              <button className="p-1 rounded-lg hover:cursor-pointer">
                <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100">
                  <Bell size={18} className="text-gray-600" />
                </div>
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:cursor-pointer"
                >
                  <div className="w-10 h-10 border border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      {/* user image placeholder */}
                    </div>
                  </div>
                  <span className="hidden lg:inline-block text-sm font-medium text-gray-700">
                    Asmit
                  </span>
                  <ChevronDown size={18} className="text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <a
                      href="#"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserCircle size={16} />
                      <span>Edit Profile</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} />
                      <span>Account Settings</span>
                    </a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <a
                      href="#"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Three Dots Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg cursor-pointer"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Card */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Theme</span>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Moon size={18} className="text-gray-700" />
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Notifications
              </span>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Bell size={18} className="text-gray-600" />
              </button>
            </div>

            {/* User Account */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 border border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    {/* user image placeholder */}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">Asmit</span>
              </div>

              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <UserCircle size={16} />
                  <span>Edit Profile</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Settings size={16} />
                  <span>Account Settings</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown overlay */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
