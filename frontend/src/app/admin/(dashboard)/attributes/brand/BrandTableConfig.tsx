import { useState } from "react";
import { TableColumn, TableHeader } from "@/components/form/table/table";
import {
  Package,
  Trash2,
  Award,
  CheckCircle,
  XCircle,
  ImageIcon,
  Calendar,
} from "lucide-react";
import { FilterConfig } from "@/components/admin/product/filter";
import { useFilters } from "@/hooks/useFilter";
import { useSort, createSortableColumn } from "@/hooks/useSort";
import { TableHeaderActions } from "@/components/form/table/TableHeaderActions";

// Type definitions
export interface Brand {
  id: number;
  name: string;
  description: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
  parentId: number | null;
  sortOrder: number;
}

// Filter configuration
export const brandFilterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "radio",
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
    options: [
      { value: "all", label: "All Brands" },
      { value: "high", label: "High (50+)" },
      { value: "medium", label: "Medium (10-49)" },
      { value: "low", label: "Low (1-9)" },
      { value: "empty", label: "Empty (0)" },
    ],
  },
];

// Initial filter state
export const initialBrandFilters = {
  search: "",
  status: "all",
  productCount: "all",
};

// Sortable columns configuration
export const brandSortableColumns = {
  brand: createSortableColumn("brand", (brand: Brand) => brand.name, "string"),
  products: createSortableColumn(
    "products",
    (brand: Brand) => brand.productCount,
    "number"
  ),
  status: createSortableColumn(
    "status",
    (brand: Brand) => brand.isActive,
    "boolean"
  ),
  created: createSortableColumn(
    "created",
    (brand: Brand) => brand.createdAt,
    "date"
  ),
  updated: createSortableColumn(
    "updated",
    (brand: Brand) => brand.updatedAt,
    "date"
  ),
};

// Filter function
export const filterBrands = (brands: Brand[], filters: any) => {
  return brands.filter((brand) => {
    const searchTerm = filters.search as string;
    const filterStatus = filters.status as string;
    const filterProductCount = filters.productCount as string;

    const matchesSearch =
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && brand.isActive) ||
      (filterStatus === "inactive" && !brand.isActive);

    const matchesProductCount = (() => {
      if (filterProductCount === "all") return true;
      const count = brand.productCount;
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
export const getBrandTableColumns = (): TableColumn<Brand>[] => [
  {
    id: "brand",
    label: "Brand",
    width: "300px",
    sortable: true,
    render: (brand) => (
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
          <Award className="h-6 w-6 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {brand.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {brand.description}
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
    render: (brand) => (
      <div className="flex items-center space-x-2">
        <Package className="w-4 h-4 text-gray-400" />
        <span
          className={`text-sm font-medium ${
            brand.productCount === 0
              ? "text-red-600"
              : brand.productCount < 10
              ? "text-yellow-600"
              : "text-gray-900"
          }`}
        >
          {brand.productCount}
        </span>
      </div>
    ),
  },
  {
    id: "image",
    label: "Image",
    width: "120px",
    sortable: false,
    render: (brand) => (
      <div className="flex items-center space-x-2">
        <ImageIcon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">Available</span>
      </div>
    ),
  },
  {
    id: "status",
    label: "Status",
    width: "120px",
    sortable: true,
    render: (brand) => (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          brand.isActive
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {brand.isActive ? (
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
    render: (brand) => (
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(brand.createdAt).toLocaleDateString()}
      </div>
    ),
  },
];

// Table header configuration
export const getBrandTableHeader = (
  filters: any,
  updateFilter: (key: string, value: any) => void,
  resetFilters: () => void,
  selectedBrands: number[],
  onBulkDelete: () => void,
  onExport: () => void
): TableHeader => ({
  headerActions: (
    <TableHeaderActions
      searchPlaceholder="Search brands..."
      searchValue={(filters.search as string) || ""}
      onSearchChange={(value) => updateFilter("search", value)}
      selectedItems={selectedBrands}
      onBulkDelete={onBulkDelete}
      bulkDeleteText="Delete"
      onExport={onExport}
      exportText="Export"
      filters={filters}
      filterConfigs={brandFilterConfigs}
      onFilterChange={updateFilter}
      onResetFilters={resetFilters}
   
    />
  ),
});

// Custom hook for brand table logic
export const useBrandTable = (brands: Brand[]) => {
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);

  // Initialize filters
  const { filters, updateFilter, resetFilters } = useFilters({
    initialFilters: initialBrandFilters,
  });

  // Filter brands
  const filteredBrands = filterBrands(brands, filters);

  // Use sorting hook with initial sort by name
  const {
    sortedData: sortedBrands,
    sortConfig,
    handleSort,
  } = useSort(filteredBrands, brandSortableColumns, {
    column: "brand",
    direction: "asc",
  });

  // Selection handlers
  const handleSelectAll = () => {
    setSelectedBrands(
      selectedBrands.length === sortedBrands.length
        ? []
        : sortedBrands.map((b) => b.id)
    );
  };

  const handleSelectBrand = (brandId: number) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const clearSelections = () => {
    setSelectedBrands([]);
  };

  return {
    // Data
    sortedBrands,
    selectedBrands,

    // Filters
    filters,
    updateFilter,
    resetFilters,

    // Sorting
    sortConfig,
    handleSort,

    // Selection
    handleSelectAll,
    handleSelectBrand,
    clearSelections,
  };
};

// Statistics calculation helper
export const calculateBrandStats = (brands: Brand[]) => {
  const activeCount = brands.filter((b) => b.isActive).length;
  const totalProducts = brands.reduce((sum, b) => sum + b.productCount, 0);
  const averageProducts = Math.round(totalProducts / brands.length);

  return {
    totalBrands: brands.length,
    activeCount,
    totalProducts,
    averageProducts,
    activePercentage: Math.round((activeCount / brands.length) * 100),
  };
};
