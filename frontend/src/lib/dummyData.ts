// Centralized dummy data for the entire application
import { Product } from '../../types/product';
import { Banner } from '../../types/banner';

import {
  Laptop,
  GameController,
  Briefcase,
  Student,
  Monitor,
  AppleLogo,
} from "phosphor-react";

// Navigation Links
export const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blogs" },
  { title: "All Products", href: "/products" },
];

// Laptop Categories for Dropdown
export const laptopCategories = [
  { label: "All Products", value: "products", icon: "Laptop" },
  { label: "Gaming Laptops", value: "gaming laptop", icon: "GameController" },
  { label: "Business Laptops", value: "business laptop", icon: "Briefcase" },
  { label: "Student Laptops", value: "student laptop", icon: "Student" },
  { label: "Everyday Laptops", value: "everyday laptop", icon: "Monitor" },
  { label: "Macbooks", value: "mac", icon: "AppleLogo" },
];

// Top Categories for Category Section
export const topCategories = [
  { id: 1, title: "gaming laptop", displayTitle: "Gaming Laptop", image: "/products/Frame 68.png" },
  { id: 2, title: "business laptop", displayTitle: "Business Laptop", image: "/products/Frame 134.png" },
  { id: 3, title: "student laptop", displayTitle: "Student Laptop", image: "/products/Frame 135.png" },
  { id: 4, title: "everyday laptop", displayTitle: "Everyday Laptop", image: "/products/Frame 136.png" },
  { id: 5, title: "mac", displayTitle: "Mac", image: "/topcat/mac.avif" },
  { id: 6, title: "keyboard", displayTitle: "Keyboard", image: "/topcat/keyboard.jpeg" },
  { id: 7, title: "mouse", displayTitle: "Mouse", image: "/topcat/mouse.png" },
  { id: 8, title: "monitor", displayTitle: "Monitor", image: "/topcat/monitor.jpeg" },
];

// Brands for Brand Scroller
export const brands = [
  {
    name: 'Dell',
    logo: 'DELL',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
  },
  {
    name: 'Apple',
    logo: '🍎',
    bgColor: 'bg-gray-400',
    textColor: 'text-white',
  },
  {
    name: 'Lenovo',
    logo: 'lenovo',
    bgColor: 'bg-white',
    textColor: 'text-red-500',
  },
  {
    name: 'ASUS',
    logo: 'ASUS',
    bgColor: 'bg-black',
    textColor: 'text-white',
  },
  {
    name: 'HP',
    logo: 'hp',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
  },
  {
    name: 'Acer',
    logo: 'acer',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
  },
  {
    name: 'Microsoft',
    logo: '⊞',
    bgColor: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500',
    textColor: 'text-white',
  },
];

// Blog Posts
export interface BlogCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export const blogs: BlogCardProps[] = [
  {
    title: "Best Laptops for Students in 2024?",
    description: "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/products/Frame 68.png",
  },
  {
    title: "Gaming Laptops Under NPR 1,00,000",
    description: "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/products/Frame 68.png",
  },
  {
    title: "How to Keep Your Laptop Fast?",
    description: "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/products/Frame 68.png",
  },
  {
    title: "Best Laptops for Students in 2024?",
    description: "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/products/Frame 68.png",
  },
  {
    title: "Best Laptops for Students in 2024?",
    description: "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/products/Frame 68.png",
  },
];

// Single Banner Data
export const singleBanners: Banner[] = [
  {
    id: "1",
    imageUrl: "/banners/Frame 172.svg",
    alt: "banner2",
    link: "/banner2",
  },
  {
    id: "2",
    imageUrl: "/banners/Frame 174.svg",
    alt: "banner2",
    link: "/banner2",
  },
];

// Multiple Banner Data - Right banners
export const rightBanners: Banner[] = [
  {
    id: "1",
    imageUrl: "/banners/Frame 111.png",
    alt: "banner2",
    link: "/banner2",
  },
  {
    id: "2",
    imageUrl: "/banners/Frame 112.png",
    alt: "banner3",
    link: "/banner3",
  },
  {
    id: "3",
    imageUrl: "/banners/Frame 113.png",
    alt: "banner4",
    link: "/banner4",
  },
];

// Slider banners
export const sliderBanners: Banner[] = [
  {
    id: "s1",
    imageUrl: "/banners/Frame 113.png",
    alt: "slide1",
    link: "/slide1",
  },
  {
    id: "s2",
    imageUrl: "/banners/Frame 114.png",
    alt: "slide2",
    link: "/slide2",
  },
  {
    id: "s3",
    imageUrl: "/banners/Frame 115.png",
    alt: "slide3",
    link: "/slide3",
  },
  {
    id: "s4",
    imageUrl: "/banners/Frame 116.png",
    alt: "slide4",
    link: "/slide4",
  },
];

// Sort Options
export const sortOptions = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
];

// Featured Products (for product sections)
export const featuredProducts: Product[] = [
  {
    id: 1,
    title: "Dell XPS 13",
    brand: "Dell",
    category: "business laptop",
    price: 89999,
    currency: "NPR",
    rating: 4.5,
    reviews: 128,
    images: ["/products/Frame 68.png"],
    description: "Ultra-portable business laptop with premium build quality",
    specs: {
      "Processor": "Intel Core i7-1165G7",
      "RAM": "16GB LPDDR4x",
      "Storage": "512GB SSD",
      "Display": "13.4-inch FHD+"
    },
    tag: "Featured"
  },
  {
    id: 2,
    title: "MacBook Air M2",
    brand: "Apple",
    category: "mac",
    price: 134999,
    currency: "NPR",
    rating: 4.8,
    reviews: 256,
    images: ["/products/Frame 134.png"],
    description: "Apple's latest MacBook Air with M2 chip",
    specs: {
      "Processor": "Apple M2",
      "RAM": "8GB Unified Memory",
      "Storage": "256GB SSD",
      "Display": "13.6-inch Liquid Retina"
    },
    tag: "Popular"
  },
  {
    id: 3,
    title: "ASUS ROG Strix G15",
    brand: "ASUS",
    category: "gaming laptop",
    price: 124999,
    currency: "NPR",
    rating: 4.6,
    reviews: 89,
    images: ["/products/Frame 135.png"],
    description: "High-performance gaming laptop with RGB lighting",
    specs: {
      "Processor": "AMD Ryzen 7 5800H",
      "RAM": "16GB DDR4",
      "Storage": "1TB SSD",
      "Display": "15.6-inch FHD 144Hz"
    },
    tag: "Gaming"
  },
  {
    id: 4,
    title: "HP Pavilion 15",
    brand: "HP",
    category: "student laptop",
    price: 65999,
    currency: "NPR",
    rating: 4.2,
    reviews: 156,
    images: ["/products/Frame 136.png"],
    description: "Affordable laptop perfect for students",
    specs: {
      "Processor": "Intel Core i5-1135G7",
      "RAM": "8GB DDR4",
      "Storage": "512GB SSD",
      "Display": "15.6-inch FHD"
    },
    tag: "Student"
  },
];

 

// Popular Products (subset of featured products)
export const popularProducts: Product[] = featuredProducts.filter(product => product.popular);

// Default Price Range for Filters
export const DEFAULT_PRICE_RANGE = [25000, 500000];
