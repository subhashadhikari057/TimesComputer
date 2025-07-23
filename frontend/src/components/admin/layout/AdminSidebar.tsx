"use client";

import { X, ChevronDown, ChevronRight, Home } from "lucide-react";
import {
  menuItems,
  MenuItem,
} from "@/app/admin/(dashboard)/dashboard/data/menuItems";
import Link from "next/link";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenus: string[];
  toggleSubmenu: (menu: string) => void;
}

interface User {
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERADMIN';
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeMenus,
  toggleSubmenu,
}: SidebarProps) {
  const { isRouteActive } = useActiveRoute();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Get user data from localStorage to check role
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    // Hide Users section if user is ADMIN (only show for SUPERADMIN)
    if (item.id === 'user' && user?.role === 'ADMIN') {
      return false;
    }
    return true;
  });

  // Determine if sidebar should show as expanded
  const isExpanded = sidebarOpen || isHovered;

  const handleNavClick = async (
    href: string,
    hasSubmenu: boolean,
    itemId: string
  ) => {
    if (hasSubmenu) {
      toggleSubmenu(itemId);
    } else if (href && href !== "#") {
      setIsNavigating(true);
      try {
        router.push(href);
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        }
      } finally {
        setIsNavigating(false);
      }
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isSubmenuExpanded = activeMenus.includes(item.id);
    const isItemActive = item.href ? isRouteActive(item.href) : false;
    const isSubItemActive = item.subItems?.some((sub) =>
      isRouteActive(sub.href)
    );
    const isHighlighted = isItemActive || isSubItemActive;

    const baseClass = isHighlighted
      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
      : "text-gray-700 hover:bg-gray-100";

    // Collapsed sidebar - show only icons with submenu indicators
    if (!isExpanded) {
      return (
        <div key={item.id} className="relative">
          {item.href && item.href !== "#" && !item.hasSubmenu ? (
            <Link
              href={item.href}
              className={`w-full flex items-center justify-center p-3 rounded-md transition-colors ${baseClass} relative group`}
              title={item.label}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
            >
              <Icon
                size={22}
                className={isHighlighted ? "text-blue-600" : "text-gray-600"}
              />
            </Link>
          ) : (
            <button
              onClick={() =>
                handleNavClick(item.href || "#", item.hasSubmenu, item.id)
              }
              className={`w-full flex items-center justify-center p-3 rounded-md transition-colors ${baseClass} relative group`}
              title={item.label}
            >
              <Icon
                size={22}
                className={isHighlighted ? "text-blue-600" : "text-gray-600"}
              />
            </button>
          )}
        </div>
      );
    }

    // Expanded sidebar - show full menu
    if (item.hasSubmenu) {
      return (
        <div key={item.id}>
          <button
            onClick={() => handleNavClick(item.href || "#", true, item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${baseClass}`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <Icon
                size={18}
                className={`${isHighlighted ? "text-blue-600" : "text-gray-600"} flex-shrink-0`}
              />
              <span className="font-medium text-sm truncate">{item.label}</span>
            </div>
            {isSubmenuExpanded ? (
              <ChevronDown
                size={16}
                className={`${
                  isHighlighted ? "text-blue-600" : "text-gray-600"
                } transition-transform duration-200`}
              />
            ) : (
              <ChevronRight
                size={16}
                className={`${
                  isHighlighted ? "text-blue-600" : "text-gray-600"
                } transition-transform duration-200`}
              />
            )}
          </button>

          {isSubmenuExpanded && item.subItems && (
            <div className="ml-6 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {item.subItems.map((sub, i) => {
                const active = isRouteActive(sub.href);
                return (
                  <Link
                    key={i}
                    href={sub.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      active
                        ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <span className="truncate">{sub.label}</span>
                    {isNavigating && active && (
                      <span className="ml-2 text-xs text-gray-400">...</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href || "/admin/dashboard"}
        className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${
          isItemActive
            ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => {
          if (window.innerWidth < 1024) {
            setSidebarOpen(false);
          }
        }}
      >
        <Icon
          size={18}
          className={`${isItemActive ? "text-blue-600" : "text-gray-600"} flex-shrink-0`}
        />
        <span className="font-medium text-sm truncate">{item.label}</span>
        {isNavigating && isItemActive && (
          <span className="ml-auto text-xs text-gray-400 flex-shrink-0">...</span>
        )}
      </Link>
    );
  };

  return (
    <>
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col
          ${
            sidebarOpen
              ? "w-64 translate-x-0"
              : "w-20 -translate-x-full lg:translate-x-0 lg:hover:w-64"
          }
          fixed inset-y-0 left-0 lg:relative z-50 lg:z-auto overflow-hidden h-screen lg:h-full`}
        onMouseEnter={() => !sidebarOpen && window.innerWidth >= 1024 && setIsHovered(true)}
        onMouseLeave={() => !sidebarOpen && window.innerWidth >= 1024 && setIsHovered(false)}
      >
        <div
          className={`${
            isExpanded ? "w-64" : "w-20"
                      } transition-all duration-300 flex flex-col h-full`}
        >
          {/* Fixed Header */}
          <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-gray-100">
            {isExpanded ? (
              <>
                <span className="text-sm font-bold text-gray-800 truncate">
                  Times Computer Automation
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <span className="text-lg font-bold text-gray-800">TCA</span>
              </div>
            )}
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <nav className="mt-6 px-3 pb-6">
              {isExpanded && (
                <div className="mb-6 mt-2">
                  <p
                    className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                      sidebarOpen
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity duration-300`}
                  >
                    Menu
                  </p>
                </div>
              )}

              <div className="space-y-1">
                {filteredMenuItems.map(renderMenuItem)}
              </div>
            </nav>
          </div>
        </div>

        {/* Back to Store button for admin/superadmin */}
        {user && (user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
          <div className="p-4 border-t border-gray-100 flex justify-center">
            <Link
              href="/"
              className="group flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
              title="Back to Store"
            >
              <Home className="text-blue-600 group-hover:text-blue-800" size={22} />
              <span className="sr-only">Back to Store</span>
            </Link>
          </div>
        )}
      </div>


    </>
  );
}