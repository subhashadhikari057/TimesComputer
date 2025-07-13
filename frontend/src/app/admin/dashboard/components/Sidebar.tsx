"use client";

import { X, ChevronDown, ChevronRight } from "lucide-react";
import { menuItems, otherMenuItems, MenuItem } from "../data/menuItems";

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
  const renderMenuItem = (item: MenuItem) => {
    const IconComponent = item.icon;
    const isExpanded = activeMenus.includes(item.id);

    if (item.hasSubmenu) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleSubmenu(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:cursor-pointer  ${
              item.isActive
                ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-3">
              <IconComponent
                size={16}
                className={item.isActive ? "text-blue-600" : "text-gray-600"}
              />
              <span
                className={
                  item.isActive
                    ? "font-semibold text-[14px]"
                    : "font-semibold text-[14px]"
                }
              >
                {item.label}
              </span>
            </div>
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
          {isExpanded && item.subItems && (
            <div className="ml-8 mt-2 space-y-1">
              {item.subItems.map((subItem, index: number) => (
                <a
                  key={index}
                  href={subItem.href}
                  className="block px-3 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  {subItem.label}
                </a>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <a
        key={item.id}
        href="#"
        className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
          item.isActive
            ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <IconComponent
          size={16}
          className={item.isActive ? "text-blue-600" : "text-gray-600"}
        />
        <span className={"font-semibold text-[14px]"}>{item.label}</span>
      </a>
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
      <div
        className={`min-w-72 ${
          !sidebarOpen ? "lg:opacity-0" : "lg:opacity-100"
        } transition-opacity duration-300`}
      >
        <div className="flex items-center justify-between h-16 px-4 pt-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">
              Times Computer
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="mb-3">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              MENU
            </p>
          </div>
          <div className="space-y-2">
            {/* Main Menu Items */}
            {menuItems.map(renderMenuItem)}

            {/* OTHERS Section */}
            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                OTHERS
              </p>
            </div>

            {/* Other Menu Items */}
            {otherMenuItems.map(renderMenuItem)}
          </div>
        </nav>
      </div>
    </div>
  );
}
