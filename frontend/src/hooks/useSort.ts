import { useState, useMemo } from 'react';

// Types
export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export interface SortableColumn {
  key: string;
  getValue: (item: any) => any;
  type?: 'string' | 'number' | 'date' | 'boolean';
}

// Generic sort function
export function sortData<T>(
  data: T[],
  sortConfig: SortConfig,
  sortableColumns: Record<string, SortableColumn>
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
        comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
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
  sortableColumns: Record<string, SortableColumn>,
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
export function createSortableColumn(
  key: string,
  getValue: (item: any) => any,
  type?: 'string' | 'number' | 'date' | 'boolean'
): SortableColumn {
  return { key, getValue, type };
}

// Utility function for common sorting scenarios
export const commonSortColumns = {
  // String columns
  name: (getValue: (item: any) => string) => 
    createSortableColumn('name', getValue, 'string'),
  
  title: (getValue: (item: any) => string) => 
    createSortableColumn('title', getValue, 'string'),
  
  // Number columns
  count: (getValue: (item: any) => number) => 
    createSortableColumn('count', getValue, 'number'),
  
  price: (getValue: (item: any) => number) => 
    createSortableColumn('price', getValue, 'number'),
  
  // Date columns
  createdAt: (getValue: (item: any) => string | Date) => 
    createSortableColumn('createdAt', getValue, 'date'),
  
  updatedAt: (getValue: (item: any) => string | Date) => 
    createSortableColumn('updatedAt', getValue, 'date'),
  
  // Boolean columns
  isActive: (getValue: (item: any) => boolean) => 
    createSortableColumn('isActive', getValue, 'boolean'),
  
  isPublished: (getValue: (item: any) => boolean) => 
    createSortableColumn('isPublished', getValue, 'boolean'),
};