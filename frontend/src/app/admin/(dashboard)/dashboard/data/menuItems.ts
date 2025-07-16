import { LayoutDashboard, Lock, Tags, Package } from "lucide-react";

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
    label: "Product Management",
    icon: Package,
    hasSubmenu: true,
    subItems: [
      { label: "All Products", href: "/admin/product/all-products" },
      { label: "Create Product", href: "/admin/product/create" },
    ],
  },
  {
    id: "attributes",
    label: "Attributes Management",
    icon: Tags,
    hasSubmenu: true,
    subItems: [
      { label: "Category", href: "/admin/attributes/category" },
      { label: "Brands", href: "/admin/attributes/all-brands" },
      { label: "Colors", href: "/admin/attributes/all-colors" },
      { label: "Tags", href: "/admin/attributes/all-tags" },
    ],
  },
];

export const otherMenuItems: MenuItem[] = [
  {
    id: "auth",
    label: "Authentication",
    icon: Lock,
    hasSubmenu: true,
  },
  {
    id: "user",
    label: "User Management",
    icon: Lock,
    hasSubmenu: true,
  },
  {
    id: "ads",
    label: "Ads Management",
    icon: Lock,
    hasSubmenu: true,
  },
  {
    id: "blogs",
    label: "Blogs Management",
    icon: Lock,
    hasSubmenu: true,
  },
];
