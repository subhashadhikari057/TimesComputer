import { ArrowRight } from "lucide-react";
import Image from "next/image";

import Link from 'next/link'; 
import { Product } from "../../../types/product";
import { getImageUrl } from "@/lib/imageUtils";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
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
    <div className={`w-full ${compact ? 'max-w-full' : 'max-w-[90%] sm:max-w-[250px]'} mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition duration-300 ease-in-out transform hover:scale-[1.02] hover:-translate-y-1 hover:opacity-95`}>
      {/* ---------- Image ---------- */}
      <div className={`relative w-full ${compact ? 'h-32' : 'h-40 sm:h-44'} bg-white overflow-hidden`}>
        {product.tag && !compact && (
          <span
            className={`absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white capitalize ${getTagColor(
              product.tag
            )}`}
          >
            {product.tag}
          </span>
        )}

        <Image
          src={product?.images?.[0] ? getImageUrl(product.images[0]) : "/image.png"}
          alt={product.name || "Product image"}
          fill
          className="object-contain p-2"
          sizes={compact ? "33vw" : "(max-width: 640px) 90vw, 250px"}
          priority
        />
      </div>

      {/* ---------- Info ---------- */}
      <div className={`flex flex-col gap-2 ${compact ? 'p-2' : 'p-3 sm:p-4'}`}>
        <h3 className={`line-clamp-2 ${compact ? 'text-[14px]' : 'text-xs sm:text-sm'} font-medium text-gray-900 leading-snug`}>
          {product.name}
        </h3>

        <div className="mt-1 flex items-center justify-between">
          <span className={`font-semibold text-blue-600 ${compact ? 'text-[10px]' : 'text-xs sm:text-base'}`}>
            Rs {product?.price ? product.price.toLocaleString('en-IN') : "Price not available"}
          </span>

          {(
         

<Link
  href={`/products/${product.slug}`}
  className="flex items-center gap-1 text-[11px] sm:text-sm text-blue-600 hover:underline"
>
  View
  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
</Link>
          )}
        </div>
      </div>
    </div>
  );
}
