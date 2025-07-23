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

// Local type for filtering to handle API response structure
interface FilterProduct {
  name?: string;
  price?: number;
  isPublished?: boolean;
  brand?: string | { name: string };
  category?: string | { name: string };
}

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
        console.log('🔍 About to call API...');
        console.log('🔍 API Base URL:', process.env.NEXT_PUBLIC_API_URL);
        
        const data = await getAllProducts();
        console.log('🔍 API CALL SUCCESS');
        console.log('🔍 FULL API RESPONSE:', data);
        console.log('🔍 Type of data:', typeof data);
        console.log('🔍 Is array:', Array.isArray(data));
        console.log('🔍 Data keys (if object):', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
        console.log('🔍 Data length:', data?.length);
        console.log('🔍 First item:', data?.[0]);
        
        // Try to extract products from different possible structures
        let products = [];
        if (Array.isArray(data)) {
          products = data;
          console.log('✅ Using data directly as array');
        } else if (data && data.data && Array.isArray(data.data)) {
          products = data.data;
          console.log('✅ Using data.data array');
        } else if (data && data.products && Array.isArray(data.products)) {
          products = data.products;
          console.log('✅ Using data.products array');
        } else {
          console.log('❌ Could not find products array in response');
          products = [];
        }
        
        console.log('🔍 Extracted products count:', products.length);
        console.log('🔍 First product example:', products[0]);
        
        const publishedProducts = products.filter((p: FilterProduct) => p.isPublished === true);
        console.log('✅ Published products:', publishedProducts.length);
        setProducts(publishedProducts);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
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
    console.log('🔍 Applying Filters:', filters);
    setAppliedFilters(filters);
    if (page !== 1) goToPage(1);
  };

  const handleResetFilters = () => {
    console.log('🔄 Resetting Filters');
    setAppliedFilters({});
    if (page !== 1) goToPage(1);
  };

  const filteredProducts = products.filter(product => {
    // Helper function to safely extract brand name
    const getBrandName = (product: FilterProduct): string | null => {
      if (!product.brand) return null;
      if (typeof product.brand === 'string') return product.brand;
      if (typeof product.brand === 'object' && product.brand.name) return product.brand.name;
      return null;
    };

    // Helper function to safely extract category name
    const getCategoryName = (product: FilterProduct): string | null => {
      if (!product.category) return null;
      if (typeof product.category === 'string') return product.category;
      if (typeof product.category === 'object' && product.category.name) return product.category.name;
      return null;
    };

    // BRAND FILTER: Only apply if brands are selected
    const hasActiveBrandFilter = appliedFilters.brand && Array.isArray(appliedFilters.brand) && appliedFilters.brand.length > 0;
    if (hasActiveBrandFilter) {
      const productBrand = getBrandName(product);
      if (!productBrand) {
        console.log('❌ Product has no brand:', product.name);
        return false; // Exclude products without brand when brand filter is active
      }
      if (!appliedFilters.brand!.includes(productBrand)) {
        return false; // Exclude products that don't match selected brands
      }
    }

    // CATEGORY FILTER: Only apply if categories are selected
    const hasActiveCategoryFilter = appliedFilters.category && Array.isArray(appliedFilters.category) && appliedFilters.category.length > 0;
    if (hasActiveCategoryFilter) {
      const productCategory = getCategoryName(product);
      if (!productCategory) {
        console.log('❌ Product has no category:', product.name);
        return false; // Exclude products without category when category filter is active
      }
      if (!appliedFilters.category!.includes(productCategory)) {
        return false; // Exclude products that don't match selected categories
      }
    }

    // PRICE FILTER: Only apply if price range is set
    const hasActivePriceFilter = appliedFilters.priceRange && 
      Array.isArray(appliedFilters.priceRange) && 
      appliedFilters.priceRange.length === 2 &&
      appliedFilters.priceRange[0] !== undefined && 
      appliedFilters.priceRange[1] !== undefined;
    
    if (hasActivePriceFilter) {
      if (!product.price || typeof product.price !== 'number') {
        console.log('❌ Product has invalid price:', product.name, product.price);
        return false; // Exclude products without valid price when price filter is active
      }
      const [minPrice, maxPrice] = appliedFilters.priceRange!;
      if (product.price < minPrice || product.price > maxPrice) {
        return false; // Exclude products outside price range
      }
    }

    // If no filters are active OR product passes all active filters, include it
    return true;
  });

  // Enhanced debugging for filter state
  const hasAnyActiveFilters = (
    (appliedFilters.brand && appliedFilters.brand.length > 0) ||
    (appliedFilters.category && appliedFilters.category.length > 0) ||
    (appliedFilters.priceRange && appliedFilters.priceRange.length === 2)
  );

  console.log('✅ Filter Debug Info:', {
    totalProducts: products.length,
    filteredProducts: filteredProducts.length,
    hasAnyActiveFilters: hasAnyActiveFilters,
    appliedFilters: appliedFilters,
    filterBreakdown: {
      brandFilter: appliedFilters.brand || [],
      categoryFilter: appliedFilters.category || [],
      priceFilter: appliedFilters.priceRange || null,
    },
    productSample: products.slice(0, 3).map((p: FilterProduct) => ({
      name: p.name,
      brand: typeof p.brand === 'object' ? p.brand?.name : p.brand,
      category: typeof p.category === 'object' ? p.category?.name : p.category,
      price: p.price
    }))
  });

  // Log which products are being excluded and why
  if (hasAnyActiveFilters && filteredProducts.length < products.length) {
    const excludedProducts = products.filter(p => !filteredProducts.includes(p));
    console.log('🚫 Excluded Products:', excludedProducts.map((p: FilterProduct) => ({
      name: p.name,
      brand: typeof p.brand === 'object' ? p.brand?.name : p.brand,
      category: typeof p.category === 'object' ? p.category?.name : p.category,
      reason: 'Check filter logic above'
    })));
  }

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
                <Button className="mt-4" onClick={handleResetFilters}>
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