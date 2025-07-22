'use client';

import React, { useEffect, useState } from 'react';
import { Filters } from '../../../types/filtewr';
import { PriceFilterSlider } from '../ui/pricefilterslider';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const DEFAULT_PRICE_RANGE: [number, number] = [25000, 500000];

interface Product {
  brand?: {
    name: string;
  } | string;
  category?: {
    name: string;
  } | string;
}

interface FilterSidebarProps {
  onApplyFilters?: (filters: Filters) => void;
  defaultFilters?: Filters;
  category?: string;
  products: Product[];
}

export default function FilterSidebar({
  onApplyFilters,
  defaultFilters = {},
  category,
  products,
}: FilterSidebarProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    Array.isArray(defaultFilters.brand) ? defaultFilters.brand as string[] : []
  );
const [selectCategory, setSelectCategory] = useState<string[]>(
  Array.isArray(defaultFilters.category) && defaultFilters.category.every(v => typeof v === 'string')
    ? defaultFilters.category
    : category
    ? [category]
    : []
);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    defaultFilters.priceRange || DEFAULT_PRICE_RANGE
  );

 useEffect(() => {
  setSelectedBrands(Array.isArray(defaultFilters.brand) ? defaultFilters.brand as string[] : []);

  setSelectCategory(
    Array.isArray(defaultFilters.category) && defaultFilters.category.every(v => typeof v === 'string')
    ? defaultFilters.category
    : category
    ? [category]
    : []
);
  setPriceRange(defaultFilters.priceRange || DEFAULT_PRICE_RANGE);
}, [defaultFilters, category]);


  const brands = [
  ...new Set(
    Array.isArray(products)
      ? products
          .map((p) =>
            typeof p.brand === 'object' && p.brand !== null
              ? p.brand.name
              : typeof p.brand === 'string'
              ? p.brand
              : null
          )
          .filter((brand): brand is string => brand !== null)
      : []
  ),
];

const categories = [
  ...new Set(
    Array.isArray(products)
      ? products
          .map((p) =>
            typeof p.category === 'object' && p.category !== null
              ? p.category.name
              : typeof p.category === 'string'
              ? p.category
              : null
          )
          .filter((category): category is string => category !== null)
      : []
  ),
];


  const toggleSelection = (
    arr: string[],
    value: string,
    setArr: (val: string[]) => void,
    updatedKey: 'brand' | 'category'
  ) => {
    const updatedArr = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];

    setArr(updatedArr);

    const nextFilters: Filters = {
      brand: updatedKey === 'brand' ? updatedArr : selectedBrands,
      category: updatedKey === 'category' ? updatedArr : selectCategory,
      priceRange,
    };

    onApplyFilters?.(nextFilters);
  };

  const handleApply = () => {
    onApplyFilters?.({
      brand: selectedBrands,
      category: selectCategory,
      priceRange,
    });
  };

  return (
    <div className="w-full h-fit max-h-[600px] p-4 space-y-4 overflow-y-auto shadow-lg border border-border rounded-lg bg-white sticky top-4">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <Accordion type="multiple" className="space-y-2">
        {/* Price Filter */}
        <PriceFilterSlider
          min={DEFAULT_PRICE_RANGE[0]}
          max={DEFAULT_PRICE_RANGE[1]}
          initialMin={priceRange[0]}
          initialMax={priceRange[1]}
          onPriceChange={(min, max) => setPriceRange([min, max])}
          onApply={handleApply}
        />

        {/* Brand Filter */}
        {brands.length > 0 && (
          <AccordionItem value="brand">
            <AccordionTrigger>Brand</AccordionTrigger>
            <AccordionContent>
              {brands.map((brand: string) => (
                <div key={brand} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() =>
                      toggleSelection(selectedBrands, brand, setSelectedBrands, 'brand')
                    }
                    id={`brand-${brand}`}
                  />
                  <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <AccordionItem value="category">
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              {categories.map((cat: string) => (
                <div key={cat} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={selectCategory.includes(cat)}
                    onCheckedChange={() =>
                      toggleSelection(selectCategory, cat, setSelectCategory, 'category')
                    }
                    id={`category-${cat}`}
                  />
                  <Label htmlFor={`category-${cat}`}>{cat}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <Button className="mt-4 w-full text-background/90" onClick={handleApply}>
        Apply Filters
      </Button>
    </div>
  );
}
