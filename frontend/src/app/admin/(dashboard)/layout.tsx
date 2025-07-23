"use client";

import Header from "@/components/admin/layout/AdminHeader";
import Sidebar from "@/components/admin/layout/AdminSidebar";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/axiosInstance";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to true for desktop
  const [activeMenus, setActiveMenus] = useState<string[]>(["dashboard"]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to make an authenticated request to verify token
        await apiRequest("GET", "/auth/verify");
        setIsAuthenticated(true);
      } catch {
        toast.error("Please login to access admin dashboard");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Set initial sidebar state based on screen size (only on mount)
  useEffect(() => {
    const setInitialState = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint - keep sidebar open for desktop
        setSidebarOpen(true);
      } else {
        // Mobile - start closed
        setSidebarOpen(false);
      }
    };
    // Set initial state only
    setInitialState();
  }, []);

  // Auto-open relevant dropdown based on current route
  useEffect(() => {
    const newActiveMenus = ["dashboard"]; // Always include dashboard

    if (pathname.startsWith("/admin/product")) {
      newActiveMenus.push("product");
    }

    if (pathname.startsWith("/admin/attributes")) {
      newActiveMenus.push("attributes");
    }

    if (pathname.startsWith("/admin/blogs")) {
      newActiveMenus.push("blogs");
    }

    // Add other menu auto-open logic here as needed

    setActiveMenus(newActiveMenus);
  }, [pathname]);

  const toggleSubmenu = (menu: string) => {
    setActiveMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
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
        <main className="flex-1 overflow-hidden bg-gray-50 min-w-0 w-full">
          <div className="h-full overflow-y-auto overflow-x-hidden w-full min-w-0">
            <div className="w-full min-w-0 max-w-none">{children}</div>
          </div>
        </main>
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
