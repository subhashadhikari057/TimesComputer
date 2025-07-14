import { Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Product } from "../../../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating)
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-300"
          }`}
      />
    ));

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "new":
        return "bg-green-600";
      case "best seller":
        return "bg-orange-500";
      case "limited":
        return "bg-red-600";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <div className="w-full max-w-[90%] sm:max-w-[250px] mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition duration-300 ease-in-out transform hover:scale-[1.02] hover:-translate-y-1 hover:opacity-95">
      {/* ---------- Image ---------- */}
      <div className="relative w-full h-40 sm:h-44 bg-white overflow-hidden">
        {product.tag && (
          <span
            className={`absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white capitalize ${getTagColor(
              product.tag
            )}`}
          >
            {product.tag}
          </span>
        )}

        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 90vw, 250px"
          priority
        />
      </div>

      {/* ---------- Info ---------- */}
      <div className="flex flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-center gap-1">
          {renderStars(product.rating)}
          <span className="text-[10px] sm:text-xs text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>


        <h3 className="line-clamp-2 text-xs sm:text-sm font-medium text-gray-900 leading-snug">
          {product.title}
        </h3>

        <div className="mt-1 flex items-center justify-between">
          <span className="font-semibold text-blue-600 text-xs sm:text-base">
            {product.currency} {product.price.toLocaleString()}
          </span>

          {/* <a
            href="#"
            className="flex items-center gap-1 text-[11px] sm:text-sm text-blue-600 hover:underline"
          >
            View
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </a> */}

          <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 rounded-md flex items-center gap-1 transition-all duration-200 cursor-pointer">
            view
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
