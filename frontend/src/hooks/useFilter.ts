import { useState, useCallback } from 'react';

type FilterValue = string | number | boolean | string[] | number[] | null | undefined;

export interface UseFiltersProps {
  initialFilters?: Record<string, FilterValue>;
  onFiltersChange?: (filters: Record<string, FilterValue>) => void;
}

export interface UseFiltersReturn {
  filters: Record<string, FilterValue>;
  updateFilter: (key: string, value: FilterValue) => void;
  resetFilters: () => void;
  setFilters: (filters: Record<string, FilterValue>) => void;
  clearFilter: (key: string) => void;
}

export const useFilters = ({ 
  initialFilters = {}, 
  onFiltersChange 
}: UseFiltersProps = {}): UseFiltersReturn => {
  const [filters, setFiltersState] = useState<Record<string, FilterValue>>(initialFilters);

  const updateFilter = useCallback((key: string, value: FilterValue) => {
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

  const setFilters = useCallback((newFilters: Record<string, FilterValue>) => {
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