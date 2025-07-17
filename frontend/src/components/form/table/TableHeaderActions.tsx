import React from "react";
import { Search, Trash2, Download } from "lucide-react";
import { FilterConfig } from "@/components/admin/product/filter";
import FilterComponent from "@/components/admin/product/filter";

interface TableHeaderActionsProps {
  // Search functionality
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;

  // Selection and bulk actions
  selectedItems: number[];
  onBulkDelete: () => void;
  bulkDeleteText?: string;

  // Export functionality
  onExport: () => void;
  exportText?: string;

  // Filter functionality
  filters: any;
  filterConfigs: FilterConfig[];
  onFilterChange: (key: string, value: any) => void;
  onResetFilters: () => void;
}

export const TableHeaderActions: React.FC<TableHeaderActionsProps> = ({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  selectedItems,
  onBulkDelete,

  onExport,

  filters,
  filterConfigs,
  onFilterChange,
  onResetFilters,

}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0`}
    >
      {/* Search Input */}
      <div className="relative justify-self-start">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-100 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300 focus:outline-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 md:justify-self-end">
        {selectedItems.length > 0 && (
          <button
            onClick={onBulkDelete}
            className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete ({selectedItems.length})
          </button>
        )}

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={onExport}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>

          <div className="flex-1">
            <FilterComponent
              filters={filters}
              filterConfigs={filterConfigs}
              onFilterChange={onFilterChange}
              onResetFilters={onResetFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
