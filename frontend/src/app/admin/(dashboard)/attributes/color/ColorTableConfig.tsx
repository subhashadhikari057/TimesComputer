import { useState } from "react";
import { TableColumn, TableHeader } from "@/components/form/table/table";
import { Package, Trash2, CheckCircle, XCircle, Calendar } from "lucide-react";
import { FilterConfig } from "@/components/admin/product/filter";
import { useFilters } from "@/hooks/useFilter";
import { useSort, createSortableColumn } from "@/hooks/useSort";
import { TableHeaderActions } from "@/components/form/table/TableHeaderActions";

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
  color: createSortableColumn("color", (color: Color) => color.name, "string"),
  products: createSortableColumn(
    "products",
    (color: Color) => color.productCount,
    "number"
  ),
  hexCode: createSortableColumn(
    "hexCode",
    (color: Color) => color.hexCode,
    "string"
  ),
  status: createSortableColumn(
    "status",
    (color: Color) => color.isActive,
    "boolean"
  ),
  created: createSortableColumn(
    "created",
    (color: Color) => color.createdAt,
    "date"
  ),
  updated: createSortableColumn(
    "updated",
    (color: Color) => color.updatedAt,
    "date"
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
          <div className="text-xs text-gray-500 font-mono">{color.hexCode}</div>
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
    <TableHeaderActions
      searchPlaceholder="Search colors..."
      searchValue={(filters.search as string) || ""}
      onSearchChange={(value) => updateFilter("search", value)}
      selectedItems={selectedColors}
      onBulkDelete={onBulkDelete}
      bulkDeleteText="Delete"
      onExport={onExport}
      exportText="Export"
      filters={filters}
      filterConfigs={colorFilterConfigs}
      onFilterChange={updateFilter}
      onResetFilters={resetFilters}
      filterButtonText="Filters"
      filterDropdownWidth="w-96"
      filterDropdownPosition="right"
      layout="default"
    />
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
  const {
    sortedData: sortedColors,
    sortConfig,
    handleSort,
  } = useSort(filteredColors, colorSortableColumns, {
    column: "color",
    direction: "asc",
  });

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
