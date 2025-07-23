'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SortSelect from '@/components/common/sortselect';
import ProductCard from '@/components/products/productcard';
import FilterSidebar from '@/components/sidebar/sidebar';
import { Button } from '@/components/ui/button';
import { getAllProducts } from '@/api/product';
import { toast } from 'sonner';
import SkeletonLoader from '@/components/common/skeletonloader';

interface CategoryParams {
  categoryName: string;
}



interface CategoryPageProps {
  params: Promise<CategoryParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface Product {
  id: string | number;
  title: string;
  price: number;
  createdAt: string;
  category?: {
    name: string;
  } | string;
  brand?: {
    name: string;
  } | string;
  specs?: Record<string, string>;
  tag?: string;
  popular?: boolean;
}

interface AppliedFilters {
  category?: string[];
  brand?: string[];
  priceRange?: [number, number];
  [key: string]: string[] | [number, number] | undefined;
}

function normalize(str: string) {
  return str?.toLowerCase().trim();
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
  const categorySlug = normalize(resolvedParams.categoryName);
  const categoryName = capitalize(categorySlug);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({ category: [categoryName] });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const all = await getAllProducts();
      setProducts(all);

      // Updated: set initial filters based on category
      const isNew = normalize(categorySlug) === 'new';
      setAppliedFilters({
        category: isNew ? [] : [categoryName], // "New" doesn't filter by category explicitly
        brand: [],
        priceRange: undefined
      });
    } catch (error) {
      console.error('Error fetching category products:', error);
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [categorySlug, categoryName]);

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

    if (normalize(categoryName) === 'new') {
      // Filter ONLY by other selected filters (e.g. brand, priceRange)
      const brandValue = typeof product.brand === 'object' ? product.brand?.name : product.brand;
      const brandFilter = appliedFilters.brand;
      const brandMatch = !brandFilter || brandFilter.length === 0 || brandFilter.includes(brandValue || '');

      const priceMatch = !appliedFilters.priceRange ||
        (product.price >= appliedFilters.priceRange[0] && product.price <= appliedFilters.priceRange[1]);

      return brandMatch && priceMatch;
    }

    // For regular categories, filter by category, brand, and price
    const categoryValue = typeof product.category === 'object' ? product.category?.name : product.category || specs.Category;
    const categoryFilter = appliedFilters.category;
    const categoryMatch = !categoryFilter || categoryFilter.length === 0 || categoryFilter.includes(categoryValue || '');

    const brandValue = typeof product.brand === 'object' ? product.brand?.name : product.brand || specs.Brand;
    const brandFilter = appliedFilters.brand;
    const brandMatch = !brandFilter || brandFilter.length === 0 || brandFilter.includes(brandValue || '');

    const priceMatch = !appliedFilters.priceRange ||
      (product.price >= appliedFilters.priceRange[0] && product.price <= appliedFilters.priceRange[1]);

    return categoryMatch && brandMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts];

  if (normalize(categoryName) === 'new') {
    sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'price-low-high') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high-low') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'product-name-a-z') {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'product-name-z-a') {
    sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
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

  const toggleMobileFilter = useCallback(() => setIsMobileFilterOpen(prev => !prev), []);
  const closeMobileFilter = useCallback(() => setIsMobileFilterOpen(false), []);

  const filterSidebar = (
    <FilterSidebar
  onApplyFilters={handleApplyFilters}
  category={categorySlug}
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
              ? `${categoryName} Products (${filteredProducts.length})`
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
          <aside className="hidden lg:block w-full lg:w-1/4">{filterSidebar}</aside>
          <main className="w-full lg:w-3/4">
            <div className="hidden lg:flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold pl-5">
                {filteredProducts.length > 0
                  ? `${categoryName} Products (${filteredProducts.length})`
                  : 'No Products Found'}
              </h1>
              <SortSelect sort={sort} />
            </div>

            <div className="lg:hidden mb-4">
              <SortSelect sort={sort} />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products match your selected filters.</p>
                <Button className="mt-4" onClick={() => setAppliedFilters({ category: [categoryName] })}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 lg:hidden">
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="aspect-square">
                      <ProductCard product={product as unknown as import('@/../types/product').Product} compact />
                    </div>
                  ))}
                </div>
                <div className="hidden lg:grid grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product as unknown as import('@/../types/product').Product} />
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
          ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-white/80 backdrop-blur-md shadow-lg`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={closeMobileFilter} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">{filterSidebar}</div>
      </aside>
    </>
  );
}
