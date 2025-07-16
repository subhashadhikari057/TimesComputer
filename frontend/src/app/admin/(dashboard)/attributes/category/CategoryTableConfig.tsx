import { useState } from "react";
import { TableColumn, TableHeader } from "@/components/form/table/table";
import {
  Package,
  Trash2,
  Tag,
  CheckCircle,
  XCircle,
  ImageIcon,
  Calendar,
  Download,
  Search,
} from "lucide-react";
import { FilterConfig } from "@/components/admin/product/filter";
import FilterComponent from "@/components/admin/product/filter";
import { useFilters } from "@/hooks/useFilter";
import { useSort, createSortableColumn } from "@/hooks/useSort";

// Type definitions
export interface Category {
  id: number;
  name: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
  icon: string;
  parentId: number | null;
  sortOrder: number;
}

// Filter configuration
export const categoryFilterConfigs: FilterConfig[] = [
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
      { value: "all", label: "All Categories" },
      { value: "high", label: "High (50+)" },
      { value: "medium", label: "Medium (10-49)" },
      { value: "low", label: "Low (1-9)" },
      { value: "empty", label: "Empty (0)" },
    ],
  },
];

// Initial filter state
export const initialCategoryFilters = {
  search: "",
  status: "all",
  productCount: "all",
};

// Sortable columns configuration
export const categorySortableColumns = {
  category: createSortableColumn(
    "category",
    (category: Category) => category.name,
    "string"
  ),
  products: createSortableColumn(
    "products",
    (category: Category) => category.productCount,
    "number"
  ),
  status: createSortableColumn(
    "status",
    (category: Category) => category.isActive,
    "boolean"
  ),
  created: createSortableColumn(
    "created",
    (category: Category) => category.createdAt,
    "date"
  ),
};

// Filter function
export const filterCategories = (categories: Category[], filters: any) => {
  return categories.filter((category) => {
    const searchTerm = filters.search as string;
    const filterStatus = filters.status as string;
    const filterProductCount = filters.productCount as string;

    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && category.isActive) ||
      (filterStatus === "inactive" && !category.isActive);

    const matchesProductCount = (() => {
      if (filterProductCount === "all") return true;
      const count = category.productCount;
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
export const getCategoryTableColumns = (): TableColumn<Category>[] => [
  {
    id: "category",
    label: "Category",
    width: "300px",
    sortable: true,
    render: (category) => (
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center overflow-hidden">
          {category.icon ? (
            <img
              src={category.icon}
              alt="Icon"
              className="h-6 w-6 object-contain"
            />
          ) : (
            <Tag className="h-6 w-6 text-purple-600" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {category.name}
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
    render: (category) => (
      <div className="flex items-center space-x-2">
        <Package className="w-4 h-4 text-gray-400" />
        <span
          className={`text-sm font-medium ${
            category.productCount === 0
              ? "text-red-600"
              : category.productCount < 10
              ? "text-yellow-600"
              : "text-gray-900"
          }`}
        >
          {category.productCount}
        </span>
      </div>
    ),
  },
  {
    id: "image",
    label: "Image",
    width: "120px",
    sortable: false,
    render: (category) => (
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
    render: (category) => (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          category.isActive
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {category.isActive ? (
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
    render: (category) => (
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(category.createdAt).toLocaleDateString()}
      </div>
    ),
  },
];

// Table header configuration
export const getCategoryTableHeader = (
  filters: any,
  updateFilter: (key: string, value: any) => void,
  resetFilters: () => void,
  selectedCategories: number[],
  onBulkDelete: () => void,
  onExport: () => void
): TableHeader => ({
  headerActions: (
    <div className="flex items-center justify-between">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search categories..."
          value={(filters.search as string) || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300"
        />
      </div>

      <div className="flex items-center space-x-2">
        {selectedCategories.length > 0 && (
          <button
            onClick={onBulkDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete ({selectedCategories.length})
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
          filterConfigs={categoryFilterConfigs}
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

// Custom hook for category table logic
export const useCategoryTable = (categories: Category[]) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // Initialize filters
  const { filters, updateFilter, resetFilters } = useFilters({
    initialFilters: initialCategoryFilters,
  });

  // Filter categories
  const filteredCategories = filterCategories(categories, filters);

  // Use sorting hook
  const {
    sortedData: sortedCategories,
    sortConfig,
    handleSort,
  } = useSort(filteredCategories, categorySortableColumns);

  // Selection handlers
  const handleSelectAll = () => {
    setSelectedCategories(
      selectedCategories.length === sortedCategories.length
        ? []
        : sortedCategories.map((c) => c.id)
    );
  };

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearSelections = () => {
    setSelectedCategories([]);
  };

  return {
    // Data
    sortedCategories,
    selectedCategories,

    // Filters
    filters,
    updateFilter,
    resetFilters,

    // Sorting
    sortConfig,
    handleSort,

    // Selection
    handleSelectAll,
    handleSelectCategory,
    clearSelections,
  };
};

// Statistics calculation helper
export const calculateCategoryStats = (categories: Category[]) => {
  const activeCount = categories.filter((c) => c.isActive).length;
  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);
  const averageProducts = Math.round(totalProducts / categories.length);

  return {
    totalCategories: categories.length,
    activeCount,
    totalProducts,
    averageProducts,
    activePercentage: Math.round((activeCount / categories.length) * 100),
  };
};
