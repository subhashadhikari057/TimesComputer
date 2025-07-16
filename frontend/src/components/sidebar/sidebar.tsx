'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, X, Search } from 'lucide-react';
import { brandsConfig } from '@/lib/getproducts';

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

interface SearchTerms {
  [key: string]: string;
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

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  category = '', 
  brand = null,
  onFiltersChange, 
  loading = false,
  initialFilters = {},
  className = "",
  onApplyFilters
}) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
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
  });

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(initialFilters);
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({});
  const [priceRange, setPriceRange] = useState<PriceRange>(
    initialFilters.priceRange as PriceRange || { min: 25000, max: 500000 }
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Get all available brands
  const availableBrands = useMemo(() => {
    return brandsConfig.map(config => config.name);
  }, []);

  // Enhanced filter data with input field specifications
  const filterData: FilterData = {
    'all': {
      price: { type: 'range', min: 25000, max: 500000, currency: 'NPR' },
      brand: {
        type: 'input',
        options: availableBrands,
        height: 160
      },
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
      processorBrand: { 
        type: 'input', 
        options: ['Intel', 'AMD'],
        height: 60
      },
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
      display: { 
        type: 'input', 
        options: ['LCD', 'OLED', 'IPS', 'VA Panel'],
        height: 100
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
        options: ['Windows 11 Home', 'Windows 11 Pro', 'Windows 10 Home', 'Linux', 'Free DOS'],
        height: 120
      },
      specialFeatures: { 
        type: 'input', 
        options: ['Fingerprint Scanner', 'Backlit Keyboard', 'Touchscreen Display'],
        height: 80
      },
      warranty: { 
        type: 'input', 
        options: ['1 Year', '2 Year', '3 Year'],
        height: 80
      }
    },
    'business-laptop': {
      price: { type: 'range', min: 40000, max: 300000, currency: 'NPR' },
      type: { 
        type: 'input', 
        options: ['Business', 'Ultrabook', '2 in 1 Convertible', 'Standard', 'Workstation'],
        height: 120
      },
      processorBrand: { 
        type: 'input', 
        options: ['Intel', 'AMD'],
        height: 60
      },
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
      display: { 
        type: 'input', 
        options: ['LCD', 'IPS', 'OLED', 'Anti-Glare'],
        height: 100
      },
      memory: { 
        type: 'input', 
        options: ['8 GB', '16 GB', '32 GB'],
        height: 80
      },
      storage: { 
        type: 'input', 
        options: ['256 GB', '512 GB', '1 TB'],
        height: 80
      },
      graphics: { 
        type: 'input', 
        options: ['Shared/Integrated', '2GB Dedicated', '4GB Dedicated'],
        height: 80
      },
      os: { 
        type: 'input', 
        options: ['Windows 11 Pro', 'Windows 11 Home', 'Linux'],
        height: 80
      },
      specialFeatures: { 
        type: 'input', 
        options: ['Fingerprint Scanner', 'TPM 2.0', 'MIL-STD Certified', 'Docking Support'],
        height: 100
      },
      warranty: { 
        type: 'input', 
        options: ['1 Year', '2 Year', '3 Year', '4 Year'],
        height: 100
      }
    },
    'student-laptop': {
      price: { type: 'range', min: 25000, max: 150000, currency: 'NPR' },
      type: { 
        type: 'input', 
        options: ['Student', 'Ultrabook', 'Chromebook', 'Standard'],
        height: 100
      },
      processorBrand: { 
        type: 'input', 
        options: ['Intel', 'AMD'],
        height: 60
      },
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
      display: { 
        type: 'input', 
        options: ['LCD', 'IPS', 'HD', 'FHD'],
        height: 100
      },
      memory: { 
        type: 'input', 
        options: ['4 GB', '8 GB', '16 GB'],
        height: 80
      },
      storage: { 
        type: 'input', 
        options: ['128 GB', '256 GB', '512 GB', '1 TB HDD'],
        height: 100
      },
      graphics: { 
        type: 'input', 
        options: ['Shared/Integrated'],
        height: 40
      },
      os: { 
        type: 'input', 
        options: ['Windows 11 Home', 'Chrome OS', 'Free DOS'],
        height: 80
      },
      specialFeatures: { 
        type: 'input', 
        options: ['Long Battery Life', 'Lightweight Design'],
        height: 60
      },
      warranty: { 
        type: 'input', 
        options: ['1 Year', '2 Year'],
        height: 60
      }
    },
    'everyday-laptop': {
      price: { type: 'range', min: 30000, max: 200000, currency: 'NPR' },
      type: { 
        type: 'input', 
        options: ['Standard', 'Ultrabook', '2 in 1 Convertible', 'All-in-One'],
        height: 100
      },
      processorBrand: { 
        type: 'input', 
        options: ['Intel', 'AMD'],
        height: 60
      },
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
      display: { 
        type: 'input', 
        options: ['LCD', 'IPS', 'Touchscreen'],
        height: 80
      },
      memory: { 
        type: 'input', 
        options: ['8 GB', '16 GB', '32 GB'],
        height: 80
      },
      storage: { 
        type: 'input', 
        options: ['256 GB', '512 GB', '1 TB'],
        height: 80
      },
      graphics: { 
        type: 'input', 
        options: ['Shared/Integrated', '2GB Dedicated', '4GB Dedicated'],
        height: 80
      },
      os: { 
        type: 'input', 
        options: ['Windows 11 Home', 'Windows 11 Pro'],
        height: 60
      },
      specialFeatures: { 
        type: 'input', 
        options: ['Fingerprint Scanner', 'Backlit Keyboard', 'Fast Charging'],
        height: 80
      },
      warranty: { 
        type: 'input', 
        options: ['1 Year', '2 Year', '3 Year'],
        height: 80
      }
    },
    'mac': {
      price: { type: 'range', min: 80000, max: 400000, currency: 'NPR' },
      type: { 
        type: 'input', 
        options: ['MacBook Air', 'MacBook Pro', 'iMac', 'Mac Studio'],
        height: 100
      },
      processor: { 
        type: 'input', 
        options: ['M3', 'M2', 'M1', 'M3 Pro', 'M2 Pro', 'M1 Pro', 'M3 Max', 'M2 Max'],
        height: 180
      },
      memory: { 
        type: 'input', 
        options: ['8 GB', '16 GB', '32 GB', '64 GB', '128 GB'],
        height: 120
      },
      storage: { 
        type: 'input', 
        options: ['256 GB', '512 GB', '1 TB', '2 TB', '4 TB', '8 TB'],
        height: 140
      },
      display: { 
        type: 'input', 
        options: ['Retina', 'Liquid Retina XDR', 'Studio Display'],
        height: 80
      },
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
      warranty: { 
        type: 'input', 
        options: ['1 Year', '2 Year', '3 Year'],
        height: 80
      }
    },
    'keyboard': {
      price: { type: 'range', min: 1000, max: 50000, currency: 'NPR' },
      type: { 
        type: 'input', 
        options: ['Mechanical', 'Membrane', 'Wireless', 'Gaming'],
        height: 100
      },
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
      size: { 
        type: 'input', 
        options: ['60%', '65%', '75%', 'TKL', 'Full Size'],
        height: 120
      },
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
      type: { 
        type: 'input', 
        options: ['Gaming', 'Wireless', 'Ergonomic', 'Optical'],
        height: 100
      },
      brand: { 
        type: 'input', 
        options: ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX'],
        height: 120
      },
      sensor: { 
        type: 'input', 
        options: ['Optical', 'Laser', 'Hero 25K', 'PixArt 3360'],
        height: 100
      },
      connectivity: { 
        type: 'input', 
        options: ['USB', 'Wireless', 'Bluetooth'],
        height: 80
      },
      features: { 
        type: 'input', 
        options: ['RGB Lighting', 'Adjustable DPI', 'Programmable Buttons'],
        height: 80
      }
    },
    'monitor': {
      price: { type: 'range', min: 15000, max: 300000, currency: 'NPR' },
      type: { 
        type: 'input', 
        options: ['Gaming', 'Professional', 'Ultrawide', '4K'],
        height: 100
      },
      brand: { 
        type: 'input', 
        options: ['Dell', 'LG', 'Samsung', 'ASUS', 'Acer', 'BenQ'],
        height: 140
      },
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
      refreshRate: { 
        type: 'input', 
        options: ['60Hz', '120Hz', '144Hz', '240Hz'],
        height: 100
      },
      panelType: { 
        type: 'input', 
        options: ['IPS', 'VA', 'TN', 'OLED'],
        height: 100
      }
    }
  };

  const getCategoryKey = (categorySlug: string): string => {
    return categorySlug || 'all';
  };

  const currentFilters = useMemo(() => {
    if (brand && !category) {
      return filterData['all'] || {};
    }
    
    const categoryKey = getCategoryKey(category);
    return filterData[categoryKey] || {};
  }, [category, brand]);

  // Reset filters when category or brand changes
  useEffect(() => {
    setSelectedFilters({});
    setPriceRange({ min: 25000, max: 500000 });
  }, [category, brand]);

  // Initialize with initial filters
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      setSelectedFilters(initialFilters);
      setPriceRange(initialFilters.priceRange as PriceRange || { min: 25000, max: 500000 });
    }
  }, [initialFilters]);

  // Notify parent when filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        category: category || '',
        brand: brand,
        priceRange: priceRange,
        filters: selectedFilters,
        activeCount: getActiveFiltersCount()
      });
    }
  }, [selectedFilters, priceRange, category, brand, onFiltersChange]);

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
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
    setHasChanges(true);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string): void => {
    const numValue = parseInt(value) || 0;
    setPriceRange(prev => ({
      ...prev,
      [type]: numValue
    }));
    setHasChanges(true);
  };

  const applyPriceFilter = (): void => {
    setSelectedFilters(prev => ({
      ...prev,
      priceRange
    }));
    
    if (onApplyFilters) {
      onApplyFilters({
        category: category || '',
        brand,
        priceRange,
        filters: selectedFilters,
        activeCount: getActiveFiltersCount()
      });
    }
  };

  const applyAllFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        category: category || '',
        brand,
        priceRange,
        filters: selectedFilters,
        activeCount: getActiveFiltersCount()
      });
    }
    setHasChanges(false);
  };

  const clearAllFilters = (): void => {
    setSelectedFilters({});
    setPriceRange({ min: 25000, max: 500000 });
    if (onApplyFilters) {
      onApplyFilters({
        category: category || '',
        brand,
        priceRange: { min: 25000, max: 500000 },
        filters: {},
        activeCount: 0
      });
    }
    setHasChanges(false);
  };

  const clearFilterType = (filterType: string): void => {
    setSelectedFilters(prev => {
      const { [filterType]: _, ...rest } = prev;
      return rest;
    });
    setHasChanges(true);
  };

  const getActiveFiltersCount = (): number => {
    return Object.entries(selectedFilters).reduce((count, [key, values]) => {
      if (key === 'priceRange') return count + 1;
      return count + (Array.isArray(values) ? values.length : 0);
    }, 0);
  };

  // Price Range Component
  const PriceRangeFilter = ({ priceConfig }: { priceConfig: RangeFilterConfig }) => {
    const { min: configMin, max: configMax, currency } = priceConfig;
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
    const [localPriceRange, setLocalPriceRange] = useState(priceRange);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      setLocalPriceRange(priceRange);
    }, [priceRange]);

    const calculatePercentage = (value: number) => {
      return ((value - configMin) / (configMax - configMin)) * 100;
    };

    const minPercentage = calculatePercentage(localPriceRange.min);
    const maxPercentage = calculatePercentage(localPriceRange.max);

    const handleSliderChange = (type: 'min' | 'max', value: string) => {
      const numValue = parseInt(value);
      if (type === 'min') {
        if (numValue < localPriceRange.max) {
          setLocalPriceRange(prev => ({ ...prev, min: numValue }));
          if (!isDragging) {
            handlePriceChange('min', value);
          }
        }
      } else {
        if (numValue > localPriceRange.min) {
          setLocalPriceRange(prev => ({ ...prev, max: numValue }));
          if (!isDragging) {
            handlePriceChange('max', value);
          }
        }
      }
    };

    const handleDragEnd = (type: 'min' | 'max') => {
      setIsDragging(null);
      setIsAnimating(true);
      handlePriceChange(type, type === 'min' ? localPriceRange.min.toString() : localPriceRange.max.toString());
      setTimeout(() => setIsAnimating(false), 300);
    };
    
    return (
      <div className="px-2 mt-3 w-full">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 min-w-0">
            <input
              type="number"
              placeholder={`${currency} ${configMin.toLocaleString()}`}
              value={localPriceRange.min}
              onChange={(e) => handleSliderChange('min', e.target.value)}
              min={configMin}
              max={configMax}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <span className="text-gray-500 py-2 shrink-0">to</span>
          <div className="flex-1 min-w-0">
            <input
              type="number"
              placeholder={`${currency} ${configMax.toLocaleString()}`}
              value={localPriceRange.max}
              onChange={(e) => handleSliderChange('max', e.target.value)}
              min={configMin}
              max={configMax}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Price Range Slider */}
        <div className="relative mb-4 pt-2 px-2 md:px-0">
          <div 
            className={`absolute h-1 bg-gray-200 rounded-full w-full transition-all duration-300 ${isAnimating ? 'ease-out' : ''}`}
            style={{
              background: `linear-gradient(to right, 
                #e5e7eb 0%, 
                #e5e7eb ${minPercentage}%, 
                #3b82f6 ${minPercentage}%, 
                #3b82f6 ${maxPercentage}%, 
                #e5e7eb ${maxPercentage}%, 
                #e5e7eb 100%)`
            }}
          />
          <input
            type="range"
            min={configMin}
            max={configMax}
            value={localPriceRange.min}
            onChange={(e) => handleSliderChange('min', e.target.value)}
            onMouseDown={() => setIsDragging('min')}
            onMouseUp={() => handleDragEnd('min')}
            onTouchStart={() => setIsDragging('min')}
            onTouchEnd={() => handleDragEnd('min')}
            className={`absolute w-full h-1 appearance-none bg-transparent pointer-events-none transition-all duration-300 ${isAnimating ? 'ease-out' : ''}`}
            style={{
              WebkitAppearance: 'none',
              zIndex: isDragging === 'min' ? 2 : 1
            }}
          />
          <input
            type="range"
            min={configMin}
            max={configMax}
            value={localPriceRange.max}
            onChange={(e) => handleSliderChange('max', e.target.value)}
            onMouseDown={() => setIsDragging('max')}
            onMouseUp={() => handleDragEnd('max')}
            onTouchStart={() => setIsDragging('max')}
            onTouchEnd={() => handleDragEnd('max')}
            className={`absolute w-full h-1 appearance-none bg-transparent pointer-events-none transition-all duration-300 ${isAnimating ? 'ease-out' : ''}`}
            style={{
              WebkitAppearance: 'none',
              zIndex: isDragging === 'max' ? 2 : 1
            }}
          />
        </div>
        
        <button
          onClick={applyPriceFilter}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Apply
        </button>

        <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            pointer-events: all;
            width: 20px;
            height: 20px;
            background: #fff;
            border: 2px solid #3b82f6;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.15s ease;
          }

          input[type='range']::-moz-range-thumb {
            pointer-events: all;
            width: 20px;
            height: 20px;
            background: #fff;
            border: 2px solid #3b82f6;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.15s ease;
          }

          input[type='range']::-webkit-slider-thumb:hover,
          input[type='range']::-webkit-slider-thumb:active {
            background: #3b82f6;
            transform: scale(1.1);
            box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
          }

          input[type='range']::-moz-range-thumb:hover,
          input[type='range']::-moz-range-thumb:active {
            background: #3b82f6;
            transform: scale(1.1);
            box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
          }

          input[type='range']:focus {
            outline: none;
          }

          input[type='range']::-webkit-slider-runnable-track,
          input[type='range']::-moz-range-track {
            -webkit-appearance: none;
            background: transparent;
            border: none;
            transition: all 0.3s ease;
          }

          .smooth-slider {
            transition: all 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  };

  // Input Filter Component
  const InputFilter = ({ options, filterKey, height }: { options: string[], filterKey: string, height: number }) => {
    const hasActiveFilters = Array.isArray(selectedFilters[filterKey]) && (selectedFilters[filterKey] as string[]).length > 0;
    
    return (
      <div className="px-2 mt-3">
        <div 
          className="space-y-1 overflow-y-auto custom-scrollbar"
          style={{ maxHeight: `${height}px` }}
        >
          {options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-md p-1 transition-colors">
              <input
                type="checkbox"
                checked={Array.isArray(selectedFilters[filterKey]) && (selectedFilters[filterKey] as string[]).includes(option) || false}
                onChange={() => handleFilterChange(filterKey, option)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
              />
              <span className="text-sm text-gray-700 hover:text-gray-900 flex-1 select-none">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const FilterSection = ({ 
    title, 
    config, 
    sectionKey,
    selectedFilters 
  }: { 
    title: string, 
    config: FilterConfig, 
    sectionKey: string,
    selectedFilters: SelectedFilters 
  }) => {
    const hasActiveFilters = Array.isArray(selectedFilters[sectionKey]) && (selectedFilters[sectionKey] as string[]).length > 0;

    return (
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between w-full py-3 px-2">
          <button
            onClick={() => toggleSection(sectionKey)}
            className="flex-1 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{title}</span>
              {hasActiveFilters && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {Array.isArray(selectedFilters[sectionKey]) ? (selectedFilters[sectionKey] as string[]).length : 0}
                </span>
              )}
            </div>
            <div>
              {expandedSections[sectionKey] ? 
                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                <ChevronDown className="w-4 h-4 text-gray-500" />
              }
            </div>
          </button>
          {hasActiveFilters && config.type !== 'range' && (
            <div className="ml-2">
              <button
                onClick={() => clearFilterType(sectionKey)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Clear this filter"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {expandedSections[sectionKey] && (
          <div>
            {config.type === 'range' ? (
              <PriceRangeFilter priceConfig={config} />
            ) : (
              <InputFilter 
                options={config.options} 
                filterKey={sectionKey}
                height={config.height}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
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
  }

  // Show message when no category is selected
  if (!category && !brand) {
    return (
      <div className={`w-80 bg-white border-r border-gray-200 h-screen ${className}`}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="p-6 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">Select a category to view filters</p>
          <p className="text-gray-400 text-sm mt-2">Choose from laptops, keyboards, mice, or monitors</p>
        </div>
      </div>
    );
  }

  // Show message when no filters are available
  if (Object.keys(currentFilters).length === 0) {
    return (
      <div className={`w-80 bg-white border-r border-gray-200 h-screen ${className}`}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          <p className="text-sm text-gray-500 capitalize mt-1">{category?.replace('-', ' ') || brand}</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-500">No filters available for this category</p>
          <p className="text-gray-400 text-sm mt-2">Filters will be added soon</p>
        </div>
      </div>
    );
  }

  const categoryDisplay = brand 
    ? `${brand.charAt(0).toUpperCase() + brand.slice(1)} Products`
    : category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Products';

  return (
    <div className={`w-[300px] md:w-[300px] lg:w-80 bg-white border-r border-gray-200 overflow-y-auto ${className}`} style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        <p className="text-sm text-gray-600 mt-1">
          {categoryDisplay} • {getActiveFiltersCount()} active
        </p>
      </div>

      {/* Filters */}
      <div className="p-6 space-y-4">
        {Object.entries(currentFilters).map(([sectionKey, config]) => (
          <FilterSection 
            key={sectionKey} 
            title={sectionKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
            config={config} 
            sectionKey={sectionKey}
            selectedFilters={selectedFilters}
          />
        ))}
      </div>

      {/* Apply/Clear All Buttons */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <button
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
            disabled={!hasChanges}
          >
            Clear All ({getActiveFiltersCount()})
          </button>
          <button
            onClick={applyAllFilters}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            disabled={!hasChanges}
          >
            Apply All ({getActiveFiltersCount()})
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;