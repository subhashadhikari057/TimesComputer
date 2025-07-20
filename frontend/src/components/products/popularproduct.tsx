"use client";

import ProductCard from "./productcard";
import { Product } from "../../../types/product";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getAllProducts } from "@/api/product";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function PopularProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const initialCount = isMobile ? 4 : 8;
  const stepCount = 4;
  const [visibleCount, setVisibleCount] = useState(initialCount);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProducts();
        // Filter only published products
        const publishedProducts = Array.isArray(data) ? data.filter((product: any) => product.isPublished) : [];
        
        // Sort products by view count (most viewed first)
        const sortedByViews = publishedProducts.sort((a: any, b: any) => {
          const viewsA = a.views || a.viewCount || 0;
          const viewsB = b.views || b.viewCount || 0;
          return viewsB - viewsA; // Descending order (highest views first)
        });
        
        setProducts(sortedByViews);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Reset visible count when screen size changes
    setVisibleCount(isMobile ? 4 : 8);
  }, [isMobile]);

  const handleViewToggle = () => {
    if (visibleCount >= products.length) {
      // Reset to initial view
      setVisibleCount(initialCount);
    } else {
      // Show more
      setVisibleCount((prev) => Math.min(prev + stepCount, products.length));
    }
  };

  const isFullyExpanded = visibleCount >= products.length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Popular Products</h2>
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Popular Products</h2>
        <div className="text-center py-8 text-gray-500">
          {error}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Popular Products</h2>
        <div className="text-center py-8 text-gray-500">
          No products available
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:py-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Popular Products</h2>

      <div
        className={`
        grid gap-y-4
        gap-x-0
        grid-cols-2
        sm:grid-cols-2
        md:grid-cols-4
      `}
      >
        {products.slice(0, visibleCount).map((product) => (
          <div key={product.id} className="w-full">
          <ProductCard product={product} />
        </div>
        ))}
      </div>

      {products.length > initialCount && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleViewToggle}
            className="text-primary font-semibold hover:underline"
          >
            {isFullyExpanded ? "View Less" : "View More"}
          </Button>
        </div>
      )}
    </div>
  );
}

export { PopularProductsSection };
