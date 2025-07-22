'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SortSelect from '@/components/common/sortselect';
import ProductCard from '@/components/products/productcard';
import FilterSidebar from '@/components/sidebar/sidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getAllProducts } from '@/api/product';
import SkeletonLoader from '@/components/common/skeletonloader';

interface BrandParams {
  brandName: string;
}

interface SearchParams {
  sort?: string;
  page?: string;
}

interface BrandPageProps {
  params: Promise<BrandParams>;
  searchParams?: SearchParams;
}

interface Product {
  id: string | number;
  title: string;
  price: number;
  brand?: {
    name: string;
  } | string;
  specs?: Record<string, string>;
  processor?: string;
  memory?: string;
  connectivity?: string;
  switchType?: string;
  graphics?: string;
  screenSize?: string;
  resolution?: string;
  tag?: string;
  popular?: boolean;
}

interface AppliedFilters {
  brand?: string[];
  processor?: string[];
  memory?: string[];
  connectivity?: string[];
  switchType?: string[];
  graphics?: string[];
  screenSize?: string[];
  resolution?: string[];
  priceRange?: [number, number];
  [key: string]: string[] | [number, number] | undefined;
}

function normalize(str: string) {
  return str?.toLowerCase().trim();
}

export default function BrandPage({ params }: BrandPageProps) {
  const PRODUCTS_PER_PAGE = 12;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam) : 1;
  const sort = searchParams.get('sort') || undefined;

  const resolvedParams = React.use(params) as BrandParams;
  const brandSlug = normalize(resolvedParams.brandName);
  const brandName = brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({ brand: [brandName] });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        setAppliedFilters({ brand: [brandName] });
      } catch (error) {
        console.error('Failed to fetch products', error);
        toast.error('Error fetching brand products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandSlug, brandName]);

  useEffect(() => {
    let count = 0;
    for (const key in appliedFilters) {
      const filterKey = key as keyof AppliedFilters;
      const filterValue = appliedFilters[filterKey];
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        count += filterValue.length;
      }
      if (key === 'priceRange') count += 1;
    }
    setActiveFiltersCount(count);
  }, [appliedFilters]);

  const handleApplyFilters = (filters: AppliedFilters) => {
    setAppliedFilters(filters);
    if (page !== 1) goToPage(1);
  };

  const filteredProducts = products.filter((product: Product) => {
    const specs = product.specs || {};
    
    const brandValue = typeof product.brand === 'object' ? product.brand?.name : product.brand;
    const brandFilter = appliedFilters.brand;
    const brandMatch = !brandFilter || brandFilter.length === 0 || brandFilter.includes(brandValue || '');

    const processorValue = product.processor || specs.Processor;
    const processorFilter = appliedFilters.processor;
    const processorMatch = !processorFilter || processorFilter.length === 0 || processorFilter.includes(processorValue || '');

    const memoryValue = product.memory || specs.Memory;
    const memoryFilter = appliedFilters.memory;
    const memoryMatch = !memoryFilter || memoryFilter.length === 0 || memoryFilter.includes(memoryValue || '');

    const connectivityValue = product.connectivity || specs.Connectivity;
    const connectivityFilter = appliedFilters.connectivity;
    const connectivityMatch = !connectivityFilter || connectivityFilter.length === 0 || connectivityFilter.includes(connectivityValue || '');

    const switchTypeValue = product.switchType || specs.SwitchType;
    const switchTypeFilter = appliedFilters.switchType;
    const switchTypeMatch = !switchTypeFilter || switchTypeFilter.length === 0 || switchTypeFilter.includes(switchTypeValue || '');

    const graphicsValue = product.graphics || specs.Graphics;
    const graphicsFilter = appliedFilters.graphics;
    const graphicsMatch = !graphicsFilter || graphicsFilter.length === 0 || graphicsFilter.includes(graphicsValue || '');

    const screenSizeValue = product.screenSize || specs['Screen Size'];
    const screenSizeFilter = appliedFilters.screenSize;
    const screenSizeMatch = !screenSizeFilter || screenSizeFilter.length === 0 || screenSizeFilter.includes(screenSizeValue || '');

    const resolutionValue = product.resolution || specs.Resolution;
    const resolutionFilter = appliedFilters.resolution;
    const resolutionMatch = !resolutionFilter || resolutionFilter.length === 0 || resolutionFilter.includes(resolutionValue || '');

    const priceMatch = !appliedFilters.priceRange ||
      (product.price >= appliedFilters.priceRange[0] && product.price <= appliedFilters.priceRange[1]);

    return brandMatch && processorMatch && memoryMatch && connectivityMatch && 
           switchTypeMatch && graphicsMatch && screenSizeMatch && resolutionMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts];
  if (sort === 'price-low-high') sortedProducts.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high-low') sortedProducts.sort((a, b) => b.price - a.price);
  else if (sort === 'product-name-a-z') sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'product-name-z-a') sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
  else if (sort === 'featured') sortedProducts.sort((a, b) => {
    const aFeatured = a.tag?.toLowerCase() === 'featured' || a.popular ? 1 : 0;
    const bFeatured = b.tag?.toLowerCase() === 'featured' || b.popular ? 1 : 0;
    return bFeatured - aFeatured;
  });

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(start, end);
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  const goToPage = (newPage: number) => {
    router.push(`?page=${newPage}${sort ? `&sort=${sort}` : ''}`);
  };

  const toggleMobileFilter = useCallback(() => setIsMobileFilterOpen(prev => !prev), []);
  const closeMobileFilter = useCallback(() => setIsMobileFilterOpen(false), []);

  const filterSidebar = (
    <FilterSidebar
      onApplyFilters={handleApplyFilters}
      brandName={brandSlug}
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
        {/* Mobile Top Header */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {loading
              ? 'Loading products...'
              : filteredProducts.length > 0
              ? `${brandName} Products (${filteredProducts.length})`
              : 'No Products Found'}
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
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-full lg:w-1/4">
            {loading ? <SkeletonLoader type="filter-sidebar" /> : filterSidebar}
          </aside>

          {/* Main Section */}
          <main className="w-full lg:w-3/4">
            <div className="hidden lg:flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold pl-5">
                {loading
                  ? 'Loading...'
                  : filteredProducts.length > 0
                  ? `${brandName} Products (${filteredProducts.length})`
                  : 'No Products Found'}
              </h1>
              <SortSelect sort={sort} />
            </div>

            <div className="lg:hidden mb-4">
              <SortSelect sort={sort} />
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonLoader type="card" count={6} dynamicHeight />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products match your selected filters.</p>
                <Button className="mt-4" onClick={() => setAppliedFilters({ brand: [brandName] })}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 lg:hidden">
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="aspect-square">
                      <ProductCard product={product as any} compact />
                    </div>
                  ))}
                </div>
                <div className="hidden lg:grid grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
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

      {/* Mobile Sidebar Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300" onClick={closeMobileFilter} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-[320px] md:w-[380px] z-50 transform transition-transform duration-300 ease-in-out
          ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-white/80 backdrop-blur-md shadow-lg`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={closeMobileFilter} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          {loading ? <SkeletonLoader type="filter-sidebar" /> : filterSidebar}
        </div>
      </aside>
    </>
  );
}
