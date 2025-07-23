"use client";

import { useCompare } from '@/contexts/CompareContext';
import { ArrowRight, X, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';

export default function CompareBar() {
  const { compareProducts, compareCount, clearCompare } = useCompare();

  if (compareCount === 0) return null;

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4 mx-auto max-w-sm sm:max-w-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
              {compareCount} {compareCount === 1 ? 'Product' : 'Products'} to Compare
            </p>
            <p className="text-xs text-gray-500">
              {compareCount < 4 ? `Add ${4 - compareCount} more` : 'Maximum reached'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Link
            href="/compare"
            className="flex items-center gap-1 bg-blue-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <span className="hidden sm:inline">Compare</span>
            <span className="sm:hidden">Go</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
          
          <button
            onClick={clearCompare}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Clear all"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      
      {/* Product thumbnails */}
      <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 overflow-x-auto scrollbar-hide">
        {compareProducts.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded border overflow-hidden">
            <Image
              src={product.images?.[0] ? getImageUrl(product.images[0]) : '/products/Frame_68.png'}
              alt={product.name || 'Product'}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Show empty slots for potential additions */}
        {compareCount < 4 && (
          <>
            {[...Array(4 - compareCount)].map((_, index) => (
              <div key={`empty-${index}`} className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded flex items-center justify-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full"></div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
} 