'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import PriceFilterSlider from '@/components/ui/pricefilterslider';
import { brandsConfig, BrandConfig } from '@/lib/getproducts';

// Types
interface FilterSidebarProps {
  category?: string;
  brand?: string | null;
  onFiltersChange?: (filters: FilterChangeResult) => void;
  loading?: boolean;
  initialFilters?: SelectedFilters;
  className?: string;
  onApplyFilters?: (filters: FilterChangeResult) => void;
}

interface FilterChangeResult {
  category: string;
  brand: string | null;
  priceRange: PriceRange;
  filters: SelectedFilters;
  activeCount: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface SelectedFilters {
  [key: string]: string[] | PriceRange;
}

interface ExpandedSections {
  [key: string]: boolean;
}

interface RangeFilterConfig {
  type: 'range';
  min: number;
  max: number;
  currency: string;
}

interface InputFilterConfig {
  type: 'input';
  options: string[];
  height: number;
}

type FilterConfig = RangeFilterConfig | InputFilterConfig;

interface FilterData {
  [key: string]: {
    [key: string]: FilterConfig;
  };
}

// Constants
const INITIAL_EXPANDED_SECTIONS = {
  price: true,
  brand: true,
  processor: true,
  memory: true,
  storage: true,
  graphics: true,
  display: true,
  features: true,
  connectivity: true,
  color: true,
  size: true,
  switches: true,
  sensor: true,
  resolution: true,
  refreshRate: true,
  panelType: true,
  os: true,
  warranty: true,
  condition: true,
  screenSize: true,
  weight: true,
  battery: true,
  ports: true,
  type: true,
  processorBrand: true,
  generation: true,
  specialFeatures: true,
  graphicsMemory: true
};

const DEFAULT_PRICE_RANGE = { min: 25000, max: 500000 };

// Filter Data Configuration
const createFilterData = (brands: BrandConfig[]): FilterData => ({
  'all': {
    price: { type: 'range', min: 25000, max: 500000, currency: 'NPR' },
    brand: { type: 'input', options: brands.map(b => b.name), height: 160 },
    type: { 
      type: 'input', 
      options: ['Gaming', 'Business', 'Student', 'Ultrabook', '2 in 1 Convertible'],
      height: 120
    },
    processorBrand: { 
      type: 'input', 
      options: ['Intel', 'AMD'],
      height: 60
    },
    generation: { 
      type: 'input', 
      options: ['13th Gen', '12th Gen', '11th Gen', '10th Gen', 'Ryzen 7000 Series', 'Ryzen 6000 Series', 'Ryzen 5000 Series'],
      height: 160
    },
    processor: { 
      type: 'input', 
      options: ['Intel Core i9', 'Intel Core i7', 'Intel Core i5', 'Intel Core i3', 'AMD Ryzen 9', 'AMD Ryzen 7', 'AMD Ryzen 5', 'AMD Ryzen 3'],
      height: 180
    },
    memory: { 
      type: 'input', 
      options: ['8 GB', '16 GB', '32 GB', '64 GB'],
      height: 100
    },
    storage: { 
      type: 'input', 
      options: ['256 GB', '512 GB', '1 TB', '2 TB'],
      height: 100
    },
    graphics: { 
      type: 'input', 
      options: ['Shared/Integrated', '2GB Dedicated', '4GB Dedicated', '6GB Dedicated', '8GB Dedicated', '12GB Dedicated', '16GB Dedicated'],
      height: 160
    },
    os: { 
      type: 'input', 
      options: ['Windows 11 Pro', 'Windows 11 Home', 'Windows 10 Home', 'Linux', 'Free DOS'],
      height: 120
    }
  },
  'gaming-laptop': {
    price: { type: 'range', min: 50000, max: 500000, currency: 'NPR' },
    type: { 
      type: 'input', 
      options: ['Gaming', 'Notebook', 'Ultrabook', '2 in 1 Convertible', 'Standard'],
      height: 120
    },
    processorBrand: { type: 'input', options: ['Intel', 'AMD'], height: 60 },
    generation: { 
      type: 'input', 
      options: ['12th Gen', '13th Gen', '11th Gen', '10th Gen', 'Ryzen 7000 Series', 'Ryzen 6000 Series', 'Ryzen 5000 Series'],
      height: 160
    },
    processor: { 
      type: 'input', 
      options: ['Intel Core i9', 'Intel Core i7', 'Intel Core i5', 'AMD Ryzen 9', 'AMD Ryzen 7', 'AMD Ryzen 5'],
      height: 140
    },
    display: { type: 'input', options: ['LCD', 'OLED', 'IPS', 'VA Panel'], height: 100 },
    memory: { type: 'input', options: ['8 GB', '16 GB', '32 GB', '64 GB'], height: 100 },
    storage: { type: 'input', options: ['256 GB', '512 GB', '1 TB', '2 TB'], height: 100 },
    graphics: { 
      type: 'input', 
      options: ['Shared/Integrated', '2GB Dedicated', '4GB Dedicated', '6GB Dedicated', '8GB Dedicated', '12GB Dedicated', '16GB Dedicated'],
      height: 160
    },
    os: { 
      type: 'input', 
      options: ['Windows 11 Home', 'Windows 11 Pro', 'Windows 10 Home', 'Linux', 'Free DOS'],
      height: 120
    },
    specialFeatures: { 
      type: 'input', 
      options: ['Fingerprint Scanner', 'Backlit Keyboard', 'Touchscreen Display'],
      height: 80
    },
    warranty: { type: 'input', options: ['1 Year', '2 Year', '3 Year'], height: 80 }
  },
  'business-laptop': {
    price: { type: 'range', min: 40000, max: 300000, currency: 'NPR' },
    type: { 
      type: 'input', 
      options: ['Business', 'Ultrabook', '2 in 1 Convertible', 'Standard', 'Workstation'],
      height: 120
    },
    processorBrand: { type: 'input', options: ['Intel', 'AMD'], height: 60 },
    generation: { 
      type: 'input', 
      options: ['13th Gen', '12th Gen', '11th Gen', 'Ryzen 7000 Series', 'Ryzen 6000 Series'],
      height: 120
    },
    processor: { 
      type: 'input', 
      options: ['Intel Core i7', 'Intel Core i5', 'Intel Core i3', 'AMD Ryzen 7', 'AMD Ryzen 5'],
      height: 120
    },
    display: { type: 'input', options: ['LCD', 'IPS', 'OLED', 'Anti-Glare'], height: 100 },
    memory: { type: 'input', options: ['8 GB', '16 GB', '32 GB'], height: 80 },
    storage: { type: 'input', options: ['256 GB', '512 GB', '1 TB'], height: 80 },
    graphics: { type: 'input', options: ['Shared/Integrated', '2GB Dedicated', '4GB Dedicated'], height: 80 },
    os: { type: 'input', options: ['Windows 11 Pro', 'Windows 11 Home', 'Linux'], height: 80 },
    specialFeatures: { 
      type: 'input', 
      options: ['Fingerprint Scanner', 'TPM 2.0', 'MIL-STD Certified', 'Docking Support'],
      height: 100
    },
    warranty: { type: 'input', options: ['1 Year', '2 Year', '3 Year', '4 Year'], height: 100 }
  },
  'student-laptop': {
    price: { type: 'range', min: 25000, max: 150000, currency: 'NPR' },
    type: { type: 'input', options: ['Student', 'Ultrabook', 'Chromebook', 'Standard'], height: 100 },
    processorBrand: { type: 'input', options: ['Intel', 'AMD'], height: 60 },
    generation: { 
      type: 'input', 
      options: ['12th Gen', '11th Gen', '10th Gen', 'Ryzen 5000 Series'],
      height: 100
    },
    processor: { 
      type: 'input', 
      options: ['Intel Core i5', 'Intel Core i3', 'Intel Celeron', 'AMD Ryzen 5', 'AMD Ryzen 3'],
      height: 120
    },
    display: { type: 'input', options: ['LCD', 'IPS', 'HD', 'FHD'], height: 100 },
    memory: { type: 'input', options: ['4 GB', '8 GB', '16 GB'], height: 80 },
    storage: { type: 'input', options: ['128 GB', '256 GB', '512 GB', '1 TB HDD'], height: 100 },
    graphics: { type: 'input', options: ['Shared/Integrated'], height: 40 },
    os: { type: 'input', options: ['Windows 11 Home', 'Chrome OS', 'Free DOS'], height: 80 },
    specialFeatures: { type: 'input', options: ['Long Battery Life', 'Lightweight Design'], height: 60 },
    warranty: { type: 'input', options: ['1 Year', '2 Year'], height: 60 }
  },
  'everyday-laptop': {
    price: { type: 'range', min: 30000, max: 200000, currency: 'NPR' },
    type: { 
      type: 'input', 
      options: ['Standard', 'Ultrabook', '2 in 1 Convertible', 'All-in-One'],
      height: 100
    },
    processorBrand: { type: 'input', options: ['Intel', 'AMD'], height: 60 },
    generation: { 
      type: 'input', 
      options: ['13th Gen', '12th Gen', '11th Gen', 'Ryzen 6000 Series', 'Ryzen 5000 Series'],
      height: 120
    },
    processor: { 
      type: 'input', 
      options: ['Intel Core i7', 'Intel Core i5', 'Intel Core i3', 'AMD Ryzen 7', 'AMD Ryzen 5'],
      height: 120
    },
    display: { type: 'input', options: ['LCD', 'IPS', 'Touchscreen'], height: 80 },
    memory: { type: 'input', options: ['8 GB', '16 GB', '32 GB'], height: 80 },
    storage: { type: 'input', options: ['256 GB', '512 GB', '1 TB'], height: 80 },
    graphics: { type: 'input', options: ['Shared/Integrated', '2GB Dedicated', '4GB Dedicated'], height: 80 },
    os: { type: 'input', options: ['Windows 11 Home', 'Windows 11 Pro'], height: 60 },
    specialFeatures: { 
      type: 'input', 
      options: ['Fingerprint Scanner', 'Backlit Keyboard', 'Fast Charging'],
      height: 80
    },
    warranty: { type: 'input', options: ['1 Year', '2 Year', '3 Year'], height: 80 }
  },
  'mac': {
    price: { type: 'range', min: 80000, max: 400000, currency: 'NPR' },
    type: { type: 'input', options: ['MacBook Air', 'MacBook Pro', 'iMac', 'Mac Studio'], height: 100 },
    processor: { 
      type: 'input', 
      options: ['M3', 'M2', 'M1', 'M3 Pro', 'M2 Pro', 'M1 Pro', 'M3 Max', 'M2 Max'],
      height: 180
    },
    memory: { type: 'input', options: ['8 GB', '16 GB', '32 GB', '64 GB', '128 GB'], height: 120 },
    storage: { type: 'input', options: ['256 GB', '512 GB', '1 TB', '2 TB', '4 TB', '8 TB'], height: 140 },
    display: { type: 'input', options: ['Retina', 'Liquid Retina XDR', 'Studio Display'], height: 80 },
    color: { 
      type: 'input', 
      options: ['Space Gray', 'Silver', 'Gold', 'Midnight', 'Starlight', 'Space Black'],
      height: 140
    },
    screenSize: { 
      type: 'input', 
      options: ['13-inch', '14-inch', '15-inch', '16-inch', '24-inch', '27-inch'],
      height: 140
    },
    warranty: { type: 'input', options: ['1 Year', '2 Year', '3 Year'], height: 80 }
  },
  'keyboard': {
    price: { type: 'range', min: 1000, max: 50000, currency: 'NPR' },
    type: { type: 'input', options: ['Mechanical', 'Membrane', 'Wireless', 'Gaming'], height: 100 },
    brand: { 
      type: 'input', 
      options: ['Logitech', 'Corsair', 'Razer', 'SteelSeries', 'Keychron', 'HyperX'],
      height: 140
    },
    switches: { 
      type: 'input', 
      options: ['Cherry MX Blue', 'Cherry MX Brown', 'Cherry MX Red', 'Gateron', 'Kailh'],
      height: 120
    },
    size: { type: 'input', options: ['60%', '65%', '75%', 'TKL', 'Full Size'], height: 120 },
    connectivity: { 
      type: 'input', 
      options: ['USB-C', 'USB-A', 'Bluetooth', 'Wireless 2.4GHz'],
      height: 100
    },
    features: { 
      type: 'input', 
      options: ['RGB Lighting', 'Hot-swappable', 'Programmable', 'Media Keys'],
      height: 100
    }
  },
  'mouse': {
    price: { type: 'range', min: 500, max: 20000, currency: 'NPR' },
    type: { type: 'input', options: ['Gaming', 'Wireless', 'Ergonomic', 'Optical'], height: 100 },
    brand: { type: 'input', options: ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX'], height: 120 },
    sensor: { type: 'input', options: ['Optical', 'Laser', 'Hero 25K', 'PixArt 3360'], height: 100 },
    connectivity: { type: 'input', options: ['USB', 'Wireless', 'Bluetooth'], height: 80 },
    features: { 
      type: 'input', 
      options: ['RGB Lighting', 'Adjustable DPI', 'Programmable Buttons'],
      height: 80
    }
  },
  'monitor': {
    price: { type: 'range', min: 15000, max: 300000, currency: 'NPR' },
    type: { type: 'input', options: ['Gaming', 'Professional', 'Ultrawide', '4K'], height: 100 },
    brand: { type: 'input', options: ['Dell', 'LG', 'Samsung', 'ASUS', 'Acer', 'BenQ'], height: 140 },
    screenSize: { 
      type: 'input', 
      options: ['21-24 inch', '25-27 inch', '28-32 inch', '33+ inch'],
      height: 100
    },
    resolution: { 
      type: 'input', 
      options: ['1920x1080', '2560x1440', '3840x2160', 'Ultrawide'],
      height: 100
    },
    refreshRate: { type: 'input', options: ['60Hz', '120Hz', '144Hz', '240Hz'], height: 100 },
    panelType: { type: 'input', options: ['IPS', 'VA', 'TN', 'OLED'], height: 100 }
  }
});

// Custom Components
const InputFilter = ({ 
  options, 
  filterKey, 
  height, 
  selectedFilters, 
  onFilterChange 
}: { 
  options: string[];
  filterKey: string;
  height: number;
  selectedFilters: SelectedFilters;
  onFilterChange: (filterType: string, value: string) => void;
}) => (
  <div className="px-2 mt-3">
    <ScrollArea style={{ height: `${height}px` }}>
      <div className="space-y-1">
        {options.map((option, index) => {
          const isChecked = Array.isArray(selectedFilters[filterKey]) && 
            (selectedFilters[filterKey] as string[]).includes(option);
          
          return (
            <div key={index} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded-md transition-colors">
              <Checkbox
                id={`${filterKey}-${index}`}
                checked={isChecked}
                onCheckedChange={() => onFilterChange(filterKey, option)}
              />
              <Label 
                htmlFor={`${filterKey}-${index}`}
                className="text-sm text-gray-700 cursor-pointer flex-1 select-none"
              >
                {option}
              </Label>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  </div>
);

const FilterSection = ({ 
  title, 
  config, 
  sectionKey,
  selectedFilters,
  expandedSections,
  onToggleSection,
  onClearFilter,
  priceRange,
  onPriceChange,
  onApplyPrice,
  onFilterChange
}: { 
  title: string;
  config: FilterConfig;
  sectionKey: string;
  selectedFilters: SelectedFilters;
  expandedSections: ExpandedSections;
  onToggleSection: (section: string) => void;
  onClearFilter: (filterType: string) => void;
  priceRange: PriceRange;
  onPriceChange: (min: number, max: number) => void;
  onApplyPrice: () => void;
  onFilterChange: (filterType: string, value: string) => void;
}) => {
  const isExpanded = expandedSections[sectionKey];
  const selectedValues = (selectedFilters[sectionKey] || []) as string[];

  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer py-2"
        onClick={() => onToggleSection(sectionKey)}
      >
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="flex items-center space-x-2">
          {selectedValues.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedValues.length}
            </Badge>
          )}
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2">
          {config.type === 'range' ? (
            <PriceFilterSlider
              min={config.min}
              max={config.max}
              currency={config.currency}
              initialMin={priceRange.min}
              initialMax={priceRange.max}
              onPriceChange={onPriceChange}
              onApply={onApplyPrice}
            />
          ) : (
            <InputFilter
              options={config.options}
              filterKey={sectionKey}
              height={config.height}
              selectedFilters={selectedFilters}
              onFilterChange={onFilterChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Loading Component
const LoadingState = ({ className }: { className?: string }) => (
  <div className={`w-80 bg-white border-r border-gray-200 h-screen ${className}`}>
    <div className="p-6 border-b border-gray-200">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
    <div className="p-6 space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ 
  title, 
  description, 
  className 
}: { 
  title: string; 
  description: string; 
  className?: string; 
}) => (
  <div className={`w-80 bg-white border-r border-gray-200 h-screen ${className}`}>
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
    </div>
    <div className="p-6 text-center">
      <div className="text-gray-400 mb-4">
        <Search className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-gray-500 text-lg">{title}</p>
      <p className="text-gray-400 text-sm mt-2">{description}</p>
    </div>
  </div>
);

// Utility Functions
const getCategoryKey = (categorySlug: string): string => categorySlug || 'all';

const formatCategoryDisplay = (category?: string, brand?: string | null): string => {
  if (brand) {
    return `${brand.charAt(0).toUpperCase() + brand.slice(1)} Products`;
  }
  return category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Products';
};

// Main Component
const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  category = '', 
  brand = null,
  onFiltersChange, 
  loading = false,
  initialFilters = {},
  className = "",
  onApplyFilters
}) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>(INITIAL_EXPANDED_SECTIONS);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(initialFilters);
  const [priceRange, setPriceRange] = useState<PriceRange>(
    (initialFilters.price as PriceRange) || DEFAULT_PRICE_RANGE
  );
  const [searchQuery, setSearchQuery] = useState("");

  const categoryKey = useMemo(() => getCategoryKey(category), [category]);
  const filterData = useMemo(() => createFilterData(brandsConfig), []);
  const currentFilters = filterData[categoryKey] || filterData['all'];

  useEffect(() => {
    if (brand) {
      setSelectedFilters(prev => ({
        ...prev,
        brand: [brand]
      }));
    }
  }, [brand]);

  const toggleSection = (section: string): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType: string, value: string): void => {
    setSelectedFilters(prev => {
      const currentValues = (prev[filterType] || []) as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      if (onFiltersChange) {
        onFiltersChange({
          category,
          brand,
          priceRange,
          filters: {
            ...prev,
            [filterType]: newValues
          },
          activeCount: getActiveFiltersCount()
        });
      }

      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  const handlePriceChange = (min: number, max: number): void => {
    setPriceRange({ min, max });
  };

  const applyPriceFilter = (): void => {
    setSelectedFilters(prev => ({
      ...prev,
      price: priceRange
    }));

    if (onFiltersChange) {
      onFiltersChange({
        category,
        brand,
        priceRange,
        filters: selectedFilters,
        activeCount: getActiveFiltersCount()
      });
    }
  };

  

  const applyAllFilters = (): void => {
    if (onApplyFilters) {
      onApplyFilters({
        category,
        brand,
        priceRange,
        filters: selectedFilters,
        activeCount: getActiveFiltersCount()
      });
    }
  };

  const clearAllFilters = (): void => {
    setSelectedFilters({});
    setPriceRange(DEFAULT_PRICE_RANGE);
    
    if (onFiltersChange) {
      onFiltersChange({
        category,
        brand: null,
        priceRange: DEFAULT_PRICE_RANGE,
        filters: {},
        activeCount: 0
      });
    }
  };

  const clearFilterType = (filterType: string): void => {
    setSelectedFilters(prev => {
      const { [filterType]: _, ...rest } = prev;
      return rest;
    });
  };

  const getActiveFiltersCount = (): number => {
    return Object.entries(selectedFilters).reduce((count, [key, value]) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      return count + (value ? 1 : 0);
    }, 0);
  };

  if (loading) {
    return <LoadingState className={className} />;
  }

  return (
    <div className={`w-full max-w-xs bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {formatCategoryDisplay(category, brand)}
        </h2>
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          type="text"
          placeholder="Search filters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4">
          {Object.entries(currentFilters).map(([key, config]) => {
            const title = key.charAt(0).toUpperCase() + key.slice(1);
            if (
              searchQuery &&
              !title.toLowerCase().includes(searchQuery.toLowerCase()) &&
              (config.type === 'input' ? 
                !config.options.some((opt: string) => 
                  opt.toLowerCase().includes(searchQuery.toLowerCase())
                ) : false)
            ) {
              return null;
            }

            return (
              <FilterSection
                key={key}
                title={title}
                config={config}
                sectionKey={key}
                selectedFilters={selectedFilters}
                expandedSections={expandedSections}
                onToggleSection={toggleSection}
                onClearFilter={clearFilterType}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                onApplyPrice={applyPriceFilter}
                onFilterChange={handleFilterChange}
              />
            );
          })}
        </div>
      </ScrollArea>

      <Separator className="my-4" />

      <Button
        className="w-full"
        onClick={applyAllFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;