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

function FeaturedProductsSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const products: Product[] = [
    {
      id: 1,
      image: '/products/Frame 68.png',
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: '1,49,000',
      currency: 'Rs',
      tag: "best seller",
      category: "Laptops"
    },
    {
      id: 2,
      image: '/products/Frame 134.png',
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: '1,49,000',
      currency: 'Rs',
      tag: "new",
      category: undefined
    },
    {
      id: 3,
      image: '/products/Frame 135.png',
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: '1,49,000',
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
    {
      id: 4,
      image: '/products/Frame 136.png',
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: '1,49,000',
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
    {
      id: 5,
      image: '/products/Frame 136.png',
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: '1,49,000',
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
    {
      id: 6,
      image: '/products/Frame 136.png',
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: '1,49,000',
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
    {
      id: 7,
      image: '/products/Frame 136.png',
      rating: 4.5,
      reviews: 200,
      title: 'Apple 2024 MacBook Pro (16-inch)',
      price: '1,49,000',
      currency: 'Rs',
      tag: undefined,
      category: undefined
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Featured Products</h2>

      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: isMobile ? 1 : 4,
          }}
          className="w-full"
        >
          {/* Navigation buttons must be INSIDE the Carousel component */}
          <CarouselPrevious className="hidden sm:flex absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-10 w-10" />

          <CarouselContent className="-ml-1">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-1 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselNext className="hidden sm:flex absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-10 w-10" />
        </Carousel>
      </div>
    </div>
  );
}

export { FeaturedProductsSection };