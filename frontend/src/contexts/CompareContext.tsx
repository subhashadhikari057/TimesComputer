"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../../types/product';

interface CompareContextType {
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  isInCompare: (productId: number) => boolean;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

interface CompareProviderProps {
  children: React.ReactNode;
}

export const CompareProvider: React.FC<CompareProviderProps> = ({ children }) => {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('compareProducts');
      if (stored) {
        try {
          setCompareProducts(JSON.parse(stored));
        } catch (error) {
          console.error('Error loading compare products from localStorage:', error);
        }
      }
    }
  }, []);

  // Save to localStorage whenever compareProducts changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('compareProducts', JSON.stringify(compareProducts));
    }
  }, [compareProducts]);

  const addToCompare = (product: Product) => {
    setCompareProducts(prev => {
      // Check if product already exists
      if (prev.some(p => p.id === product.id)) {
        return prev;
      }
      
      // Limit to maximum 4 products for comparison
      if (prev.length >= 4) {
        // Remove the first product and add the new one
        return [...prev.slice(1), product];
      }
      
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: number) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  const isInCompare = (productId: number) => {
    return compareProducts.some(p => p.id === productId);
  };

  const compareCount = compareProducts.length;

  const value: CompareContextType = {
    compareProducts,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    compareCount
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}; 