"use client";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { useState, useEffect, useCallback } from "react";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getAllCategories } from "@/api/category";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface FooterCategory {
  label: string;
  value: string;
}

const Footer: FC = () => {
  const year = new Date().getFullYear();
  const [footerCategories, setFooterCategories] = useState<FooterCategory[]>([]);

  // Transform backend categories to footer format and limit to 5
  const transformCategories = (backendCategories: Category[]): FooterCategory[] => {
    const allProductsOption = { label: "All Products", value: "products" };

    const transformedCategories = backendCategories
      .slice(0, 4) // Take only 4 from API to make room for "All Products"
      .map((category) => ({
        label: category.name,
        value: category.name.toLowerCase().replace(/\s+/g, ' ').trim(),
      }));

    return [allProductsOption, ...transformedCategories];
  };

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getAllCategories();
      const categoriesData = response.data || [];
      const transformedCategories = transformCategories(categoriesData);
      setFooterCategories(transformedCategories);
    } catch (error) {
      console.error("Failed to fetch categories for footer:", error);
      // Fallback to default categories if API fails
      setFooterCategories([
        { label: "All Products", value: "products" },
        { label: "Laptops", value: "laptops" },
        { label: "Accessories", value: "accessories" },
        { label: "Gaming", value: "gaming" },
        { label: "Business", value: "business" },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <footer className="bg-muted-background w-full py-6 text-muted-foreground2 font-medium text-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo + Description */}
          <div className="flex flex-col items-start">
            <Image
              src="/logos/logo.svg"
              alt="Brand Logo"
              width={120}
              height={90}
              priority
            />
            <p className="text-sm leading-relaxed">
              Built on a simple idea — buying a laptop shouldn&apos;t be complicated.
            </p>

            <div className="flex space-x-3 mt-3 text-lg">
              <Link href="#"><FaInstagram className="text-primary" /></Link>
              <Link href="#"><FaFacebook className="text-primary" /></Link>
              <Link href="#"><FaTwitter className="text-primary" /></Link>
            </div>
          </div>

          {/* Top Category - Hidden on mobile */}
          <div className="hidden md:block">
            <h3 className="font-semibold text-primary text-base mb-2">
              Top Category
              <div className="h-[2px] w-1/2 bg-primary mt-1"></div>
            </h3>
            <ul className="space-y-1 mt-2 text-sm">
              {footerCategories.map((category: FooterCategory) => (
                <li key={category.value}>
                  <Link
                    href={category.value === 'products' ? '/products' : `/category/${category.value}`}
                    className="hover:underline hover:text-primary"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links + Contact side-by-side */}
          <div className="grid grid-cols-2 gap-6 md:col-span-2">
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-primary text-base mb-2">
                Quick Links
                <div className="h-[2px] w-1/2 bg-primary mt-1"></div>
              </h3>
              <ul className="space-y-1 mt-2 text-sm">
                <li><Link href="/" className="hover:underline hover:text-primary">Home</Link></li>
                <li><Link href="/products" className="hover:underline hover:text-primary">Products</Link></li>
                <li><Link href="/blogs" className="hover:underline hover:text-primary">Blog</Link></li>
                <li><Link href="/about" className="hover:underline hover:text-primary">About</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-primary text-base mb-2">
                Contact
                <div className="h-[2px] w-1/2 bg-primary mt-1"></div>
              </h3>
              <ul className="space-y-2 mt-2 text-sm">
                <li className="flex items-center gap-2"><FaPhone /> 9808119904</li>
                <li className="flex items-center gap-2"><FaEnvelope /> admin@gmail.com</li>
                <li className="flex items-center gap-2"><FaMapMarkerAlt /> Kathmandu, Nepal</li>
              </ul>
              <div className="mt-3">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.447849544003!2d85.3226347!3d27.7034555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a842976dcd%3A0x16f9af684b2eaa9c!2sTime%20Office%20Automation%20PVT%20LTD!5e0!3m2!1sen!2snp!4v1752471076407!5m2!1sen!2snp"
                  width="100%"
                  height="90"
                  className="rounded-xl"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer - Tight spacing on mobile */}
        <div className="mt-2 sm:mt-6 pt-3 sm:pt-4 border-t border-muted-border flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-2">
          <p>&copy; {year} Times Computer Automation. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:underline hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
