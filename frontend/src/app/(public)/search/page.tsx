"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SortSelect from "@/components/common/sortselect";
import { getAllProducts } from "@/api/product"; // 🔁 API Call
import ProductCard from "@/components/products/productcard";
import FilterSidebar from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SkeletonLoader from "@/components/common/skeletonloader";
import { Product } from "../../../../types/product";
import { Filters } from "../../../../types/filtewr";

const PRODUCTS_PER_PAGE = 12;

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const sort = searchParams.get("sort") || undefined;
  const query = searchParams.get("query")?.toLowerCase().trim() || "";
  const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Filters>({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch {
      
        toast.error("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let count = 0;
    Object.entries(appliedFilters).forEach(([, value]) => {
      if (Array.isArray(value)) count += value.length;
      else if (value) count += 1;
    });
    setActiveFiltersCount(count);
  }, [appliedFilters]);

  const handleApplyFilters = (filters: Filters) => {
    setAppliedFilters(filters);
    if (page !== 1) goToPage(1);
  };

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (sort) params.set("sort", sort);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const filteredProducts = products.filter(product => {
    // Search query filter
    if (query) {
      const searchFields = [
        product.name,
        product.title,
        typeof product.brand === 'object' && product.brand !== null 
          ? (product.brand as { name: string }).name 
          : product.brand
      ].filter(Boolean);

      const matchesQuery = searchFields.some(field => {
        const f = String(field).toLowerCase();
        return query.length === 1 ? f.startsWith(query) : f.includes(query);
      });

      if (!matchesQuery) return false;
    }

    // Brand filter
    if (appliedFilters.brand && appliedFilters.brand.length > 0) {
      const brandName = typeof product.brand === 'object' && product.brand !== null
        ? (product.brand as { name: string }).name
        : product.brand as string;
      if (!brandName || !appliedFilters.brand.includes(brandName)) {
        return false;
      }
    }

    // Category filter
    if (appliedFilters.category && appliedFilters.category.length > 0) {
      const categoryName = typeof product.category === 'object' && product.category !== null
        ? (product.category as { name: string }).name
        : product.category as string;
      if (!categoryName || !appliedFilters.category.includes(categoryName)) {
        return false;
      }
    }

    // Price filter
    if (appliedFilters.priceRange && product.price) {
      const [min, max] = appliedFilters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }

    return true;
  });

  const sortedProducts = [...filteredProducts];
  switch (sort) {
    case "price-low-high":
      sortedProducts.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;
    case "price-high-low":
      sortedProducts.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    case "product-name-a-z":
      sortedProducts.sort((a, b) =>
        (a.name || a.title || "").localeCompare(b.name || b.title || "")
      );
      break;
    case "product-name-z-a":
      sortedProducts.sort((a, b) =>
        (b.name || b.title || "").localeCompare(a.name || a.title || "")
      );
      break;
    case "featured":
      sortedProducts.sort((a, b) => {
        const aF = a.tag?.toLowerCase() === "featured" || a.popular ? 1 : 0;
        const bF = b.tag?.toLowerCase() === "featured" || b.popular ? 1 : 0;
        return bF - aF;
      });
      break;
  }

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const toggleMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(prev => !prev);
  }, []);
  const closeMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(false);
  }, []);

  const filterSidebar = (
      <FilterSidebar
  onApplyFilters={handleApplyFilters}
  products={products}
  defaultFilters={appliedFilters}
/>
  );

 if (loading) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
      {/* Sidebar Skeleton for large screens */}
      <aside className="hidden lg:block w-full lg:w-1/4">
        <SkeletonLoader type="filter-sidebar" />
      </aside>

      {/* Product Card Skeletons */}
      <main className="w-full lg:w-3/4 grid grid-cols-2 md:grid-cols-3 gap-4">
        <SkeletonLoader type="card" count={12} />
      </main>
    </div>
  );
}


  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {filteredProducts.length > 0
              ? `Search results for "${query}" (${filteredProducts.length})`
              : "No Products Found"}
          </h1>
          <button
            onClick={toggleMobileFilter}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
          >
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white text-black rounded-full text-sm">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-full lg:w-1/4">{filterSidebar}</aside>

          <main className="w-full lg:w-3/4">
            <div className="hidden lg:flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">
                {filteredProducts.length > 0
                  ? `Search results for "${query}" (${filteredProducts.length})`
                  : "No Products Found"}
              </h1>
              <SortSelect sort={sort} />
            </div>

            <div className="lg:hidden mb-4">
              <SortSelect sort={sort} />
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products match your selected filters.</p>
                <Button className="mt-4" onClick={() => setAppliedFilters({})}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 lg:hidden">
                  {paginatedProducts.map(product => (
                    <div key={product.id} className="aspect-square">
                      <ProductCard product={product} compact={true} />
                    </div>
                  ))}
                </div>
                <div className="hidden lg:grid grid-cols-3 gap-6">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <span className="px-4">Page {page} of {totalPages}</span>
                <Button
                  variant="outline"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={closeMobileFilter}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-[320px] md:w-[380px] z-50 transform transition-transform duration-300 ease-in-out
          ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white/80 backdrop-blur-md shadow-lg`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={closeMobileFilter} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">{filterSidebar}</div>
      </aside>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SkeletonLoader type="product-card" />}>
      <SearchPageContent />
    </Suspense>
  );
}
