"use client";

import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { useRouter, usePathname } from "next/navigation";
import { Product } from "../../../types/product";
import { dummyProducts } from "@/lib/dummyproduct";

interface SearchBarProps {
  isMobile?: boolean;
}

export default function SearchBar({ isMobile = false }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setFilteredResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = dummyProducts.filter((product: Product) => {
      const searchFields = [
        product.name?.toLowerCase(),
        product.title?.toLowerCase(),
        product.brand?.toLowerCase(),
      ].filter(Boolean) as string[];

      return query.length === 1
        ? searchFields.some(field => field.startsWith(query))
        : searchFields.some(field => field.includes(query));
    });

    setFilteredResults(filtered);
    setIsDropdownOpen(filtered.length > 0);
  }, [searchQuery]);

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
              <div className="font-medium">{item.name || item.title}</div>
              <div className="flex justify-between">
                {item.brand && <span className="text-xs text-gray-500">{item.brand}</span>}
                <span className="text-xs font-semibold">${item.price?.toFixed(2)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}