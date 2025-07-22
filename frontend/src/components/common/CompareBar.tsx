"use client";

import { useCompare } from '@/contexts/CompareContext';
import { ArrowRight, X, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imageUtils';

export default function CompareBar() {
  const { compareProducts, compareCount, clearCompare } = useCompare();

  if (compareCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mx-auto max-w-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {compareCount} {compareCount === 1 ? 'Product' : 'Products'} to Compare
            </p>
            <p className="text-xs text-gray-500">
              {compareCount < 4 ? `Add ${4 - compareCount} more` : 'Maximum reached'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href="/compare"
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Compare
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <button
            onClick={clearCompare}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Product thumbnails */}
      <div className="flex gap-2 mt-3 overflow-x-auto">
        {compareProducts.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded border overflow-hidden">
            <img
              src={product.images?.[0] ? getImageUrl(product.images[0]) : '/products/Frame_68.png'}
              alt={product.name || 'Product'}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 