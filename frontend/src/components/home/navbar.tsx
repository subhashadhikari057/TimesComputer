"use client";

import Link from "next/link";
import Image from "next/image";
import Dropdown from "./dropdown";
import { Input } from "../ui/input";
import { Twitter, Search } from "lucide-react";
import { useState, useEffect } from "react";
import MobileSidebar from "../responsive/mobileSidebar";

// Laptop category options for dropdown
const laptopCategories = [
  { label: "Gaming Laptops", value: "gaming" },
  { label: "Business Laptops", value: "business" },
  { label: "Student Laptops", value: "student" },
  { label: "Everyday Laptops", value: "everyday" },
  { label: "Macbooks", value: "macbooks" },
];

// Main navigation links
const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
  { title: "More", href: "/more" },
];

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Disable body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Nav */}
      <nav className="w-full h-16 flex items-center justify-between text-primary">
        <div className="w-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Image
            src="/logos/logo.png"
            alt="Brand Logo"
            width={56}
            height={56}
            priority
          />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-16 text-[16px] font-semibold">
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

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navLinks={navLinks}
      />

      {/* Search + Category Bar */}
      <section className="bg-primary">
        <div className="w-full max-w-screen-xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-4 overflow-x-hidden">

          {/* Category Dropdown */}
          <div className="w-[160px] md:w-[180px] flex-shrink-0">
            <Dropdown
              options={laptopCategories}
              placeholder="All Categories"
              onChange={() => { }}
            />
          </div>

          {/* Search input (desktop only) */}
          <div className="hidden md:block flex-1">
            <Input
              className="w-full max-w-[450px] h-[40px] bg-white text-primary font-semibold text-[16px] border-none"
              placeholder="Search"
            />
          </div>

          {/* Icons (search toggle + Twitter) */}
          <div className="flex-shrink-0 flex items-center gap-4 text-white">
            {/* Mobile Search Icon */}
            <button
              className="md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Twitter Icon */}
            <Twitter className="w-6 h-6" />
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
