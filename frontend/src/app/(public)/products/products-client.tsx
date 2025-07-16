'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllProducts } from '@/lib/getproducts';
import SortSelect from '@/components/sortselect';
import ProductCard from '@/components/products/productcard';
import FilterSidebar from '@/components/sidebar/sidebar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import MobileFilterButton from '@/components/common/MobileFilterButton';
import MobileFilterDrawer from '@/components/common/MobileFilterDrawer';

interface ProductsClientPageProps {
  initialSort: string | undefined;
  initialPage: number;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductsClientPage({ 
  initialSort, 
  initialPage,
  searchParams 
}: ProductsClientPageProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Get initial filters from URL params
  useEffect(() => {
    const initialFilters: any = {};
    urlSearchParams.forEach((value, key) => {
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
  }, [urlSearchParams]);

  // Fetch products when filters, sort, or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Convert filters to the format expected by getAllProducts
        const filters: any = {};
        
        // Handle price range
        if (appliedFilters.priceRange) {
          filters.priceRange = appliedFilters.priceRange;
        }

        // Handle brand filter
        if (appliedFilters.brand && appliedFilters.brand.length > 0) {
          filters.brands = appliedFilters.brand;
        }

        // Handle category filter
        if (appliedFilters.type && appliedFilters.type.length > 0) {
          filters.categories = appliedFilters.type.map((type: string) => 
            type.toLowerCase() === 'gaming' ? 'gaming-laptop' :
            type.toLowerCase() === 'business' ? 'business-laptop' :
            type.toLowerCase() === 'student' ? 'student-laptop' : type
          );
        }

        // Handle other filters
        ['processor', 'memory', 'storage', 'graphics', 'os'].forEach(key => {
          if (appliedFilters[key] && appliedFilters[key].length > 0) {
            filters[key] = appliedFilters[key];
          }
        });

        const fetchedProducts = await getAllProducts(initialSort || 'featured', initialPage, 15, filters);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [initialSort, initialPage, appliedFilters]);

  const handleApplyFilters = (filterData: any) => {
    const { filters, priceRange } = filterData;
    
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
    if (initialSort) newParams.set('sort', initialSort);
    
    // Reset to page 1 when filters change
    newParams.set('page', '1');

    // Update the URL and state
    router.push(`?${newParams.toString()}`);
    setAppliedFilters({ ...filters, priceRange });
    setIsMobileFilterOpen(false); // Close mobile filter after applying
  };

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

  // Get only first 9 products for mobile view
  const mobileProducts = products.slice(0, 9);

  if (loading) {
    return <LoadingSpinner />;
  }

  const filterSidebar = (
    <FilterSidebar 
      initialFilters={appliedFilters}
      onApplyFilters={handleApplyFilters}
      category="all"
      loading={loading}
    />
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-full md:w-1/4">
            {filterSidebar}
          </aside>

          {/* Main content */}
          <main className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold pl-5">
                {products.length > 0 ? 'All Products' : 'No Products Found'}
              </h1>
              <SortSelect sort={initialSort} />
            </div>

            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products match your selected filters.</p>
                <button
                  onClick={() => handleApplyFilters({ filters: {}, priceRange: { min: 25000, max: 500000 } })}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* Mobile view - 3x3 grid (9 products) */}
                <div className="md:hidden grid grid-cols-3 gap-3">
                  {mobileProducts.map((product) => (
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

                {/* Desktop view - normal grid */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* Pagination */}
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      const newParams = new URLSearchParams(urlSearchParams.toString());
                      newParams.set('page', Math.max(initialPage - 1, 1).toString());
                      router.push(`?${newParams.toString()}`);
                    }}
                    disabled={initialPage === 1}
                    className={`px-4 py-2 border rounded ${
                      initialPage === 1 ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100'
                    }`}
                  >
                    Prev
                  </button>
                  <span className="px-4 py-2 border rounded bg-black text-white">{initialPage}</span>
                  <button
                    onClick={() => {
                      const newParams = new URLSearchParams(urlSearchParams.toString());
                      newParams.set('page', (initialPage + 1).toString());
                      router.push(`?${newParams.toString()}`);
                    }}
                    disabled={products.length < 15}
                    className={`px-4 py-2 border rounded ${
                      products.length < 15 ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <MobileFilterButton 
        activeFiltersCount={activeFiltersCount}
        onClick={() => setIsMobileFilterOpen(true)}
      />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      >
        {filterSidebar}
      </MobileFilterDrawer>
    </>
  );
} 