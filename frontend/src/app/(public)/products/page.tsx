'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SortSelect from '@/components/common/sortselect';
import ProductCard from '@/components/products/productcard';
import FilterSidebar from '@/components/sidebar/sidebar';
import { Button } from '@/components/ui/button';
import { getAllProducts } from '@/api/product';
import { Product } from '../../../../types/product';
import { Filters } from '../../../../types/filtewr';

import SkeletonLoader from '@/components/common/skeletonloader';


const PRODUCTS_PER_PAGE = 12;

function AllProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam) : 1;
  const sort = searchParams.get('sort') || undefined;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Filters>({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        const published = Array.isArray(data) ? data.filter(p => p.isPublished) : [];
        setProducts(published);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let count = 0;
    for (const key in appliedFilters) {
      if (Array.isArray(appliedFilters[key]) && appliedFilters[key].length > 0) {
        count += appliedFilters[key].length;
      }
      if (key === 'priceRange') count += 1;
    }
    setActiveFiltersCount(count);
  }, [appliedFilters]);

  const handleApplyFilters = (filters: Filters) => {
    setAppliedFilters(filters);
    if (page !== 1) goToPage(1);
  };

  const filteredProducts = products.filter(product => {
    const specs = product.specs || {};

    if (appliedFilters.brand && appliedFilters.brand.length > 0) {
      const brand = typeof product.brand === 'object' && product.brand !== null 
        ? (product.brand as { name: string }).name 
        : product.brand || specs.Brand;
      if (!brand || !appliedFilters.brand.includes(brand)) return false;
    }

    if (appliedFilters.category && appliedFilters.category.length > 0) {
      const category = typeof product.category === 'object' && product.category !== null 
        ? (product.category as { name: string }).name 
        : product.category || specs.Category;
      if (!category || !appliedFilters.category.includes(category)) return false;
    }

    if (appliedFilters.priceRange && product.price) {
      const [min, max] = appliedFilters.priceRange;
      if (product.price < min || product.price > max) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts];
  if (sort === 'price-low-high') sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sort === 'price-high-low') sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sort === 'product-name-a-z') {
    sortedProducts.sort((a, b) => {
      const nameA = a.name || a.title || '';
      const nameB = b.name || b.title || '';
      return nameA.localeCompare(nameB);
    });
  } else if (sort === 'product-name-z-a') {
    sortedProducts.sort((a, b) => {
      const nameA = a.name || a.title || '';
      const nameB = b.name || b.title || '';
      return nameB.localeCompare(nameA);
    });
  } else if (sort === 'featured') {
    sortedProducts.sort((a, b) => {
      const aFeatured = a.tag?.toLowerCase() === 'featured' || a.popular ? 1 : 0;
      const bFeatured = b.tag?.toLowerCase() === 'featured' || b.popular ? 1 : 0;
      return bFeatured - aFeatured;
    });
  }

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(start, end);
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  const goToPage = (newPage: number) => {
    router.push(`?page=${newPage}${sort ? `&sort=${sort}` : ''}`);
  };

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
        <div className="lg:hidden flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {filteredProducts.length > 0
              ? `All Products (${filteredProducts.length})`
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
          <aside className="hidden lg:block w-full lg:w-1/4">{filterSidebar}</aside>

          <main className="w-full lg:w-3/4">
            <div className="hidden lg:flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold pl-5">
                {filteredProducts.length > 0
                  ? `All Products (${filteredProducts.length})`
                  : "No Products Found"}
              </h1>
              <SortSelect sort={sort} />
            </div>

            <div className="lg:hidden mb-4">
              <SortSelect sort={sort} />
            </div>

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
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="aspect-square">
                      <ProductCard product={product} compact />
                    </div>
                  ))}
                </div>
                <div className="hidden lg:grid grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button variant="outline" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {totalPages}
                </span>
                <Button variant="outline" onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
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
          <button
            onClick={closeMobileFilter}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          {filterSidebar}
        </div>
      </aside>
    </>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense fallback={<SkeletonLoader type="product-card" />}>
      <AllProductsPageContent />
    </Suspense>
  );
}