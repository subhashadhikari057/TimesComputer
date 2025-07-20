"use client"

import ProductCard from "./productcard";
import { Product } from "../../../types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function FeaturedProductsSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [api, setApi] = useState<any>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

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
      category: "Laptops",
      brand: "Apple"
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
      category: undefined,
      brand: "Apple"
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
      category: undefined,
      brand: "Apple"
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
      category: undefined,
      brand: "Apple"
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
      category: undefined,
      brand: "Apple"
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
      category: undefined,
      brand: "Apple"
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
      category: undefined,
      brand: "Apple"
    },
  ];

  useEffect(() => {
    if (!api) return;

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    api.on("select", updateScrollState);
    api.on("reInit", updateScrollState);
    updateScrollState();

    return () => {
      api.off("select", updateScrollState);
      api.off("reInit", updateScrollState);
    };
  }, [api]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Featured Products</h2>

      <div className="relative group">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            slidesToScroll: isMobile ? 1 : 4,
            dragFree: isMobile, // Smoother dragging on mobile
          }}
          className="w-full"
        >
          {/* Desktop Navigation (always visible) */}
          {!isMobile && (
            <>
              <CarouselPrevious className="hidden sm:flex absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-10 w-10" />
              <CarouselNext className="hidden sm:flex absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-10 w-10" />
            </>
          )}

          <CarouselContent className="-ml-1">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-1 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="p-1 h-full">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Mobile Navigation (conditional) */}
          {isMobile && (
            <div className="absolute inset-0 pointer-events-none">
              <button
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-8 w-8 rounded-full flex items-center justify-center pointer-events-auto transition-opacity duration-200 ${
                  canScrollPrev ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => api.scrollPrev()}
                disabled={!canScrollPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-8 w-8 rounded-full flex items-center justify-center pointer-events-auto transition-opacity duration-200 ${
                  canScrollNext ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => api.scrollNext()}
                disabled={!canScrollNext}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </Carousel>

        {/* Mobile Progress Indicators */}
        {isMobile && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: products.length }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  api?.selectedScrollSnap() === index
                    ? "bg-primary w-4"
                    : "bg-gray-300"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { FeaturedProductsSection };