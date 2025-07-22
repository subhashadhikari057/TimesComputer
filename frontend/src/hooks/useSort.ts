import { useState, useMemo } from 'react';

// Types
export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export interface SortableColumn<T = unknown> {
  key: string;
  getValue: (item: T) => unknown;
  type?: 'string' | 'number' | 'date' | 'boolean';
}

// Generic sort function
export function sortData<T>(
  data: T[],
  sortConfig: SortConfig,
  sortableColumns: Record<string, SortableColumn<T>>
): T[] {
  if (!sortConfig.column || !sortConfig.direction) {
    return data;
  }

  const column = sortableColumns[sortConfig.column];
  if (!column) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aValue = column.getValue(a);
    const bValue = column.getValue(b);
    
    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
    if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
    
    // Type-specific comparison
    let comparison = 0;
    
    switch (column.type) {
      case 'string':
        comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
        break;
      case 'number':
        comparison = Number(aValue) - Number(bValue);
        break;
      case 'date':
        comparison = new Date(aValue as string | Date).getTime() - new Date(bValue as string | Date).getTime();
        break;
      case 'boolean':
        comparison = (aValue ? 1 : 0) - (bValue ? 1 : 0);
        break;
      default:
        // Auto-detect type and compare
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          comparison = (aValue ? 1 : 0) - (bValue ? 1 : 0);
        } else {
          comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
        }
    }
    
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}

// Custom hook for sorting
export function useSort<T>(
  data: T[],
  sortableColumns: Record<string, SortableColumn<T>>,
  initialSort?: SortConfig
) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(
    initialSort || { column: '', direction: null }
  );

  const handleSort = (columnId: string) => {
    setSortConfig(prev => {
      if (prev.column === columnId) {
        // Cycle through: asc -> desc -> null -> asc
        const newDirection: SortDirection = 
          prev.direction === 'asc' ? 'desc' :
          prev.direction === 'desc' ? null : 'asc';
        return { column: columnId, direction: newDirection };
      }
      return { column: columnId, direction: 'asc' };
    });
  };

  const sortedData = useMemo(() => {
    return sortData(data, sortConfig, sortableColumns);
  }, [data, sortConfig, sortableColumns]);

  const resetSort = () => {
    setSortConfig({ column: '', direction: null });
  };

  return {
    sortedData,
    sortConfig,
    handleSort,
    resetSort,
    setSortConfig
  };
}

// Helper function to create sortable column definitions
export function createSortableColumn<T>(
  key: string,
  getValue: (item: T) => unknown,
  type?: 'string' | 'number' | 'date' | 'boolean'
): SortableColumn<T> {
  return { key, getValue, type };
}

// Utility function for common sorting scenarios
export const commonSortColumns = {
  // String columns
  name: <T>(getValue: (item: T) => string) => 
    createSortableColumn('name', getValue, 'string'),
  
  title: <T>(getValue: (item: T) => string) => 
    createSortableColumn('title', getValue, 'string'),
  
  // Number columns
  count: <T>(getValue: (item: T) => number) => 
    createSortableColumn('count', getValue, 'number'),
  
  price: <T>(getValue: (item: T) => number) => 
    createSortableColumn('price', getValue, 'number'),
  
  // Date columns
  createdAt: <T>(getValue: (item: T) => string | Date) => 
    createSortableColumn('createdAt', getValue, 'date'),
  
  updatedAt: <T>(getValue: (item: T) => string | Date) => 
    createSortableColumn('updatedAt', getValue, 'date'),
  
  // Boolean columns
  isActive: <T>(getValue: (item: T) => boolean) => 
    createSortableColumn('isActive', getValue, 'boolean'),
  
  isPublished: <T>(getValue: (item: T) => boolean) => 
    createSortableColumn('isPublished', getValue, 'boolean'),
};