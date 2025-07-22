// hooks/useTableData.ts
import { useState, useMemo } from 'react';

// Types
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'number';
  options?: Array<{ value: unknown; label: string }>;
}

export interface UseTableDataProps<T> {
  data: T[];
  columns: Array<{
    id: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
  }>;
  defaultSort?: SortConfig;
}

export interface UseTableDataReturn<T> {
  // State
  searchTerm: string;
  filters: Record<string, unknown>;
  sortConfig: SortConfig | null;
  selectedItems: number[];
  
  // Computed data
  processedData: T[];
  filterConfigs: FilterConfig[];
  
  // Handlers
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (key: string, value: unknown) => void;
  handleResetFilters: () => void;
  handleSort: (columnId: string) => void;
  handleSelectAll: () => void;
  handleSelectItem: (index: number) => void;
  handleBulkDelete: () => void;
  
  // Utilities
  generateFilterOptions: (field: keyof T) => Array<{ value: unknown; label: string }>;
}

export function useTableData<T extends Record<string, unknown>>({
  data,
  columns,
  defaultSort
}: UseTableDataProps<T>): UseTableDataReturn<T> {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(defaultSort || null);

  // Extract searchable fields from columns
  const searchableFields = useMemo(() => 
    columns.filter(col => col.searchable !== false).map(col => col.id), 
    [columns]
  );

  // Extract filterable fields from columns
  const filterableFields = useMemo(() => 
    columns.filter(col => col.filterable === true).map(col => ({
      key: col.id,
      label: col.label,
      type: 'select' as const
    })), 
    [columns]
  );

  // Helper function to extract display value from nested objects
  const getDisplayValue = (item: T, field: string) => {
    const value = item[field];
    
    if (value === null || value === undefined) {
      return 'No ' + field.charAt(0).toUpperCase() + field.slice(1);
    }
    
    // Handle nested objects (like category.name, brand.name)
    if (typeof value === 'object' && value !== null) {
      const obj = value as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      return String(obj.name || obj.label || obj.title || value);
    }
    
    return String(value);
  };

  // Helper function to extract filter value from nested objects
  const getFilterValue = (item: T, field: string) => {
    const value = item[field];
    
    if (value === null || value === undefined) {
      return null;
    }
    
    // For nested objects, use the name property for comparison
    if (typeof value === 'object' && value !== null) {
      const obj = value as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      return obj.name || obj.label || obj.title || obj.id || String(value);
    }
    
    return value;
  };

  // Generate filter options from data
  const generateFilterOptions = (field: keyof T) => {
    const uniqueValues = new Set();
    const options: Array<{ value: unknown; label: string }> = [];
    
    data.forEach(item => {
      const displayValue = getDisplayValue(item, field as string);
      const filterValue = getFilterValue(item, field as string);
      
      if (filterValue !== null && !uniqueValues.has(filterValue)) {
        uniqueValues.add(filterValue);
        options.push({
          value: filterValue,
          label: displayValue
        });
      }
    });
    
    return options.sort((a, b) => a.label.localeCompare(b.label));
  };

  // Generate filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => {
    return filterableFields.map(field => ({
      key: field.key,
      label: field.label,
      type: field.type || 'select',
      options: (field.type || 'select') === 'select' ? generateFilterOptions(field.key) : undefined
    }));
  }, [data, filterableFields, generateFilterOptions]);

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter handlers
  const handleFilterChange = (key: string, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  // Sort handler
  const handleSort = (columnId: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === columnId && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key: columnId, direction });
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedItems.length === processedData.length) {
      setSelectedItems([]);
    } else {
      const allIndices = processedData.map((_, index) => index);
      setSelectedItems(allIndices);
    }
  };

  const handleSelectItem = (index: number) => {
    setSelectedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(item => item !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleBulkDelete = () => {
    // const selectedData = selectedItems.map(index => processedData[index]);
    // TODO: Implement actual bulk delete logic
    setSelectedItems([]);
  };

  // Process data (filter, search, sort)
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        result = result.filter(item => {
          const itemFilterValue = getFilterValue(item, key);
          return itemFilterValue === value;
        });
      }
    });

    // Apply search
    if (searchTerm.trim()) {
      const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
      
      result = result.filter((item) => {
        return searchableFields.some(field => {
          const displayValue = getDisplayValue(item, field);
          return displayValue && displayValue.toLowerCase().includes(lowercaseSearchTerm);
        });
      });
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        let comparison = 0;
        
        // Handle different data types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Handle price strings that start with $
          if (aValue.startsWith('$') && bValue.startsWith('$')) {
            const aPrice = parseFloat(aValue.replace('$', ''));
            const bPrice = parseFloat(bValue.replace('$', ''));
            comparison = aPrice - bPrice;
          } else {
            comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
          }
        } else {
          // For objects, use the display value for comparison
          const aDisplay = getDisplayValue(a, sortConfig.key);
          const bDisplay = getDisplayValue(b, sortConfig.key);
          comparison = aDisplay.toLowerCase().localeCompare(bDisplay.toLowerCase());
        }

        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [data, filters, searchTerm, sortConfig, searchableFields]);

  // Clear selection when data changes
  useMemo(() => {
    setSelectedItems([]);
  }, []);

  return {
    // State
    searchTerm,
    filters,
    sortConfig,
    selectedItems,
    
    // Computed data
    processedData,
    filterConfigs,
    
    // Handlers
    handleSearchChange,
    handleFilterChange,
    handleResetFilters,
    handleSort,
    handleSelectAll,
    handleSelectItem,
    handleBulkDelete,
    
    // Utilities
    generateFilterOptions,
  };
}