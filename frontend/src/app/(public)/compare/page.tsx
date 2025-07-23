"use client";

import { useCompare } from '@/contexts/CompareContext';
import { X, ArrowLeft, BarChart3, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/imageUtils';
import { useState } from 'react';
import { Product } from '../../../../types/product';

// Type definitions for category and brand objects
interface CategoryObject {
  name: string;
}

interface BrandObject {
  name: string;
}

export default function ComparePage() {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});

  const toggleSpecExpansion = (specKey: string) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [specKey]: !prev[specKey]
    }));
  };

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center">
            <div className="mb-6 sm:mb-8">
              <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                No Products to Compare
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                Add products to your comparison list to see detailed side-by-side comparisons.
              </p>
            </div>
            
            <Link href="/products">
              <Button className="w-full sm:w-auto">Browse Products</Button>
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

  // Mobile Card Component
  const MobileCompareCard = ({ product }: { product: Product }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Product Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-blue-600">
            Rs {product.price?.toLocaleString('en-IN') || 'N/A'}
          </p>
        </div>
        <button
          onClick={() => removeFromCompare(product.id!)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-24 h-24 mx-auto bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={product.images?.[0] ? getImageUrl(product.images[0]) : '/products/Frame_68.png'}
          alt={product.name || 'Product'}
          fill
          className="object-contain"
        />
      </div>

      {/* Basic Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-gray-600">Category:</span>
          <span className="text-gray-900 text-right">
            {typeof product.category === 'string' 
              ? product.category 
              : (product.category as unknown as CategoryObject)?.name || '-'}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-gray-600">Brand:</span>
          <span className="text-gray-900 text-right">
            {typeof product.brand === 'string' 
              ? product.brand 
              : (product.brand as unknown as BrandObject)?.name || '-'}
          </span>
        </div>
      </div>

      {/* Specifications */}
      {specKeys.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm">Specifications</h4>
          <div className="space-y-1 text-sm">
            {specKeys.slice(0, 3).map((specKey) => (
              <div key={specKey} className="flex justify-between py-1">
                <span className="text-gray-600 text-xs">{specKey}:</span>
                <span className="text-gray-900 text-xs text-right max-w-32 truncate">
                  {product.specs?.[specKey] || '-'}
                </span>
              </div>
            ))}
            {specKeys.length > 3 && (
              <button
                onClick={() => toggleSpecExpansion(product.id!.toString())}
                className="flex items-center gap-1 text-blue-600 text-xs hover:text-blue-700"
              >
                {expandedSpecs[product.id!.toString()] ? 'Show Less' : `Show ${specKeys.length - 3} More`}
                {expandedSpecs[product.id!.toString()] ? 
                  <ChevronDown className="w-3 h-3" /> : 
                  <ChevronRight className="w-3 h-3" />
                }
              </button>
            )}
            {expandedSpecs[product.id!.toString()] && specKeys.slice(3).map((specKey) => (
              <div key={specKey} className="flex justify-between py-1">
                <span className="text-gray-600 text-xs">{specKey}:</span>
                <span className="text-gray-900 text-xs text-right max-w-32 truncate">
                  {product.specs?.[specKey] || '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <Link href={`/products/${product.slug}`}>
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Link href="/products">
                <Button variant="outline" size="sm" className="w-fit">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Compare Products ({compareProducts.length})
              </h1>
            </div>
            
            <Button variant="outline" onClick={clearCompare} className="w-fit sm:w-auto">
              Clear All
            </Button>
          </div>
          
          <p className="text-sm sm:text-base text-gray-600">
            Compare features, specifications, and prices to make the best choice.
          </p>
        </div>

        {/* Mobile Layout (Cards) - Hidden on larger screens */}
        <div className="block lg:hidden space-y-4 mb-6">
          {compareProducts.map((product) => (
            <MobileCompareCard key={product.id} product={product} />
          ))}
        </div>

        {/* Desktop/Tablet Layout (Table) - Hidden on mobile */}
        <div className="hidden lg:block">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Product Images and Basic Info */}
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="p-3 lg:p-4 text-left font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10 w-40 lg:w-48">
                      Products
                    </th>
                    {compareProducts.map((product) => (
                      <th key={product.id} className="p-3 lg:p-4 text-center w-48 lg:w-64 relative bg-gray-50">
                        <button
                          onClick={() => removeFromCompare(product.id!)}
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <div className="space-y-3 lg:space-y-4">
                          <div className="relative w-20 h-20 lg:w-32 lg:h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={product.images?.[0] ? getImageUrl(product.images[0]) : '/products/Frame_68.png'}
                              alt={product.name || 'Product'}
                              fill
                              className="object-contain"
                            />
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-gray-900 text-xs lg:text-sm mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-lg lg:text-xl font-bold text-blue-600">
                              Rs {product.price?.toLocaleString('en-IN') || 'N/A'}
                            </p>
                          </div>
                          
                          <Link href={`/products/${product.slug}`}>
                            <Button variant="outline" size="sm" className="w-full text-xs lg:text-sm">
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
                      <td className="p-3 lg:p-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10 border-r border-gray-200 text-xs lg:text-sm">
                        {specKey}
                      </td>
                      {compareProducts.map((product) => (
                        <td key={product.id} className="p-3 lg:p-4 text-center text-xs lg:text-sm text-gray-700">
                          <div className="max-w-full truncate" title={product.specs?.[specKey] || '-'}>
                            {product.specs?.[specKey] || '-'}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Additional Product Info */}
                  <tr className="border-b border-gray-100 bg-white">
                    <td className="p-3 lg:p-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10 border-r border-gray-200 text-xs lg:text-sm">
                      Category
                    </td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-3 lg:p-4 text-center text-xs lg:text-sm text-gray-700">
                        {typeof product.category === 'string' 
                          ? product.category 
                          : (product.category as unknown as CategoryObject)?.name || '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="p-3 lg:p-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10 border-r border-gray-200 text-xs lg:text-sm">
                      Brand
                    </td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-3 lg:p-4 text-center text-xs lg:text-sm text-gray-700">
                        {typeof product.brand === 'string' 
                          ? product.brand 
                          : (product.brand as unknown as BrandObject)?.name || '-'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Description Comparison */}
        {compareProducts.some(p => p.description) && (
          <div className="mt-6 lg:mt-8 bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Product Descriptions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {compareProducts.map((product) => (
                <div key={product.id} className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">
                    {product.name}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {product.description || 'No description available'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
          <Link href="/products" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Browse More Products
            </Button>
          </Link>
          <Button onClick={clearCompare} variant="destructive" className="w-full sm:w-auto">
            Clear Comparison
          </Button>
        </div>
      </div>
    </div>
  );
} 