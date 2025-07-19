"use client";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { useRouter,usePathname } from "next/navigation";
import { laptopCategories } from "@/lib/dummyData";

const Footer: FC = () => {
  const year = new Date().getFullYear();
  const router = useRouter();

  const getCurrentCategory = () => {
    const pathname = usePathname();
    if (pathname === '/') {
      return undefined;
    }
    if (pathname === '/products') {
      return 'products';
    }
    if (pathname.startsWith('/category/')) {
      const categoryFromUrl = decodeURIComponent(pathname.split('/').pop() || '');
      const matchingCategory = laptopCategories.find(cat => cat.value === categoryFromUrl);
      return matchingCategory ? matchingCategory.value : undefined;
    }
    if (pathname.startsWith('/brand/')) {
      return undefined;
    }
    return undefined;
  };

  const currentCategory = getCurrentCategory();

  return (
    <footer className="bg-muted-background w-full py-6 text-muted-foreground2 font-medium text-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo + Description */}
          <div className="flex flex-col items-start">
            <Image
              src="/logos/logo.png"
              width={90}
              height={70}
              alt="Logo"
              className="mb-2"
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
              {laptopCategories.map((category) => (
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
