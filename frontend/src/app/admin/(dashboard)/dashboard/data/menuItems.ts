import {
  LayoutDashboard,
  Lock,
  Tags,
  Package,
  Megaphone,
  FileText,
  Palette,
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
    label: "Manage Products",
    icon: Package,
    hasSubmenu: true,
    subItems: [
      { label: "All Products", href: "/admin/product/all-products" },
      { label: "Create Product", href: "/admin/product/create" },
    ],
  },
  {
    id: "attributes",
    label: "Manage Attributes",
    icon: Palette,
    hasSubmenu: true,
    subItems: [
      { label: "Categories", href: "/admin/attributes/category" },
      { label: "Brands", href: "/admin/attributes/brand" },
      { label: "Colors", href: "/admin/attributes/color" },
      { label: "Feature Tags", href: "/admin/attributes/feature-tag" },
      { label: "Marketing Tags", href: "/admin/attributes/marketing-tag" },
    ],
  },
  {
    id: "ads",
    label: "Manage Ads",
    icon: Megaphone,
    hasSubmenu: false,
    href: "/admin/ads",
  },
  {
    id: "blogs",
    label: "Manage Blogs",
    icon: FileText,
    hasSubmenu: false,
    href: "/admin/blogs",
  },
];

export const otherMenuItems: MenuItem[] = [
  
  {
    id: "user",
    label: "Manage Users",
    icon: Lock,
    hasSubmenu: false,
    href: "/admin/users",
  },
  {
    id: "auth",
    label: "Authentication",
    icon: Lock,
    hasSubmenu: true,
    subItems: [
      { label: "Change Password", href: "/admin/auth/login" },
      { label: "Log Out", href: "/admin/auth/register" },
    ],
  },
 
];
