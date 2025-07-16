"use client";

import Link from "next/link";
import { FC, useEffect } from "react";

interface NavLink {
  href: string;
  title: string;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

const MobileSidebar: FC<MobileSidebarProps> = ({ isOpen, onClose, navLinks }) => {
  // Close on ESC press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Overlay (blurs background only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white/80 backdrop-blur-md shadow-lg`}
        aria-hidden={!isOpen}
      >
        {/* Close button */}
        <div className="p-4 flex justify-end border-b border-primary">
          <button
            onClick={onClose}
            className="text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-6 p-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-primary text-[18px] font-semibold hover:text-primary-dark transition-colors"
              onClick={onClose}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default MobileSidebar;
