"use client";

import React, { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";

// Types for filter configuration
export interface FilterOption {
  value: string | number;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "radio" | "checkbox" | "text" | "number" | "date";
  options?: FilterOption[];
}

export interface FilterComponentProps {
  filters: Record<string, any>;
  filterConfigs: FilterConfig[];
  onFilterChange: (key: string, value: any) => void;
  onResetFilters?: () => void;
  showResetButton?: boolean;
  dropdownWidth?: string;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  filters,
  filterConfigs,
  onFilterChange,
  onResetFilters,
  showResetButton = true,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const inputBaseClass =
    "px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm";

  const renderFilterInput = (config: FilterConfig) => {
    const value = filters[config.key] || "";
    switch (config.type) {
      case "select":
        return (
          <div className="w-full">
            <Dropdown
              value={value}
              onChange={(selectedValue) =>
                onFilterChange(config.key, selectedValue)
              }
              options={config.options || []}
              placeholder="Select an option"
              size="sm"
            />
          </div>
        );

      case "radio":
        return (
          <div className="grid grid-cols-2 gap-2">
            {config.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={config.key}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onFilterChange(config.key, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {config.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v) => v !== option.value);
                    onFilterChange(config.key, newValues);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "text":
      case "number":
      case "date":
        return (
          <input
            type={config.type}
            value={value}
            onChange={(e) => onFilterChange(config.key, e.target.value)}
            className={`w-full ${inputBaseClass}`}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative`}>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
          showFilters ? "bg-gray-50 border-gray-400" : ""
        } `}
      >
        <Filter className="h-4 w-4 mr-2" />
        <span>Filters</span>
        <ChevronDown
          className={`h-4 w-4 ml-2 transition-transform duration-200 ${
            showFilters ? "rotate-180" : ""
          }`}
        />
      </button>

      {showFilters && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowFilters(false)}
          />

          {/* Desktop Dropdown */}
          <div
            className={`hidden md:flex absolute top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 right-0 max-h-[80vh] flex-col mb-16`}
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Options
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterConfigs.map((config) => (
                  <div
                    key={config.key}
                    className={config.type === "radio" ? "col-span-2" : ""}
                  >
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                      {config.label}
                    </label>
                    {renderFilterInput(config)}
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Footer */}
            {showResetButton && (
              <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <button
                  onClick={onResetFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Mobile Sidebar */}
          <div
            className="md:hidden fixed top-16 right-0 bottom-0 w-80 bg-white shadow-lg z-50 flex flex-col   transform transition-transform duration-300 ease-in-out
              translate-x-0"
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Options
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-6">
                {filterConfigs.map((config) => (
                  <div key={config.key}>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                      {config.label}
                    </label>
                    {renderFilterInput(config)}
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Footer */}
            {showResetButton && (
              <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <button
                  onClick={onResetFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterComponent;