"use client";

import Link from "next/link";
import Image from "next/image";
import Dropdown from "../form/form-elements/dropdown";
import { Input } from "../ui/input";
import { Twitter, Facebook, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import MobileSidebar from "../responsive/mobileSidebar";
import { FaWhatsapp } from "react-icons/fa";
import { navLinks } from "@/lib/dummyData";
import SearchBar from "./searchbar";
import { getAllCategories } from "@/api/category";
import { getImageUrl } from "@/lib/imageUtils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Transform backend categories to dropdown format
  const transformCategories = (backendCategories: any[]) => {
    // Create a simple SVG for "All Products" 
    const allProductsIcon = 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
      </svg>
    `);
    
    const allProductsOption = { label: "All Products", value: "products", icon: allProductsIcon };
    
    const transformedCategories = backendCategories.map((category) => ({
      label: category.name,
      value: category.name.toLowerCase().replace(/\s+/g, ' ').trim(),
      icon: getImageUrl(category.icon) // Use getImageUrl for proper image handling
    }));

    return [allProductsOption, ...transformedCategories];
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await getAllCategories();
      const categoriesData = response.data || [];
      const transformedCategories = transformCategories(categoriesData);
      setCategories(transformedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Fallback to empty array if API fails
      const fallbackIcon = 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
        </svg>
      `);
      setCategories([{ label: "All Products", value: "products", icon: fallbackIcon }]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Refresh categories when window gets focus (user comes back after adding categories)
  useEffect(() => {
    const handleWindowFocus = () => {
      fetchCategories();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCategories();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const getCurrentCategory = () => {
    if (pathname === "/") return undefined;
    if (pathname === "/products") return "products";
    if (pathname.startsWith("/category/")) {
      const categoryFromUrl = decodeURIComponent(pathname.split("/").pop() || "");
      const matchingCategory = categories.find((cat: any) => cat.value === categoryFromUrl);
      return matchingCategory ? matchingCategory.value : undefined;
    }
    return undefined;
  };

  const currentCategory = getCurrentCategory();

  const handleCategoryChange = (value: string | undefined) => {
    if (value === undefined) {
      router.push("/");
      return;
    }

    if (value === "products" || value === "all-products") {
      router.push("/products");
    } else {
      router.push(`/category/${value}`);
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
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-16 text-[16px] font-bold">
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
            <span className="font-bold">Have Questions?</span>
            <Link href="tel:+9779808113344" className="text-lg font-bold hover:underline">
              9808113344
            </Link>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
        <div className="w-full max-w-screen-xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-4 relative">
          {/* Dropdown */}
          <div className="w-[160px] md:w-[180px] flex-shrink-0">
            <Dropdown
              options={categories}
              placeholder="Categories"
              value={currentCategory}
              onChange={handleCategoryChange}
              allowDeselect={true}
              enableIcon={true}
            />
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex justify-center flex-1">
            <SearchBar />
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

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-6">
              <Link target="_blank" href="https://twitter.com/times_computer" rel="noopener noreferrer">
              <Twitter  className="cursor-pointer w-6 h-6" />
              </Link>
              <Link target="_blank" href="https://www.facebook.com/timescomputers" rel="noopener noreferrer">
              <Facebook className="cursor-pointer w-6 h-6" />
              </Link>
              <Link target="_blank" href="https://api.whatsapp.com/send?phone=9779808113344" rel="noopener noreferrer">
              <FaWhatsapp className="cursor-pointer w-6 h-6" />
              </Link>
            </div>

            {/* Mobile Icons */}
            <Link target="_blank" className="md:hidden" href="https://api.whatsapp.com/send?phone=9779808113344" rel="noopener noreferrer">
              <FaWhatsapp className="w-6 h-6" />
            </Link>
          </div>

          {/* Mobile Search Input */}
          {showMobileSearch && (
  <div className="md:hidden w-full">
    <SearchBar isMobile />
  </div>
)}
        </div>
      </section>
    </header>
  );
}
