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
} from "lucide-react";
import { FilterConfig } from "@/components/admin/product/filter";
import { useFilters } from "@/hooks/useFilter";
import { useSort, createSortableColumn } from "@/hooks/useSort";
import { TableHeaderActions } from "@/components/form/table/TableHeaderActions";

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

// Table header configuration with mobile responsive design
export const getCategoryTableHeader = (
  filters: any,
  updateFilter: (key: string, value: any) => void,
  resetFilters: () => void,
  selectedCategories: number[],
  onBulkDelete: () => void,
  onExport: () => void
): TableHeader => ({
  headerActions: (
    <TableHeaderActions
      searchPlaceholder="Search categories..."
      searchValue={(filters.search as string) || ""}
      onSearchChange={(value) => updateFilter("search", value)}
      selectedItems={selectedCategories}
      onBulkDelete={onBulkDelete}
      bulkDeleteText="Delete"
      onExport={onExport}
      exportText="Export"
      filters={filters}
      filterConfigs={categoryFilterConfigs}
      onFilterChange={updateFilter}
      onResetFilters={resetFilters}
    />
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
