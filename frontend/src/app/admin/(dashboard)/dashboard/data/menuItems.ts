import {
  LayoutDashboard,
  User,
  FileText,
  BarChart3,
  Lock,
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  hasSubmenu: boolean;
  isActive: boolean;
  subItems?: { label: string; href: string }[];
}

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    hasSubmenu: false,
    isActive: true,
  },
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    hasSubmenu: true,
    isActive: false,
    subItems: [
      { label: "Analytics", href: "#" },
      { label: "Reports", href: "#" },
      { label: "Statistics", href: "#" },
    ],
  },
  {
    id: "product",
    label: "Product",
    icon: FileText,
    hasSubmenu: true,
    isActive: false,
    subItems: [
      { label: "Create Product", href: "#" },
      { label: "View Products", href: "#" },
      { label: "Edit Product", href: "#" },
      { label: "Delete Product", href: "#" },
    ],
  },
  {
    id: "profile",
    label: "User Profile",
    icon: User,
    hasSubmenu: true,
    isActive: false,
  },
];

export const otherMenuItems: MenuItem[] = [
  {
    id: "auth",
    label: "Authentication",
    icon: Lock,
    hasSubmenu: true,
    isActive: false,
  },
];
