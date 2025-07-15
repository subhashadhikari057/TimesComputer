"use client";

import Link from "next/link";
import Image from "next/image";
import Dropdown from "../form/form-elements/dropdown";
import { Input } from "../ui/input";
import { Twitter, Facebook, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import MobileSidebar from "../responsive/mobileSidebar";
import { FaWhatsapp } from "react-icons/fa";

const laptopCategories = [
  { label: "All Products", value: "all-products" },  // Changed from "all-products" to "all"
  { label: "Gaming Laptops", value: "gaming-laptop" },
  { label: "Business Laptops", value: "business-laptop" },
  { label: "Student Laptops", value: "student-laptop" },
  { label: "Everyday Laptops", value: "everyday-laptop" },
  { label: "Macbooks", value: "mac" },
];

const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
  { title: "More", href: "/more" },
];

export default function Navbar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  
  // Get the current category from the URL
  const getCurrentCategory = () => {
    // On homepage, return undefined to show placeholder
    if (pathname === '/') {
      return undefined;
    }
    // On products page, return all-products
    if (pathname === '/products') {
      return 'all-products';
    }
    // On category pages, return the category
    if (pathname.startsWith('/category/')) {
      return pathname.split('/').pop();
    }
    // Default to undefined to show placeholder
    return undefined;
  };
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const currentCategory = getCurrentCategory();

  const handleCategoryChange = (value: string | undefined) => {
    const selectedValue = value || "all-products";
    
    if (selectedValue === "all-products") {
      // For "All Products", go to products page
      router.push("/products");
    } else {
      // For specific categories, go to category page
      router.push(`/category/${selectedValue}`);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Nav */}
      <nav className="w-full h-14 flex items-center justify-between text-primary">
        <div className="w-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Image
            src="/logos/logo.png"
            alt="Brand Logo"
            width={56}
            height={56}
            priority
          />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-16 text-[16px] font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary-dark transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Right Contact Info - Desktop only */}
          <div className="hidden md:flex flex-col text-right text-primary text-sm leading-tight">
            <span className="font-semibold">Have Questions?</span>
            <a href="tel:9808113344" className="text-lg font-semibold hover:underline">
              9808113344
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navLinks={navLinks}
      />

      {/* Category + Search + Icons */}
      <section className="bg-primary h-14">
        <div className="w-full max-w-screen-xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-4">
          {/* Dropdown */}
          <div className="w-[160px] md:w-[180px] flex-shrink-0">
            <Dropdown
              options={laptopCategories}
              placeholder="Select Categories"
              value={currentCategory}
              onChange={handleCategoryChange}
              allowDeselect={true}
            />
          </div>

          {/* Centered Search */}
          <div className="hidden md:flex justify-center flex-1">
            <Input
              className="w-full max-w-[450px] h-[40px] bg-white text-primary font-semibold text-[16px] border-none"
              placeholder="Search"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-white">
            {/* Mobile Search Icon */}
            <button
              className="md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Show all icons on desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Twitter className="w-6 h-6" />
              <Facebook className="w-6 h-6" />
              <FaWhatsapp className="w-6 h-6" />
            </div>

            {/* Only Twitter on mobile */}
            <div className="md:hidden">
              <FaWhatsapp className="w-6 h-6" />
            </div>
          </div>

          {/* Mobile Search Input */}
          {showMobileSearch && (
            <div className="md:hidden w-full">
              <Input
                className="w-full h-[40px] bg-white text-primary font-semibold text-[16px] border-none"
                placeholder="Search"
                autoFocus
              />
            </div>
          )}
        </div>
      </section>
    </header>
  );
}