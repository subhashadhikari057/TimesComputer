"use client";

import React, { useState } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";

// Types
export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "search" | "multiselect";
  options?: FilterOption[];
  placeholder?: string;
  width?: "sm" | "md" | "lg" | "xl" | "full";
}

export interface FilterValues {
  [key: string]: string | string[];
}

export interface FilterComponentProps {
  title?: string;
  description?: string;
  filters: FilterConfig[];
  values: FilterValues;
  onChange: (key: string, value: string | string[]) => void;
  onReset?: () => void;
  className?: string;
}

// Width mapping for different filter sizes
const widthClasses = {
  sm: "col-span-1",
  md: "col-span-2",
  lg: "col-span-3",
  xl: "col-span-4",
  full: "col-span-6",
};

// Enhanced Filter Component
export const FilterComponent: React.FC<FilterComponentProps> = ({
  title = "Filters",
  description,
  filters,
  values,
  onChange,
  onReset,
  className = "",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed

  const hasActiveFilters = Object.values(values).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== "" && value !== "all";
  });

  const activeFilterCount = Object.values(values).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    return count + (value !== "" && value !== "all" ? 1 : 0);
  }, 0);

  const handleReset = () => {
    filters.forEach((filter) => {
      onChange(filter.key, filter.type === "multiselect" ? [] : "");
    });
    onReset?.();
  };

  const renderSearchFilter = (filter: FilterConfig) => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder={
          filter.placeholder || `Search ${filter.label.toLowerCase()}...`
        }
        value={(values[filter.key] as string) || ""}
        onChange={(e) => onChange(filter.key, e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300"
      />
    </div>
  );

  const renderSelectFilter = (filter: FilterConfig) => (
    <select
      value={(values[filter.key] as string) || ""}
      onChange={(e) => onChange(filter.key, e.target.value)}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300"
    >
      {filter.options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const renderMultiSelectFilter = (filter: FilterConfig) => {
    const selectedValues = (values[filter.key] as string[]) || [];

    return (
      <div className="space-y-2">
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value && !selectedValues.includes(value)) {
              onChange(filter.key, [...selectedValues, value]);
            }
          }}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300"
          value=""
        >
          <option value="">Add {filter.label}</option>
          {filter.options
            ?.filter((option) => !selectedValues.includes(option.value))
            .map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>

        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedValues.map((value) => {
              const option = filter.options?.find((opt) => opt.value === value);
              return (
                <span
                  key={value}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  {option?.label || value}
                  <button
                    onClick={() => {
                      onChange(
                        filter.key,
                        selectedValues.filter((v) => v !== value)
                      );
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case "search":
        return renderSearchFilter(filter);
      case "select":
        return renderSelectFilter(filter);
      case "multiselect":
        return renderMultiSelectFilter(filter);
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFilterCount}
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            {description && (
              <p className="text-xs text-gray-500 hidden sm:block">
                {description}
              </p>
            )}
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-3 h-3 mr-1" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div
                key={filter.key}
                className={`space-y-1 ${widthClasses[filter.width || "md"]}`}
              >
                <label className="block text-xs font-medium text-gray-700">
                  {filter.label}
                </label>
                {renderFilter(filter)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
