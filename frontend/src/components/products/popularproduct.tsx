"use client";

import ProductCard from "./productcard";
import { Product } from "../../../types/product";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

function PopularProductsSection() {
  const products: Product[] = [
    {
      id: 1,
      images: ['/products/Frame 68.png'],
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: 149000,
      currency: 'Rs',
      tag: "best seller",
      category: "Laptops"
    },
    {
      id: 2,
      images: ['/products/Frame 134.png'],
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: 149000,
      currency: 'Rs',
      tag: "new",
      category: undefined
    },
    {
      id: 3,
      images: ['/products/Frame 135.png'],
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: 149000,
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
    {
      id: 4,
      images: ['/products/Frame 136.png'],
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: 149000,
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
    {
      id: 5,
      images: ['/products/Frame 136.png'],
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: 149000,
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
    {
      id: 6,
      images: ['/products/Frame 136.png'],
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: 149000,
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
    {
      id: 7,
      images: ['/products/Frame 136.png'],
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: 149000,
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
    {
      id: 8,
      images: ['/products/Frame 136.png'],
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: 149000,
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
  ];

  const isMobile = useMediaQuery("(max-width: 768px)");
  const initialCount = isMobile ? 4 : 8;
  const stepCount = 4;
  const [visibleCount, setVisibleCount] = useState(initialCount);


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
