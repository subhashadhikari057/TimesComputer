"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenus, setActiveMenus] = useState<string[]>(["dashboard"]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Set initial sidebar state based on screen size (only on mount)
  useEffect(() => {
    const setInitialState = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    // Set initial state only
    setInitialState();
  }, []);

  const toggleSubmenu = (menu: string) => {
    setActiveMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenus={activeMenus}
        toggleSubmenu={toggleSubmenu}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userDropdownOpen={userDropdownOpen}
          setUserDropdownOpen={setUserDropdownOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
