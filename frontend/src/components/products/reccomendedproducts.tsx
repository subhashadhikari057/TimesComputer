import { dummyProducts } from '@/lib/dummyproduct';
import React, { useEffect, useState } from 'react'
import ProductCard from './productcard';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from "../../../types/product";
interface RecommendedProps {
    category?:string,
    currentSlug?:string
}

export default function RecommendedProducts({ currentSlug, category }: RecommendedProps) {
    const [recommended, setRecommended] = useState<Product[]>([]);
  
    useEffect(() => {
      (async () => {
        try {
          // -- Use this when backend is ready:
          /*
          const res = await axios.get(`/product?category=${category}`);
          const filtered = res.data.filter((p: Product) => p.slug !== currentSlug);
          setRecommended(filtered.slice(0, 4));
          */
  
          // Temporary dummy fallback:
          setRecommended(dummyProducts);
        } catch (err) {
          console.error("Failed to fetch recommended products", err);
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
