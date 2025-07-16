'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllProducts } from '@/lib/getproducts';
import SortSelect from '@/components/sortselect';
import ProductCard from '@/components/products/productcard';
import FilterSidebar from '@/components/sidebar/sidebar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import MobileFilterButton from '@/components/common/MobileFilterButton';
import MobileFilterDrawer from '@/components/common/MobileFilterDrawer';

interface BrandParams {
  brandSlug: string;
}

interface SearchParams {
  sort?: string;
  page?: string;
}

interface BrandPageProps {
  params: Promise<BrandParams>;
  searchParams: SearchParams;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Brand name mapping to handle special cases
function getBrandName(slug: string): string {
  const brandMapping: { [key: string]: string } = {
    'hp': 'HP',
    'asus': 'ASUS', 
    'dell': 'Dell',
    'apple': 'Apple',
    'lenovo': 'Lenovo',
    'acer': 'Acer',
    'microsoft': 'Microsoft',
  };
  
  return brandMapping[slug.toLowerCase()] || capitalize(slug);
}

export default function BrandPage({ params }: BrandPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [pendingFilters, setPendingFilters] = useState<any>(null);

  const resolvedParams = React.use(params);
  const brand = resolvedParams.brandSlug;
  
  // Get proper brand name (handles HP, ASUS, etc.)
  const properBrandName = getBrandName(brand);
  
  const sort = searchParams.get('sort') || undefined;
  const page = parseInt(searchParams.get('page') || '1');

  // Get initial filters from URL params (ADDED - was missing)
  useEffect(() => {
    const initialFilters: any = {};
    searchParams.forEach((value, key) => {
      if (key !== 'sort' && key !== 'page') {
        if (key === 'minPrice' || key === 'maxPrice') {
          initialFilters.priceRange = initialFilters.priceRange || {};
          initialFilters.priceRange[key === 'minPrice' ? 'min' : 'max'] = parseInt(value);
        } else {
          initialFilters[key] = value.split(',');
        }
      }
    });
    setAppliedFilters(initialFilters);
  }, [searchParams]);

  // Fetch products when filters, sort, or page changes (FIXED)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('Fetching products for brand:', properBrandName); // Debug log
        console.log('Applied filters:', appliedFilters); // Debug log
        
        // Create filters object like category page does
        const filters: any = {
          brands: [properBrandName] // Use proper brand name (HP, ASUS, etc.)
        };
        
        // Handle price range
        if (appliedFilters.priceRange) {
          filters.priceRange = appliedFilters.priceRange;
        }

        // Handle other filters
        ['type', 'processor', 'memory', 'storage', 'graphics', 'os'].forEach(key => {
          if (appliedFilters[key] && appliedFilters[key].length > 0) {
            filters[key] = appliedFilters[key];
          }
        });
        
        console.log('Final filters being sent:', filters); // Debug log
        
        const fetchedProducts = await getAllProducts(sort || 'featured', page, 15, filters);
        
        console.log('Fetched products:', fetchedProducts); // Debug log
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [properBrandName, sort, page, appliedFilters]);

  // Handler for immediate filter changes (no URL update)
  const handleFiltersChange = useCallback((filterData: any) => {
    const { filters, priceRange } = filterData;
    // Only update local state, don't navigate
    setAppliedFilters({ ...filters, priceRange });
  }, []);

  // Handler for applying filters (with URL update)
  const handleApplyFilters = useCallback((filterData: any) => {
    const { filters, priceRange } = filterData;
    
    // Set pending filters to trigger URL update in useEffect
    setPendingFilters({ filters, priceRange });
    
    // Update local state immediately
    setAppliedFilters({ ...filters, priceRange });
    setIsMobileFilterOpen(false);
  }, []);

  // Use useEffect to handle URL updates
  useEffect(() => {
    if (pendingFilters) {
      const { filters, priceRange } = pendingFilters;
      
      // Construct the new query parameters
      const newParams = new URLSearchParams();
      
      // Add filter parameters
      Object.entries(filters).forEach(([key, values]: [string, any]) => {
        if (Array.isArray(values) && values.length > 0) {
          newParams.set(key, values.join(','));
        }
      });

      // Add price range if changed
      if (priceRange) {
        newParams.set('minPrice', priceRange.min.toString());
        newParams.set('maxPrice', priceRange.max.toString());
      }

      // Keep existing sort if present
      if (sort) newParams.set('sort', sort);
      
      // Reset to page 1 when filters change
      newParams.set('page', '1');

      // Update the URL
      router.push(`?${newParams.toString()}`);
      
      // Clear pending filters
      setPendingFilters(null);
    }
  }, [pendingFilters, sort, router]);

  // Memoized clear filters handler
  const handleClearFilters = useCallback(() => {
    handleApplyFilters({ filters: {}, priceRange: { min: 25000, max: 500000 } });
  }, [handleApplyFilters]);

  // Memoized pagination handlers
  const handlePrevPage = useCallback(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', Math.max(page - 1, 1).toString());
    router.push(`?${newParams.toString()}`);
  }, [page, router, searchParams]);

  const handleNextPage = useCallback(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', (page + 1).toString());
    router.push(`?${newParams.toString()}`);
  }, [page, router, searchParams]);

  // Memoized mobile filter toggle
  const toggleMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(prev => !prev);
  }, []);

  const closeMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(false);
  }, []);

  // Track active filters count
  useEffect(() => {
    let count = 0;
    Object.entries(appliedFilters).forEach(([key, values]) => {
      if (key === 'priceRange') {
        count += 1;
      } else if (Array.isArray(values)) {
        count += values.length;
      }
    });
    setActiveFiltersCount(count);
  }, [appliedFilters]);

  const brandName = properBrandName; // Already properly formatted

  if (loading) {
    return <LoadingSpinner />;
  }

  const filterSidebar = (
    <FilterSidebar 
      initialFilters={appliedFilters}
      onApplyFilters={handleApplyFilters}      // For apply button clicks
      onFiltersChange={handleFiltersChange}    // For immediate filter changes (no URL update)
      brand={properBrandName}                  // Use proper brand name
      loading={loading}
    />
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8"> 
        {/* Mobile/Tablet Filter Header */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {products.length > 0 ? `${brandName} Products` : 'No Products Found'}
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
                {products.length > 0 ? `${brandName} Products` : 'No Products Found'}
              </h1>
              <SortSelect sort={sort} />
            </div>

            {/* Mobile/Tablet Sort Select */}
            <div className="lg:hidden mb-4">
              <SortSelect sort={sort} />
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products match your selected filters.</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* Mobile/Tablet view - 3 columns grid */}
                <div className="grid grid-cols-3 gap-2 lg:hidden">
                  {products.map(product => (
                    <div key={product.id} className="aspect-square">
                      <ProductCard
                        product={{
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          currency: product.currency,
                          image: product.image,
                          rating: product.rating,
                          reviews: product.reviews,
                          tag: product.tag,
                          category: product.category,
                          brand: product.brand,
                        }}
                        compact={true}
                      />
                    </div>
                  ))}
                </div>

                {/* Desktop view */}
                <div className="hidden lg:grid grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        currency: product.currency,
                        image: product.image,
                        rating: product.rating,
                        reviews: product.reviews,
                        tag: product.tag,
                        category: product.category,
                        brand: product.brand,
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={handlePrevPage}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={page <= 1}
              >
                Prev
              </button>
              <span className="px-4 py-2 border rounded bg-black text-white">
                {page}
              </span>
              <button
                onClick={handleNextPage}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Next
              </button>
            </div>
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