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
import { laptopCategories, navLinks } from "@/lib/dummyData";
import { Product } from "../../../types/product";
import { dummyProducts } from "@/lib/dummyproduct";

export default function Navbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<typeof dummyProducts>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const getCurrentCategory = () => {
    if (pathname === "/") return undefined;
    if (pathname === "/products") return "products";
    if (pathname.startsWith("/category/")) {
      const categoryFromUrl = decodeURIComponent(pathname.split("/").pop() || "");
      const matchingCategory = laptopCategories.find((cat) => cat.value === categoryFromUrl);
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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults([]);
    } else {
      const filtered = dummyProducts.filter((dummyproduct: Product) =>
        (dummyproduct.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(filtered);
    }
  }, [searchQuery]);

  const handleResultClick = (slug: string) => {
    router.push(`/products/${slug}`);
    setSearchQuery("");
    setFilteredResults([]);
  };

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
              options={laptopCategories}
              placeholder="Select Categories"
              value={currentCategory}
              onChange={handleCategoryChange}
              allowDeselect={true}
              enableIcon={true}
            />
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex justify-center flex-1 relative">
            <div className="relative w-full max-w-[450px]">
              <Input
                className="w-full h-[40px] bg-white text-primary font-semibold text-[16px] border-none"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {filteredResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-lg z-50 p-2 max-h-60 overflow-y-auto">
                  {filteredResults.map((item: Product) => (
                    <button
                      key={item.id}
                      onClick={() => handleResultClick(item.slug || '')}
                      className="block w-full text-left px-4 py-2 hover:bg-primary-light hover:text-white rounded-md text-sm"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
              <Twitter className="w-6 h-6" />
              <Facebook className="w-6 h-6" />
              <FaWhatsapp className="w-6 h-6" />
            </div>

            {/* Mobile Icons */}
            <div className="md:hidden">
              <FaWhatsapp className="w-6 h-6" />
            </div>
          </div>

          {/* Mobile Search Input */}
          {showMobileSearch && (
            <div className="md:hidden w-full">
              <div className="relative">
                <Input
                  className="w-full h-[40px] bg-white text-primary font-semibold text-[16px] border-none"
                  placeholder="Search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {filteredResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-lg z-50 p-2 max-h-60 overflow-y-auto">
                    {filteredResults.map((item: Product) => (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item.slug || '')}
                        className="block w-full text-left px-4 py-2 hover:bg-primary-light hover:text-white rounded-md text-sm"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </header>
  );
}
