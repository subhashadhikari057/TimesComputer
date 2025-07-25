'use client';

import { ArrowRight, Plus, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../../types/product';
import { getImageUrl } from '@/lib/imageUtils';
import { useCompare } from '@/contexts/CompareContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  dynamicHeight?: boolean;
}

export default function ProductCard({ product, compact = false, dynamicHeight = false }: ProductCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(product.id!);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCompare) {
      removeFromCompare(product.id!);
    } else {
      addToCompare(product);
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'new':
        return 'bg-green-600';
      case 'best seller':
        return 'bg-orange-500';
      case 'limited':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getMarketingTagColor = (tagName: string) => {
    switch (tagName.toLowerCase()) {
      case 'hot deal':
        return 'bg-red-500';
      case 'trending':
        return 'bg-purple-500';
      case 'bestseller':
        return 'bg-yellow-500';
      case 'new arrival':
        return 'bg-green-500';
      case 'limited offer':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Get the first marketing tag if available
  const marketingTag = product.marketingTags && product.marketingTags.length > 0 
    ? product.marketingTags[0].tag 
    : null;

  return (
    <div
      className={`w-full h-full flex flex-col ${compact ? 'max-w-full' : 'max-w-[90%] sm:max-w-[250px]'} mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition duration-300 ease-in-out transform hover:scale-[1.02] hover:-translate-y-1 hover:opacity-95`}
    >
      {/* ---------- Image ---------- */}
      {dynamicHeight ? (
        // ✅ Option 2: Dynamic height using aspect ratio
        <div className="relative w-full aspect-[4/3] bg-white overflow-hidden">
          {/* Product Tag */}
          {product.tag && !compact && (
            <span
              className={`absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white capitalize ${getTagColor(
                product.tag
              )}`}
            >
              {product.tag}
            </span>
          )}

          {/* Marketing Tag Badge */}
          {marketingTag && !compact && (
            <span
              className={`absolute top-2 right-2 z-10 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white capitalize ${getMarketingTagColor(
                marketingTag.name
              )}`}
            >
              {marketingTag.name}
            </span>
          )}

          <Image
            src={product?.images?.[0] ? getImageUrl(product.images[0]) : '/image.png'}
            alt={product.name || 'Product image'}
            fill
            className="object-contain"
            sizes={compact ? '33vw' : '(max-width: 640px) 90vw, 250px'}
            priority
          />
        </div>
      ) : (
        // ✅ Option 1: Fixed height
        <div
          className={`relative w-full ${
            compact ? 'h-32' : 'h-40 sm:h-44'
          } bg-white overflow-hidden flex items-center justify-center`}
        >
          {/* Product Tag */}
          {product.tag && !compact && (
            <span
              className={`absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white capitalize ${getTagColor(
                product.tag
              )}`}
            >
              {product.tag}
            </span>
          )}

          {/* Marketing Tag Badge */}
          {marketingTag && !compact && (
            <span
              className={`absolute top-2 right-2 z-10 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white capitalize ${getMarketingTagColor(
                marketingTag.name
              )}`}
            >
              {marketingTag.name}
            </span>
          )}

          <Image
            src={product?.images?.[0] ? getImageUrl(product.images[0]) : '/image.png'}
            alt={product.name || 'Product image'}
            fill
            className="object-contain"
            sizes={compact ? '33vw' : '(max-width: 640px) 90vw, 250px'}
            priority
          />
        </div>
      )}

      {/* ---------- Info ---------- */}
      <div className={`flex flex-col gap-2 flex-1 ${compact ? 'p-2' : 'p-3 sm:p-4'}`}>
        <h3
          className={`line-clamp-2 ${compact ? 'text-[14px] min-h-[32px]' : 'text-xs sm:text-sm min-h-[36px]'} font-medium text-gray-900 leading-snug`}
        >
          {product.name}
        </h3>

        {/* Marketing Tag Badge in Content Area (for compact view) */}
        {marketingTag && compact && (
          <div className="flex">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-semibold text-white capitalize ${getMarketingTagColor(
                marketingTag.name
              )}`}
            >
              {marketingTag.name}
            </span>
          </div>
        )}

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span
              className={`font-semibold text-blue-600 ${
                compact ? 'text-[10px]' : 'text-xs sm:text-base'
              }`}
            >
              Rs {product?.price ? product.price.toLocaleString('en-IN') : 'Price not available'}
            </span>

            <Link
              href={`/products/${product.slug}`}
              className="flex items-center gap-1 text-[11px] sm:text-sm text-blue-600 hover:underline"
            >
              View
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>

          {/* Compare Button */}
          <button
            onClick={handleCompareClick}
            className={`w-full flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] sm:text-xs font-medium transition-colors ${
              inCompare
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            {inCompare ? (
              <>
                <Check className="h-3 w-3" />
                In Compare
              </>
            ) : (
              <>
                <Plus className="h-3 w-3" />
                Compare
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
