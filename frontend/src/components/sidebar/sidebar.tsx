'use client';

import React, { useState } from 'react';
import { PriceFilterSlider } from '../ui/pricefilterslider';
import { products } from '@/lib/index';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const FILTER_CONFIG: Record<
  string,
  {
    brand?: string[];
    processor?: string[];
    memory?: string[];
    connectivity?: string[];
    switchType?: string[];
    graphics?: string[];
    screenSize?: string[];
    resolution?: string[];
  }
> = {
  // Gaming Laptops
  'gaming laptop': {
    brand: ['ASUS', 'Dell', 'HP', 'Acer', 'Lenovo'],
    processor: ['AMD Ryzen 7', 'Intel Core i7', 'AMD Ryzen 5', 'Intel Core i5'],
    memory: ['8 GB', '16 GB', '32 GB'],
    graphics: ['RTX 3060', 'RTX 3050', 'GTX 1650'],
  },
  // Business Laptops
  'business laptop': {
    brand: ['Dell', 'Lenovo', 'HP'],
    processor: ['Intel Core i7', 'AMD Ryzen 5', 'Intel Core i5'],
    memory: ['8 GB', '16 GB', '32 GB'],
  },
  // Student Laptops
  'student laptop': {
    brand: ['ASUS', 'Acer', 'HP', 'Lenovo'],
    processor: ['Intel Core i5', 'AMD Ryzen 3', 'Intel Core i3'],
    memory: ['4 GB', '8 GB', '16 GB'],
  },
  // Everyday Laptops
  'everyday laptop': {
    brand: ['Dell', 'Lenovo', 'HP', 'ASUS'],
    processor: ['Intel Core i5', 'AMD Ryzen 5', 'Intel Core i3'],
    memory: ['4 GB', '8 GB', '16 GB'],
  },
  // Mac
  'mac': {
    brand: ['Apple'],
    processor: ['M2 Pro', 'M2', 'M2 Max', 'M1'],
    memory: ['8 GB', '16 GB', '32 GB'],
  },
  // Generic laptop category (fallback)
  'laptop': {
    brand: ['Apple', 'Dell', 'Lenovo', 'HP', 'ASUS', 'Acer'],
    processor: ['Intel Core i9', 'Intel Core i7', 'AMD Ryzen 7', 'AMD Ryzen 5', 'M2 Pro', 'M2'],
    memory: ['4 GB', '8 GB', '16 GB', '32 GB'],
  },
  // Keyboards
  'keyboard': {
    brand: ['Logitech', 'Keychron', 'Redragon', 'ASUS'],
    connectivity: ['Wired', 'Wireless', 'Bluetooth'],
    switchType: ['Scissor', 'Red', 'Blue', 'Brown'],
  },
  // Mice
  'mouse': {
    brand: ['Logitech', 'Redragon', 'ASUS'],
    connectivity: ['Wired', 'Wireless'],
  },
  // Monitors
  'monitor': {
    brand: ['Dell', 'ASUS', 'HP', 'Acer'],
    screenSize: ['24 inch', '27 inch', '32 inch'],
    resolution: ['1080p', '1440p', '4K'],
  },
  // All products (fallback)
  'all': {
    brand: ['Apple', 'Dell', 'Lenovo', 'HP', 'ASUS', 'Acer', 'Logitech', 'Keychron', 'Redragon'],
    processor: ['Intel Core i9', 'Intel Core i7', 'AMD Ryzen 7', 'AMD Ryzen 5', 'M2 Pro', 'M2'],
    memory: ['4 GB', '8 GB', '16 GB', '32 GB'],
    connectivity: ['Wired', 'Wireless', 'Bluetooth'],
    switchType: ['Scissor', 'Red', 'Blue', 'Brown'],
    graphics: ['RTX 3060', 'RTX 3050', 'GTX 1650'],
    screenSize: ['24 inch', '27 inch', '32 inch'],
    resolution: ['1080p', '1440p', '4K'],
  }
};

const DEFAULT_PRICE_RANGE = [25000, 500000];

export default function FilterSidebar({ onApplyFilters, category, brandName }: { 
  onApplyFilters?: (filters: any) => void;
  category?: string;
  brandName?: string;
}) {
  // Dynamic filter logic: if brandName is provided, get filters from products of that brand
  const getFiltersForBrand = (brandName: string) => {
    const brandProducts = products.filter(p => p.brand.toLowerCase() === brandName.toLowerCase());
    const filters: any = {};
    
    // Get unique values for each filter type from brand's products
    const brands = [...new Set(brandProducts.map(p => p.brand))].filter(Boolean);
    const processors = [...new Set(brandProducts.map(p => p.processor))].filter(Boolean);
    const memory = [...new Set(brandProducts.map(p => p.memory))].filter(Boolean);
    const connectivity = [...new Set(brandProducts.map(p => p.connectivity))].filter(Boolean);
    const switchType = [...new Set(brandProducts.map(p => p.switchType))].filter(Boolean);
    const graphics = [...new Set(brandProducts.map(p => p.graphics))].filter(Boolean);
    const screenSize = [...new Set(brandProducts.map(p => p.screenSize))].filter(Boolean);
    const resolution = [...new Set(brandProducts.map(p => p.resolution))].filter(Boolean);
    
    if (brands.length > 0) filters.brand = brands;
    if (processors.length > 0) filters.processor = processors;
    if (memory.length > 0) filters.memory = memory;
    if (connectivity.length > 0) filters.connectivity = connectivity;
    if (switchType.length > 0) filters.switchType = switchType;
    if (graphics.length > 0) filters.graphics = graphics;
    if (screenSize.length > 0) filters.screenSize = screenSize;
    if (resolution.length > 0) filters.resolution = resolution;
    
    return filters;
  };
  
  const filtersForCategory = brandName 
    ? getFiltersForBrand(brandName)
    : (category ? FILTER_CONFIG[category.toLowerCase()] || {} : {});
    
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<string[]>([]);
  const [selectedConnectivity, setSelectedConnectivity] = useState<string[]>([]);
  const [selectedSwitchType, setSelectedSwitchType] = useState<string[]>([]);
  const [selectedGraphics, setSelectedGraphics] = useState<string[]>([]);
  const [selectedScreenSize, setSelectedScreenSize] = useState<string[]>([]);
  const [selectedResolution, setSelectedResolution] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE as [number, number]);

  const toggleSelection = (arr: string[], value: string, setArr: (vals: string[]) => void) => {
    if (arr.includes(value)) {
      setArr(arr.filter(v => v !== value));
    } else {
      setArr([...arr, value]);
    }
  };

  const handleApply = () => {
    onApplyFilters?.({
      brand: selectedBrands,
      processor: selectedProcessors,
      memory: selectedMemory,
      connectivity: selectedConnectivity,
      switchType: selectedSwitchType,
      graphics: selectedGraphics,
      screenSize: selectedScreenSize,
      resolution: selectedResolution,
      priceRange: priceRange,
      category: category,
    });
  };

  return (
    <div className="w-full h-fit max-h-[600px] p-4 space-y-4 overflow-y-auto shadow-lg border-border rounded-lg bg-white sticky top-4">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <Accordion type="multiple" className="space-y-2">
        {/* Price Range Slider */}
        <PriceFilterSlider
          min={DEFAULT_PRICE_RANGE[0]}
          max={DEFAULT_PRICE_RANGE[1]}
          initialMin={priceRange[0]}
          initialMax={priceRange[1]}
          onPriceChange={(min, max) => setPriceRange([min, max])}
          onApply={handleApply}
        />
        
        {/* Brand Filter */}
        {filtersForCategory.brand && (
          <AccordionItem value="brand">
            <AccordionTrigger>Brand</AccordionTrigger>
            <AccordionContent>
              {filtersForCategory.brand?.map((brand: string) => (
                <div key={brand} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleSelection(selectedBrands, brand, setSelectedBrands)}
                    id={`brand-${brand}`}
                  />
                  <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Processor Filter */}
        {filtersForCategory.processor && (
          <AccordionItem value="processor">
            <AccordionTrigger>Processor</AccordionTrigger>
            <AccordionContent>
              {filtersForCategory.processor.map((proc: string) => (
                <div key={proc} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={selectedProcessors.includes(proc)}
                    onCheckedChange={() => toggleSelection(selectedProcessors, proc, setSelectedProcessors)}
                    id={`proc-${proc}`}
                  />
                  <Label htmlFor={`proc-${proc}`}>{proc}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Memory Filter */}
        {filtersForCategory.memory && (
          <AccordionItem value="memory">
            <AccordionTrigger>Memory</AccordionTrigger>
            <AccordionContent>
              {filtersForCategory.memory.map((mem: string) => (
                <div key={mem} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={selectedMemory.includes(mem)}
                    onCheckedChange={() => toggleSelection(selectedMemory, mem, setSelectedMemory)}
                    id={`mem-${mem}`}
                  />
                  <Label htmlFor={`mem-${mem}`}>{mem}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Connectivity Filter */}
        {filtersForCategory.connectivity && (
          <AccordionItem value="connectivity">
            <AccordionTrigger>Connectivity</AccordionTrigger>
            <AccordionContent>
              {filtersForCategory.connectivity.map((conn: string) => (
                <div key={conn} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={selectedConnectivity.includes(conn)}
                    onCheckedChange={() => toggleSelection(selectedConnectivity, conn, setSelectedConnectivity)}
                    id={`conn-${conn}`}
                  />
                  <Label htmlFor={`conn-${conn}`}>{conn}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Switch Type Filter */}
        {filtersForCategory.switchType && (
          <AccordionItem value="switchType">
            <AccordionTrigger>Switch Type</AccordionTrigger>
            <AccordionContent>
              {filtersForCategory.switchType.map((switchType: string) => (
                <div key={switchType} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={selectedSwitchType.includes(switchType)}
                    onCheckedChange={() => toggleSelection(selectedSwitchType, switchType, setSelectedSwitchType)}
                    id={`switch-${switchType}`}
                  />
                  <Label htmlFor={`switch-${switchType}`}>{switchType}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Graphics Filter */}
        {filtersForCategory.graphics && (
          <AccordionItem value="graphics">
            <AccordionTrigger>Graphics</AccordionTrigger>
            <AccordionContent>
              {filtersForCategory.graphics.map((graphics: string) => (
                <div key={graphics} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={selectedGraphics.includes(graphics)}
                    onCheckedChange={() => toggleSelection(selectedGraphics, graphics, setSelectedGraphics)}
                    id={`graphics-${graphics}`}
                  />
                  <Label htmlFor={`graphics-${graphics}`}>{graphics}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Screen Size Filter */}
        {filtersForCategory.screenSize && (
          <AccordionItem value="screenSize">
            <AccordionTrigger>Screen Size</AccordionTrigger>
            <AccordionContent>
              {filtersForCategory.screenSize.map((size: string) => (
                <div key={size} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={selectedScreenSize.includes(size)}
                    onCheckedChange={() => toggleSelection(selectedScreenSize, size, setSelectedScreenSize)}
                    id={`size-${size}`}
                  />
                  <Label htmlFor={`size-${size}`}>{size}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Resolution Filter */}
        {filtersForCategory.resolution && (
          <AccordionItem value="resolution">
            <AccordionTrigger>Resolution</AccordionTrigger>
            <AccordionContent>
              {filtersForCategory.resolution.map((resolution: string) => (
                <div key={resolution} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={selectedResolution.includes(resolution)}
                    onCheckedChange={() => toggleSelection(selectedResolution, resolution, setSelectedResolution)}
                    id={`res-${resolution}`}
                  />
                  <Label htmlFor={`res-${resolution}`}>{resolution}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <Button className="mt-4 w-full" onClick={handleApply}>
        Apply Filters
      </Button>
    </div>
  );
}