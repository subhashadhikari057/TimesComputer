// Hook for managing filter state
"use client";

import { useState } from "react";

// Define the FilterValues type (add this if not defined elsewhere)
interface FilterValues {
  [key: string]: string | string[];
}

export const useFilters = (initialValues: FilterValues = {}) => {
  const [filters, setFilters] = useState<FilterValues>(initialValues);

  const updateFilter = (key: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters(initialValues);
  };

  const resetFilter = (key: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: Array.isArray(prev[key]) ? [] : ''
    }));
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    resetFilter,
    setFilters
  };
};