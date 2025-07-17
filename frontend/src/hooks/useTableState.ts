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
  options?: Array<{ value: any; label: string }>;
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
  filters: Record<string, any>;
  sortConfig: SortConfig | null;
  selectedItems: number[];
  
  // Computed data
  processedData: T[];
  filterConfigs: FilterConfig[];
  
  // Handlers
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (key: string, value: any) => void;
  handleResetFilters: () => void;
  handleSort: (columnId: string) => void;
  handleSelectAll: () => void;
  handleSelectItem: (index: number) => void;
  handleBulkDelete: () => void;
  
  // Utilities
  generateFilterOptions: (field: keyof T) => Array<{ value: any; label: string }>;
}

export function useTableData<T extends Record<string, any>>({
  data,
  columns,
  defaultSort
}: UseTableDataProps<T>): UseTableDataReturn<T> {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
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

  // Generate filter options from data
  const generateFilterOptions = (field: keyof T) => {
    const uniqueValues = [...new Set(data.map(item => item[field]))];
    return uniqueValues.map(value => ({
      value: value,
      label: String(value)
    }));
  };

  // Generate filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => {
    return filterableFields.map(field => ({
      key: field.key,
      label: field.label,
      type: field.type || 'select',
      options: (field.type || 'select') === 'select' ? generateFilterOptions(field.key) : undefined
    }));
  }, [data, filterableFields]);

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter handlers
  const handleFilterChange = (key: string, value: any) => {
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
    const selectedData = selectedItems.map(index => processedData[index]);
    console.log("Selected items for bulk delete:", selectedData);
    // TODO: Implement actual bulk delete logic
    setSelectedItems([]);
  };

  // Process data (filter, search, sort)
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        result = result.filter(item => item[key] === value);
      }
    });

    // Apply search
    if (searchTerm.trim()) {
      const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
      
      result = result.filter((item) => {
        return searchableFields.some(field => {
          const fieldValue = item[field];
          return fieldValue && String(fieldValue).toLowerCase().includes(lowercaseSearchTerm);
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
          // Fallback to string comparison
          comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
        }

        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [data, filters, searchTerm, sortConfig, searchableFields]);

  // Clear selection when data changes
  useMemo(() => {
    setSelectedItems([]);
  }, [filters, searchTerm]);

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

