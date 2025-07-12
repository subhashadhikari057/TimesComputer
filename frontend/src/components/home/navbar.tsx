"use client"

import Link from "next/link"
import Image from "next/image"
import Dropdown from "./dropdown"
import { Input } from "../ui/input"
import {Instagram , Facebook , Twitter, Search} from "lucide-react"
import MobileSidebar from "../responsive/mobileSidebar"
import { useState } from "react"

const laptopCategories = [
  { label: "Gaming Laptops", value: "gaming" },
  { label: "Business Laptops", value: "business" },
  { label: "Student Laptops", value: "student" },
  { label: "Everyday Laptops", value: "everyday" },
  { label: "Macbooks", value: "macbooks" },
]

const navLinks =[
  {title:"Home",href:"/"},
  {title:"About",href:"/about"},
  {title:"Blog",href:"/blog"},
  {title:"More",href:"/more"},
]

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  return (
    <header className="sticky top-0 z-50">
      {/* navbar */}
      <nav className="flex w-full pl-[5.20vw] pr-[5.20vw] py-6 h-[7.5vh] items-center text-primary justify-between">
        {/* logo */}
        <div>
          <Image
            src="/logo.png"
            alt="Brand Logo"
            width={56}
            height={56}
            priority
          />
        </div>
        
        {/* navlinks - hidden on mobile */}
        <div className="hidden md:flex items-center justify-center gap-20 text-primary font-semibold text-[18px]">
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
        
        {/* contact us - always visible */}
        <div className="flex flex-col font-semibold text-primary text-[16px]">
          <span>contact us?</span>
          <Link href="tel:+9779808113344" className="hover:text-primary-dark transition-colors">
            9808113344
          </Link>
        </div>
        
        {/* mobile menu button - visible only on mobile */}
        <button 
          className="md:hidden text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
          aria-expanded={isSidebarOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
      </nav>

      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        navLinks={navLinks}
      />

<section className="flex w-full pl-[5.20vw] pr-[5.20vw] py-6 h-[7.5vh] items-center bg-primary justify-between">
      {/* Categories dropdown - visible on all devices */}
      <div className="w-[180px]">
        <Dropdown 
          options={laptopCategories}
          placeholder="All Categories"
          onChange={() => {}}
        />
      </div>

      {/* Search bar - visible only on laptop */}
      <div className="hidden md:block">
        <Input 
          className="w-[450px] h-[40px] bg-white flex items-center justify-center text-primary font-semibold text-[16px] border-none" 
          placeholder="Search" 
        />
      </div>

      {/* Icons container */}
      <div className="flex items-center gap-4 md:gap-10 text-white">
        {/* Search icon - visible only on tablet/mobile */}
        <button 
          className="md:hidden"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          aria-label="Search"
        >
          <Search className="w-6 h-6" />
        </button>

        {/* Social icons - visible on all devices */}
        <div className="flex gap-4 md:gap-10">
          <Instagram className="w-6 h-6" />
          <Facebook className="w-6 h-6" />
          <Twitter className="w-6 h-6" />
        </div>
      </div>

      {/* Mobile search input - appears when search icon is clicked */}
      {showMobileSearch && (
        <div className="md:hidden absolute top-20 left-0 right-0 px-[5.20vw] z-10">
          <Input 
            className="w-full h-[40px] bg-white flex items-center justify-center text-primary font-semibold text-[16px] border-none" 
            placeholder="Search" 
            autoFocus
          />
        </div>
      )}
    </section>
    </header>
  )
}
