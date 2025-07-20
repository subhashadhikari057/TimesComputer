"use client";

import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { useRouter, usePathname } from "next/navigation";
import { Product } from "../../../types/product";
import { getAllProducts } from "@/api/product";

interface SearchBarProps {
  isMobile?: boolean;
}

export default function SearchBar({ isMobile = false }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const products = Array.isArray(data) ? data.filter((product: any) => product.isPublished) : [];
        setAllProducts(products);
      } catch (error) {
        console.error("Failed to fetch products for search:", error);
        setAllProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery || allProducts.length === 0) {
      setFilteredResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter((product: Product) => {
      const searchFields = [
        product.name?.toLowerCase(),
        typeof product.brand === 'string' ? product.brand.toLowerCase() : (product.brand as any)?.name?.toLowerCase(),
      ].filter(Boolean) as string[];

      return query.length === 1
        ? searchFields.some(field => field.startsWith(query))
        : searchFields.some(field => field.includes(query));
    });

    setFilteredResults(filtered.slice(0, 8)); // Limit to 8 results
    setIsDropdownOpen(filtered.length > 0);
  }, [searchQuery, allProducts]);

  const handleResultClick = (slug: string) => {
    router.push(`/products/${slug}`);
    setSearchQuery("");
    setFilteredResults([]);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setFilteredResults([]);
      setIsDropdownOpen(false);
      if (pathname === "/search") {
        (e.target as HTMLInputElement).blur();
      }
    }
  };

  return (
    <div className={`relative ${isMobile ? "w-full" : "w-full max-w-[450px]"}`}>
      <Input
        className="w-full h-[40px] bg-white text-primary font-semibold text-[16px] border-none"
        placeholder="Search products..."
        autoFocus={isMobile}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => filteredResults.length > 0 && setIsDropdownOpen(true)}
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
      />
      
      {isDropdownOpen && (
        <div 
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {filteredResults.map((item) => (
            <button
              key={item.id}
              onClick={() => handleResultClick(item.slug || "")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-colors"
              role="option"
            >
              <div className="font-medium">{item.name}</div>
              <div className="flex justify-between">
                {item.brand && (
                  <span className="text-xs text-gray-500">
                    {typeof item.brand === 'string' ? item.brand : (item.brand as any)?.name}
                  </span>
                )}
                <span className="text-xs font-semibold">
                  Rs {item.price ? item.price.toLocaleString('en-IN') : "N/A"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}