import { useState } from "react";
import {
  TableColumn,
  TableHeader,
} from "@/components/form/table/table";
import {
  Package,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Download,
  Search,
} from "lucide-react";
import { FilterConfig } from "@/components/admin/product/filter";
import FilterComponent from "@/components/admin/product/filter";
import { useFilters } from "@/hooks/useFilter";
import { useSort, createSortableColumn } from "@/hooks/useSort";

// Type definitions
export interface Color {
  id: number;
  name: string;
  hexCode: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
}

// Filter configuration
export const colorFilterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "radio",
    gridSpan: 2,
    options: [
      { value: "all", label: "All Status" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
  {
    key: "productCount",
    label: "Product Count",
    type: "select",
    gridSpan: 2,
    options: [
      { value: "all", label: "All Colors" },
      { value: "high", label: "High (50+)" },
      { value: "medium", label: "Medium (10-49)" },
      { value: "low", label: "Low (1-9)" },
      { value: "empty", label: "Empty (0)" },
    ],
  },
];

// Initial filter state
export const initialColorFilters = {
  search: "",
  status: "all",
  productCount: "all",
};

// Sortable columns configuration
export const colorSortableColumns = {
  color: createSortableColumn(
    'color',
    (color: Color) => color.name,
    'string'
  ),
  products: createSortableColumn(
    'products',
    (color: Color) => color.productCount,
    'number'
  ),
  hexCode: createSortableColumn(
    'hexCode',
    (color: Color) => color.hexCode,
    'string'
  ),
  status: createSortableColumn(
    'status',
    (color: Color) => color.isActive,
    'boolean'
  ),
  created: createSortableColumn(
    'created',
    (color: Color) => color.createdAt,
    'date'
  ),
  updated: createSortableColumn(
    'updated',
    (color: Color) => color.updatedAt,
    'date'
  ),
};

// Filter function
export const filterColors = (colors: Color[], filters: any) => {
  return colors.filter((color) => {
    const searchTerm = filters.search as string;
    const filterStatus = filters.status as string;
    const filterProductCount = filters.productCount as string;

    const matchesSearch =
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.hexCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && color.isActive) ||
      (filterStatus === "inactive" && !color.isActive);

    const matchesProductCount = (() => {
      if (filterProductCount === "all") return true;
      const count = color.productCount;
      switch (filterProductCount) {
        case "high":
          return count >= 50;
        case "medium":
          return count >= 10 && count <= 49;
        case "low":
          return count >= 1 && count <= 9;
        case "empty":
          return count === 0;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesProductCount;
  });
};

// Table columns configuration
export const getColorTableColumns = (): TableColumn<Color>[] => [
  {
    id: "color",
    label: "Color",
    width: "300px",
    sortable: true,
    render: (color) => (
      <div className="flex items-center space-x-4">
        <div
          className="h-12 w-12 rounded-lg border border-gray-300 shadow-sm"
          style={{ backgroundColor: color.hexCode }}
        ></div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {color.name}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {color.hexCode}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "products",
    label: "Products",
    width: "120px",
    sortable: true,
    render: (color) => (
      <div className="flex items-center space-x-2">
        <Package className="w-4 h-4 text-gray-400" />
        <span
          className={`text-sm font-medium ${
            color.productCount === 0
              ? "text-red-600"
              : color.productCount < 10
              ? "text-yellow-600"
              : "text-gray-900"
          }`}
        >
          {color.productCount}
        </span>
      </div>
    ),
  },
  {
    id: "hexCode",
    label: "Hex Code",
    width: "120px",
    sortable: true,
    render: (color) => (
      <div className="text-sm font-mono text-gray-900">{color.hexCode}</div>
    ),
  },
  {
    id: "status",
    label: "Status",
    width: "120px",
    sortable: true,
    render: (color) => (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          color.isActive
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {color.isActive ? (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </>
        ) : (
          <>
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </>
        )}
      </span>
    ),
  },
  {
    id: "created",
    label: "Created",
    width: "120px",
    sortable: true,
    render: (color) => (
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(color.createdAt).toLocaleDateString()}
      </div>
    ),
  },
];

// Table header configuration
export const getColorTableHeader = (
  filters: any,
  updateFilter: (key: string, value: any) => void,
  resetFilters: () => void,
  selectedColors: number[],
  onBulkDelete: () => void,
  onExport: () => void
): TableHeader => ({
  headerActions: (
    <div className="flex items-center justify-between">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search colors..."
          value={(filters.search as string) || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300"
        />
      </div>

      <div className="flex items-center space-x-2">
        {selectedColors.length > 0 && (
          <button
            onClick={onBulkDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete ({selectedColors.length})
          </button>
        )}
        <button
          onClick={onExport}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </button>

        <FilterComponent
          filters={filters}
          filterConfigs={colorFilterConfigs}
          onFilterChange={updateFilter}
          onResetFilters={resetFilters}
          buttonText="Filters"
          dropdownWidth="w-96"
          dropdownPosition="right"
        />
      </div>
    </div>
  ),
});

// Custom hook for color table logic
export const useColorTable = (colors: Color[]) => {
  const [selectedColors, setSelectedColors] = useState<number[]>([]);

  // Initialize filters
  const { filters, updateFilter, resetFilters } = useFilters({
    initialFilters: initialColorFilters,
  });

  // Filter colors
  const filteredColors = filterColors(colors, filters);

  // Use sorting hook with initial sort by name
  const { sortedData: sortedColors, sortConfig, handleSort } = useSort(
    filteredColors,
    colorSortableColumns,
    { column: 'color', direction: 'asc' }
  );

  // Selection handlers
  const handleSelectAll = () => {
    setSelectedColors(
      selectedColors.length === sortedColors.length
        ? []
        : sortedColors.map((c) => c.id)
    );
  };

  const handleSelectColor = (colorId: number) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const clearSelections = () => {
    setSelectedColors([]);
  };

  return {
    // Data
    sortedColors,
    selectedColors,
    
    // Filters
    filters,
    updateFilter,
    resetFilters,
    
    // Sorting
    sortConfig,
    handleSort,
    
    // Selection
    handleSelectAll,
    handleSelectColor,
    clearSelections,
  };
};

// Statistics calculation helper
export const calculateColorStats = (colors: Color[]) => {
  const activeCount = colors.filter((c) => c.isActive).length;
  const totalProducts = colors.reduce((sum, c) => sum + c.productCount, 0);
  const averageProducts = Math.round(totalProducts / colors.length);

  return {
    totalColors: colors.length,
    activeCount,
    totalProducts,
    averageProducts,
    activePercentage: Math.round((activeCount / colors.length) * 100),
  };
};