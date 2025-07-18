'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SortSelect from '@/components/sortselect';
import { products } from '@/lib/index';
import ProductCard from '@/components/products/productcard';
import FilterSidebar from '@/components/sidebar/sidebar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';

interface CategoryParams {
  categoryName: string;
}

interface SearchParams {
  sort?: string;
  page?: string;
}

interface CategoryPageProps {
  params: Promise<CategoryParams>;
  searchParams?: SearchParams;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const PRODUCTS_PER_PAGE = 12;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam) : 1;
  const sort = searchParams.get('sort') || undefined;

  const resolvedParams = React.use(params) as CategoryParams;
  const categoryName = decodeURIComponent(resolvedParams.categoryName.toLowerCase());

  const [loading, setLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (appliedFilters.brand && appliedFilters.brand.length > 0) count += appliedFilters.brand.length;
    if (appliedFilters.processor && appliedFilters.processor.length > 0) count += appliedFilters.processor.length;
    if (appliedFilters.memory && appliedFilters.memory.length > 0) count += appliedFilters.memory.length;
    if (appliedFilters.connectivity && appliedFilters.connectivity.length > 0) count += appliedFilters.connectivity.length;
    if (appliedFilters.switchType && appliedFilters.switchType.length > 0) count += appliedFilters.switchType.length;
    if (appliedFilters.graphics && appliedFilters.graphics.length > 0) count += appliedFilters.graphics.length;
    if (appliedFilters.screenSize && appliedFilters.screenSize.length > 0) count += appliedFilters.screenSize.length;
    if (appliedFilters.resolution && appliedFilters.resolution.length > 0) count += appliedFilters.resolution.length;
    if (appliedFilters.priceRange) count += 1;
    setActiveFiltersCount(count);
  }, [appliedFilters]);

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    // Reset to first page when filters change
    if (page !== 1) {
      goToPage(1);
    }
  };

  const filteredProducts = products.filter(product => {
    // Category filter - handle exact match or normalize category names
    const productCategory = product.category?.toLowerCase();
    const filterCategory = categoryName.toLowerCase();
    
    if (productCategory !== filterCategory) {
      return false;
    }
    
    // Brand filter
    if (appliedFilters.brand && appliedFilters.brand.length > 0 && 
        !appliedFilters.brand.includes(product.brand)) {
      return false;
    }
    
    // Processor filter
    if (appliedFilters.processor && appliedFilters.processor.length > 0 && 
        product.processor && !appliedFilters.processor.includes(product.processor)) {
      return false;
    }
    
    // Memory filter
    if (appliedFilters.memory && appliedFilters.memory.length > 0 && 
        product.memory && !appliedFilters.memory.includes(product.memory)) {
      return false;
    }
    
    // Connectivity filter
    if (appliedFilters.connectivity && appliedFilters.connectivity.length > 0 && 
        product.connectivity && !appliedFilters.connectivity.includes(product.connectivity)) {
      return false;
    }
    
    // Switch type filter
    if (appliedFilters.switchType && appliedFilters.switchType.length > 0 && 
        product.switchType && !appliedFilters.switchType.includes(product.switchType)) {
      return false;
    }
    
    // Graphics filter
    if (appliedFilters.graphics && appliedFilters.graphics.length > 0 && 
        product.graphics && !appliedFilters.graphics.includes(product.graphics)) {
      return false;
    }
    
    // Screen size filter
    if (appliedFilters.screenSize && appliedFilters.screenSize.length > 0 && 
        product.screenSize && !appliedFilters.screenSize.includes(product.screenSize)) {
      return false;
    }
    
    // Resolution filter
    if (appliedFilters.resolution && appliedFilters.resolution.length > 0 && 
        product.resolution && !appliedFilters.resolution.includes(product.resolution)) {
      return false;
    }
    
    // Price filter
    if (appliedFilters.priceRange && 
        (product.price < appliedFilters.priceRange[0] || 
         product.price > appliedFilters.priceRange[1])) {
      return false;
    }
    
    return true;
  });

  // Sort products if needed
  const sortedProducts = [...filteredProducts];

  if (sort === 'price-low-high') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high-low') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'product-name-a-z') {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'product-name-z-a') {
    sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sort === 'featured') {
    sortedProducts.sort((a, b) => {
      const aFeatured = a.tag?.toLowerCase() === 'featured' ? 1 : 0;
      const bFeatured = b.tag?.toLowerCase() === 'featured' ? 1 : 0;
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
      category={categoryName}
    />
  );

  const CategoryName = capitalize(categoryName);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile/Tablet Filter Header */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {filteredProducts.length > 0 ? `${CategoryName} Products` : 'No Products Found'}
          </h1>
          <button
            onClick={toggleMobileFilter}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white text-black rounded-full text-sm">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-full lg:w-1/4">
            {filterSidebar}
          </aside>

          {/* Main content */}
          <main className="w-full lg:w-3/4">
            {/* Desktop Header */}
            <div className="hidden lg:flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold pl-5">
                {paginatedProducts.length > 0 ? `${CategoryName} Products (${filteredProducts.length})` : 'No Products Found'}
              </h1>
              <SortSelect sort={sort} />
            </div>

            {/* Mobile/Tablet Sort Select */}
            <div className="lg:hidden mb-4">
              <SortSelect sort={sort} />
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products match your selected filters.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setAppliedFilters({})}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Mobile/Tablet view - 2 columns grid */}
                <div className="grid grid-cols-2 gap-4 lg:hidden">
                  {paginatedProducts.map(product => (
                    <div key={product.id} className="aspect-square">
                      <ProductCard
                        product={product}
                        compact={true}
                      />
                    </div>
                  ))}
                </div>

                {/* Desktop view - 3 columns grid */}
                <div className="hidden lg:grid grid-cols-3 gap-6">
                  {paginatedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
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
                <span className="flex items-center px-4">
                  Page {page} of {totalPages}
                </span>
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

      {/* Mobile/Tablet Filter Drawer */}
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
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          {filterSidebar}
        </div>
      </aside>
    </>
  );
}