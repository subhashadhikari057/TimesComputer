import ProductCard from "./productcard";
import { Product } from "../../../types/product";
import Carousel, { CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../banner/bannerSlider";

function FeaturedProductsSection() {
    const products: Product[] = [
      {
        id: 1,
        image: '/products/Frame 68.png',
        rating: 4.5,
        reviews: 200,
        title: 'Apple 2024 MacBook Pro (16-inch)',
        price: '1,49,000',
        currency: 'Rs'
      },
      {
        id: 2,
        image: '/products/Frame 134.png',
        rating: 4.5,
        reviews: 200,
        title: 'Apple 2024 MacBook Pro (16-inch)',
        price: '1,49,000',
        currency: 'Rs'
      },
      {
        id: 3,
        image: '/products/Frame 135.png',
        rating: 4.5,
        reviews: 200,
        title: 'Apple 2024 MacBook Pro (16-inch)',
        price: '1,49,000',
        currency: 'Rs'
      },
      {
        id: 4,
        image: '/products/Frame 136.png',
        rating: 4.5,
        reviews: 200,
        title: 'Apple 2024 MacBook Pro (16-inch)',
        price: '1,49,000',
        currency: 'Rs'
      }
    ];
  
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Featured Products</h2>
        
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
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
          <div className="mt-4 flex justify-end gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    );
  }
  
  export { FeaturedProductsSection };