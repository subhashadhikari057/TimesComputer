import React, { useEffect, useState } from 'react'
import ProductCard from './productcard';
import { Product } from "../../../types/product";
import { getAllProducts } from '@/api/product';

interface RecommendedProps {
    category?:string,
    currentSlug?:string
}

export default function RecommendedProducts({ currentSlug, category }: RecommendedProps) {
    const [recommended, setRecommended] = useState<Product[]>([]);
  
    useEffect(() => {
      (async () => {
        try {
          const data = await getAllProducts();
          const allProducts = Array.isArray(data) ? data : [];
          
          // Filter by category if provided, exclude current product, and limit to 4
          let filtered = allProducts.filter((p: Product) => 
            p.slug !== currentSlug && p.isPublished
          );
          
          // If category is provided, filter by category
          if (category) {
            filtered = filtered.filter((p: Product) => {
              const productCategory = typeof p.category === 'string' ? p.category : (p.category as any)?.name;
              return productCategory?.toLowerCase() === category.toLowerCase();
            });
          }
          
          setRecommended(filtered.slice(0, 4));
        } catch (err) {
          console.error("Failed to fetch recommended products", err);
          setRecommended([]);
        }
      })();
    }, [category, currentSlug]);
  
    if (!recommended.length) return null;
  
    return (
      <div className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
  {recommended.map((product) => (
    <ProductCard key={product.id} product={product} compact />
  ))}
</div>
      </div>
    );
  }
