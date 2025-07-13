import { Star } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Product } from "../../../types/product";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
  }

  export default function ProductCard({ product }: ProductCardProps) {
    const renderStars = (rating: number): React.ReactNode[] => {
      return Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`w-2.5 h-2.5 sm:w-4 sm:h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
          }`}
        />
      ));
    };
  
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex-shrink-0 w-[calc(50vw-1.5rem)] sm:w-72 lg:flex-1 lg:w-auto">
        {/* Product Image */}
        <div className="aspect-square sm:mt-2 sm:aspect-[3/2] md:aspect-[4/2] bg-gray-100 relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="w-4/5 h-3/5 lg:w-full lg:h-full bg-gray-800 rounded-lg relative">
              <Image src={product.image} alt={product.title} fill className="object-cover" />
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-0.5 sm:h-1 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-2 sm:p-4">
          {/* Rating */}
          <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-[10px] sm:text-sm text-gray-600 ml-0.5 sm:ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
          
          {/* Product Title */}
          <h3 className="text-gray-900 font-medium mb-2 sm:mb-4 text-[10px] sm:text-sm leading-tight line-clamp-2">
            {product.title}
          </h3>
          
          {/* Price and Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <span className="text-blue-600 font-semibold text-xs sm:text-lg">
              {product.currency} {product.price}
            </span>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-1 py-1 sm:px-4 sm:py-1 cursor-pointer rounded-md sm:rounded-lg flex items-center justify-center sm:justify-start gap-0 sm:gap-0 text-[9px] sm:text-sm font-medium transition-colors duration-200 hidden sm:flex">
              <span className="hidden sm:inline">See Details</span>
              {/* <span className="sm:hidden">Details</span> */}
              <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };