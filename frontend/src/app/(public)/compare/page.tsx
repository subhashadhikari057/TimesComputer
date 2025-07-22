"use client";

import { useCompare } from '@/contexts/CompareContext';
import { X, ArrowLeft, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/imageUtils';

export default function ComparePage() {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();

  if (compareProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Products to Compare</h1>
            <p className="text-gray-600 mb-8">
              Add products to your comparison list to see detailed side-by-side comparisons.
            </p>
          </div>
          
          <div className="space-x-4">
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get all unique specification keys from all products
  const allSpecKeys = new Set<string>();
  compareProducts.forEach(product => {
    if (product.specs) {
      Object.keys(product.specs).forEach(key => allSpecKeys.add(key));
    }
  });

  const specKeys = Array.from(allSpecKeys).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Compare Products ({compareProducts.length})
            </h1>
          </div>
          
          <Button variant="outline" onClick={clearCompare}>
            Clear All
          </Button>
        </div>
        
        <p className="text-gray-600">
          Compare features, specifications, and prices to make the best choice.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full">
          {/* Product Images and Basic Info */}
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4 text-left font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10 min-w-48">
                Products
              </th>
              {compareProducts.map((product) => (
                <th key={product.id} className="p-4 text-center min-w-64 relative bg-gray-50">
                  <button
                    onClick={() => removeFromCompare(product.id!)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="space-y-4">
                    <div className="relative w-32 h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={product.images?.[0] ? getImageUrl(product.images[0]) : '/products/Frame_68.png'}
                        alt={product.name || 'Product'}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xl font-bold text-blue-600">
                        Rs {product.price?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                    
                    <Link href={`/products/${product.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Specifications */}
          <tbody>
            {specKeys.map((specKey, index) => (
              <tr key={specKey} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="p-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                  {specKey}
                </td>
                {compareProducts.map((product) => (
                  <td key={product.id} className="p-4 text-center text-sm text-gray-700">
                    {product.specs?.[specKey] || '-'}
                  </td>
                ))}
              </tr>
            ))}

            {/* Additional Product Info */}
            <tr className="border-b border-gray-100 bg-white">
              <td className="p-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                Category
              </td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 text-center text-sm text-gray-700">
                  {typeof product.category === 'string' 
                    ? product.category 
                    : (product.category as any)?.name || '-'}
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-100 bg-gray-50">
              <td className="p-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                Brand
              </td>
              {compareProducts.map((product) => (
                <td key={product.id} className="p-4 text-center text-sm text-gray-700">
                  {typeof product.brand === 'string' 
                    ? product.brand 
                    : (product.brand as any)?.name || '-'}
                </td>
              ))}
            </tr>


          </tbody>
        </table>
      </div>

      {/* Description Comparison */}
      {compareProducts.some(p => p.description) && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Product Descriptions</h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${compareProducts.length}, 1fr)` }}>
            {compareProducts.map((product) => (
              <div key={product.id}>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description || 'No description available'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/products">
          <Button variant="outline" className="w-full sm:w-auto">
            Browse More Products
          </Button>
        </Link>
        <Button onClick={clearCompare} variant="destructive" className="w-full sm:w-auto">
          Clear Comparison
        </Button>
      </div>
    </div>
  );
} 