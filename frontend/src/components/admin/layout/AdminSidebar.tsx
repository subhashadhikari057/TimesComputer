"use client";

import { X, ChevronDown, ChevronRight } from "lucide-react";
import {
  menuItems,
  MenuItem,
} from "@/app/admin/(dashboard)/dashboard/data/menuItems";
import Link from "next/link";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenus: string[];
  toggleSubmenu: (menu: string) => void;
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
              className={`w-full flex items-center justify-center px-3 py-3 rounded-md transition-colors ${baseClass} relative group`}
              title={item.label}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
            >
              <Icon
                size={20}
                className={isHighlighted ? "text-blue-600" : "text-gray-600"}
              />
            </Link>
          ) : (
            <button
              onClick={() =>
                handleNavClick(item.href || "#", item.hasSubmenu, item.id)
              }
              className={`w-full flex items-center justify-center px-3 py-3 rounded-md transition-colors ${baseClass} relative group`}
              title={item.label}
            >
              <Icon
                size={20}
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
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${baseClass}`}
          >
            <div className="flex items-center space-x-3">
              <Icon
                size={16}
                className={isHighlighted ? "text-blue-600" : "text-gray-600"}
              />
              <span className="font-semibold text-[14px]">{item.label}</span>
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
            <div className="ml-8 mt-2 space-y-1 animate-fadeIn">
              {item.subItems.map((sub, i) => {
                const active = isRouteActive(sub.href);
                return (
                  <Link
                    key={i}
                    href={sub.href}
                    className={`block px-3 py-2 text-[13px] font-semibold rounded-md transition-colors ${
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
                    {sub.label}
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
        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
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
          size={16}
          className={isItemActive ? "text-blue-600" : "text-gray-600"}
        />
        <span className="font-semibold text-[14px]">{item.label}</span>
        {isNavigating && isItemActive && (
          <span className="ml-auto text-xs text-gray-400">...</span>
        )}
      </Link>
    );
  };

  return (
    <>
      <div
        className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ease-in-out flex flex-col
          ${
            sidebarOpen
              ? "w-3/4 md:w-64 translate-x-0"
              : "w-20 -translate-x-full lg:translate-x-0 lg:hover:w-64"
          }
          fixed left-0 lg:relative z-50 lg:z-auto overflow-hidden`}
        onMouseEnter={() => !sidebarOpen && setIsHovered(true)}
        onMouseLeave={() => !sidebarOpen && setIsHovered(false)}
      >
        <div
          className={`${
            isExpanded ? "min-w-64" : "min-w-20"
          } transition-all duration-300 flex flex-col h-full`}
        >
          {/* Fixed Header */}
          <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 pt-4 border-b border-gray-100">
            {isExpanded ? (
              <>
                <span className="text-xl font-bold text-gray-800">
                  Times Computer
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <span className="text-lg font-bold text-gray-800">T</span>
              </div>
            )}
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <nav className="mt-6 px-4 pb-6">
              {isExpanded && (
                <div className="mb-3">
                  <p
                    className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                      sidebarOpen
                        ? "opacity-100"
                        : " group-hover:opacity-100"
                    } transition-opacity duration-300`}
                  >
                    Menu
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {menuItems.map(renderMenuItem)}
              </div>
            </nav>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        /* Custom scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </>
  );
}