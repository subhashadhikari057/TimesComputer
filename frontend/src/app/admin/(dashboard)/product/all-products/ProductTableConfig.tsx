import { useState } from "react";
import { TableColumn, TableHeader } from "@/components/form/table/table";
import { Package, CheckCircle, Eye, DollarSign, Calendar } from "lucide-react";
import { FilterConfig } from "@/components/admin/product/filter";
import { useFilters } from "@/hooks/useFilter";
import { useSort, createSortableColumn } from "@/hooks/useSort";
import { TableHeaderActions } from "@/components/form/table/TableHeaderActions";

// Type definitions
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  isPublished: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

// Filter configuration
export const productFilterConfigs: FilterConfig[] = [
  {
    key: "category",
    label: "Category",
    type: "radio",
    options: [
      { value: "all", label: "All Categories" },
      { value: "Laptops", label: "Laptops" },
      { value: "Smartphones", label: "Smartphones" },
      { value: "Tablets", label: "Tablets" },
      { value: "Accessories", label: "Accessories" },
    ],
  },
  {
    key: "brand",
    label: "Brand",
    type: "select",
    options: [
      { value: "all", label: "All Brands" },
      { value: "Apple", label: "Apple" },
      { value: "Samsung", label: "Samsung" },
      { value: "Dell", label: "Dell" },
      { value: "HP", label: "HP" },
      { value: "Lenovo", label: "Lenovo" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",

    options: [
      { value: "all", label: "All Status" },
      { value: "active", label: "Active" },
      { value: "out_of_stock", label: "Out of Stock" },
      { value: "low_stock", label: "Low Stock" },
      { value: "draft", label: "Draft" },
    ],
  },
  {
    key: "priceRange",
    label: "Price Range",
    type: "select",
    options: [
      { value: "all", label: "All Prices" },
      { value: "0-500", label: "$0 - $500" },
      { value: "500-1000", label: "$500 - $1000" },
      { value: "1000-2000", label: "$1000 - $2000" },
      { value: "2000+", label: "$2000+" },
    ],
  },
];

// Initial filter state
export const initialProductFilters = {
  search: "",
  category: "all",
  brand: "all",
  status: "all",
  priceRange: "all",
};

// Sortable columns configuration
export const productSortableColumns = {
  product: createSortableColumn(
    "product",
    (product: Product) => product.name,
    "string"
  ),
  category: createSortableColumn(
    "category",
    (product: Product) => product.category,
    "string"
  ),
  brand: createSortableColumn(
    "brand",
    (product: Product) => product.brand,
    "string"
  ),
  price: createSortableColumn(
    "price",
    (product: Product) => product.price,
    "number"
  ),
  stock: createSortableColumn(
    "stock",
    (product: Product) => product.stock,
    "number"
  ),
  status: createSortableColumn(
    "status",
    (product: Product) => product.isPublished,
    "boolean"
  ),
  created: createSortableColumn(
    "created",
    (product: Product) => product.createdAt,
    "date"
  ),
  updated: createSortableColumn(
    "updated",
    (product: Product) => product.updatedAt,
    "date"
  ),
};

// Filter function
export const filterProducts = (products: Product[], filters: any) => {
  return products.filter((product) => {
    const searchTerm = filters.search as string;
    const filterCategory = filters.category as string;
    const filterBrand = filters.brand as string;
    const filterStatus = filters.status as string;
    const filterPriceRange = filters.priceRange as string;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    const matchesBrand = filterBrand === "all" || product.brand === filterBrand;

    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;

    const matchesPriceRange = (() => {
      if (filterPriceRange === "all") return true;
      const price = product.price;
      switch (filterPriceRange) {
        case "0-500":
          return price >= 0 && price <= 500;
        case "500-1000":
          return price > 500 && price <= 1000;
        case "1000-2000":
          return price > 1000 && price <= 2000;
        case "2000+":
          return price > 2000;
        default:
          return true;
      }
    })();

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesStatus &&
      matchesPriceRange
    );
  });
};

// Table columns configuration
export const getProductTableColumns = (): TableColumn<Product>[] => [
  {
    id: "product",
    label: "Product",
    width: "300px",
    sortable: true,
    render: (product) => (
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
          <Package className="h-6 w-6 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </div>
          <div className="text-xs text-gray-500">{product.slug}</div>
        </div>
      </div>
    ),
  },
  {
    id: "category",
    label: "Category",
    width: "120px",
    sortable: true,
    render: (product) => (
      <div className="text-sm text-gray-900">{product.category}</div>
    ),
  },
  {
    id: "brand",
    label: "Brand",
    width: "100px",
    sortable: true,
    render: (product) => (
      <div className="text-sm font-medium text-gray-900">{product.brand}</div>
    ),
  },
  {
    id: "price",
    label: "Price",
    width: "100px",
    sortable: true,
    render: (product) => (
      <div className="flex items-center space-x-1">
        <DollarSign className="w-3 h-3 text-gray-400" />
        <span className="text-sm font-semibold text-gray-900">
          {product.price.toFixed(2)}
        </span>
      </div>
    ),
  },
  {
    id: "stock",
    label: "Stock",
    width: "100px",
    sortable: true,
    render: (product) => (
      <div
        className={`text-sm font-medium ${
          product.stock === 0
            ? "text-red-600"
            : product.stock < 10
            ? "text-yellow-600"
            : "text-gray-900"
        }`}
      >
        {product.stock} units
      </div>
    ),
  },
  {
    id: "status",
    label: "Status",
    width: "120px",
    sortable: true,
    render: (product) => (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          product.isPublished
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {product.isPublished ? (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            Published
          </>
        ) : (
          <>
            <Eye className="w-3 h-3 mr-1" />
            Draft
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
    render: (product) => (
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(product.createdAt).toLocaleDateString()}
      </div>
    ),
  },
];

// Table header configuration
export const getProductTableHeader = (
  filters: any,
  updateFilter: (key: string, value: any) => void,
  resetFilters: () => void,
  selectedProducts: number[],
  onBulkDelete: () => void,
  onExport: () => void
): TableHeader => ({
  headerActions: (
    <TableHeaderActions
      searchPlaceholder="Search by product name..."
      searchValue={(filters.search as string) || ""}
      onSearchChange={(value) => updateFilter("search", value)}
      selectedItems={selectedProducts}
      onBulkDelete={onBulkDelete}
      onExport={onExport}
      filters={filters}
      filterConfigs={productFilterConfigs}
      onFilterChange={updateFilter}
      onResetFilters={resetFilters}
    />
  ),
});

// Custom hook for product table logic
export const useProductTable = (products: Product[]) => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Initialize filters
  const { filters, updateFilter, resetFilters } = useFilters({
    initialFilters: initialProductFilters,
  });

  // Filter products
  const filteredProducts = filterProducts(products, filters);

  // Use sorting hook with initial sort by name
  const {
    sortedData: sortedProducts,
    sortConfig,
    handleSort,
  } = useSort(filteredProducts, productSortableColumns, {
    column: "product",
    direction: "asc",
  });

  // Selection handlers
  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === sortedProducts.length
        ? []
        : sortedProducts.map((p) => p.id)
    );
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const clearSelections = () => {
    setSelectedProducts([]);
  };

  return {
    // Data
    sortedProducts,
    selectedProducts,

    // Filters
    filters,
    updateFilter,
    resetFilters,

    // Sorting
    sortConfig,
    handleSort,

    // Selection
    handleSelectAll,
    handleSelectProduct,
    clearSelections,
  };
};

// Statistics calculation helper
export const calculateProductStats = (products: Product[]) => {
  const publishedCount = products.filter((p) => p.isPublished).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock < 10
  ).length;

  return {
    totalProducts: products.length,
    publishedCount,
    totalValue,
    outOfStockCount,
    lowStockCount,
    publishedPercentage: Math.round((publishedCount / products.length) * 100),
  };
};
