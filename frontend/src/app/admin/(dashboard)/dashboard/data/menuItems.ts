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
  href?: string;
  subItems?: { label: string; href: string }[];
}

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    hasSubmenu: false,
    href: "/admin/dashboard",
  },
  {
    id: "product",
    label: "Product",
    icon: FileText,
    hasSubmenu: true,
    subItems: [
      { label: "Create Product", href: "/admin/product/create" },
      { label: "View Products", href: "/admin/product/view" },
    ],
  },
  {
    id: "profile",
    label: "User Profile",
    icon: User,
    hasSubmenu: true,
  },
];

export const otherMenuItems: MenuItem[] = [
  {
    id: "auth",
    label: "Authentication",
    icon: Lock,
    hasSubmenu: true,
  },
];
