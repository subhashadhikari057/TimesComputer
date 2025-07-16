import { useState, useCallback } from 'react';

export interface UseFiltersProps {
  initialFilters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
}

export interface UseFiltersReturn {
  filters: Record<string, any>;
  updateFilter: (key: string, value: any) => void;
  resetFilters: () => void;
  setFilters: (filters: Record<string, any>) => void;
  clearFilter: (key: string) => void;
}

export const useFilters = ({ 
  initialFilters = {}, 
  onFiltersChange 
}: UseFiltersProps = {}): UseFiltersReturn => {
  const [filters, setFiltersState] = useState<Record<string, any>>(initialFilters);

  const updateFilter = useCallback((key: string, value: any) => {
    setFiltersState(prev => {
      const newFilters = { ...prev, [key]: value };
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
      return newFilters;
    });
  }, [onFiltersChange]);

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    if (onFiltersChange) {
      onFiltersChange(initialFilters);
    }
  }, [initialFilters, onFiltersChange]);

  const setFilters = useCallback((newFilters: Record<string, any>) => {
    setFiltersState(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  }, [onFiltersChange]);

  const clearFilter = useCallback((key: string) => {
    setFiltersState(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
      return newFilters;
    });
  }, [onFiltersChange]);

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters,
    clearFilter,
  };
};