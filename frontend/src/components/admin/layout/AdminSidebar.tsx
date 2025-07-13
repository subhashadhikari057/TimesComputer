"use client";

import { X, ChevronDown, ChevronRight } from "lucide-react";
import {
  menuItems,
  otherMenuItems,
  MenuItem,
} from "@/app/admin/(dashboard)/dashboard/data/menuItems";
import Link from "next/link";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { useRouter } from "next/navigation";

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

  const handleNavClick = (
    href: string,
    hasSubmenu: boolean,
    itemId: string
  ) => {
    if (hasSubmenu) {
      // Ensure only one menu is open at a time
      if (activeMenus.includes(itemId)) {
        toggleSubmenu(""); // collapse all
      } else {
        toggleSubmenu(itemId); // open selected
      }
    } else if (href && href !== "#") {
      router.push(href);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isExpanded = activeMenus.includes(item.id);
    const isItemActive = item.href ? isRouteActive(item.href) : false;
    const isSubItemActive = item.subItems?.some(sub => isRouteActive(sub.href));
    const isHighlighted = isItemActive || isSubItemActive;

    const baseClass = isHighlighted
      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
      : "text-gray-700 hover:bg-gray-100";

    if (item.hasSubmenu) {
      return (
        <div key={item.id}>
          <button
            onClick={() => handleNavClick(item.href || "#", true, item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${baseClass}`}
          >
            <div className="flex items-center space-x-3">
              <Icon size={16} className={isHighlighted ? "text-blue-600" : "text-gray-600"} />
              <span className={`font-semibold text-[14px]`}>{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown size={16} className={isHighlighted ? "text-blue-600" : "text-gray-600"} />
            ) : (
              <ChevronRight size={16} className={isHighlighted ? "text-blue-600" : "text-gray-600"} />
            )}
          </button>

          {isExpanded && item.subItems && (
            <div className="ml-8 mt-2 space-y-1">
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
        <Icon size={16} className={isItemActive ? "text-blue-600" : "text-gray-600"} />
        <span className="font-semibold text-[14px]">{item.label}</span>
      </Link>
    );
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ease-in-out
        ${
          sidebarOpen
            ? "w-3/4 md:w-72 translate-x-0"
            : "w-3/4 md:w-72 -translate-x-full lg:w-0 lg:translate-x-0"
        }
        fixed left-0 z-50 lg:relative lg:z-auto overflow-hidden`}
    >
      <div className={`min-w-72 ${!sidebarOpen ? "lg:opacity-0" : "lg:opacity-100"} transition-opacity duration-300`}>
        <div className="flex items-center justify-between h-16 px-4 pt-4">
          <span className="text-xl font-bold text-gray-800">Times Computer</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="mb-3">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
          </div>
          <div className="space-y-2">
            {menuItems.map(renderMenuItem)}

            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Others</p>
            </div>

            {otherMenuItems.map(renderMenuItem)}
          </div>
        </nav>
      </div>
    </div>
  );
}
