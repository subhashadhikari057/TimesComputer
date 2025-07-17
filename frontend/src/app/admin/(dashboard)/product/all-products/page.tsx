"use client";

import { useState } from "react";
import { GenericDataTable } from "@/components/form/table/table";
import { Plus, DollarSign, CheckCircle, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/dashboard/Statcards";
import {
  Product,
  useProductTable,
  getProductTableColumns,
  getProductTableHeader,
  calculateProductStats,
} from "./ProductTableConfig";

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 16-inch M3 Max",
    slug: "macbook-pro-16-inch-m3-max",
    price: 2399.99,
    stock: 25,
    category: "Laptops",
    brand: "Apple",
    isPublished: true,
    image: "/api/placeholder/150/150",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-10",
    status: "active",
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max 256GB",
    slug: "iphone-15-pro-max-256gb",
    price: 999.99,
    stock: 50,
    category: "Smartphones",
    brand: "Apple",
    isPublished: true,
    image: "/api/placeholder/150/150",
    createdAt: "2024-01-20",
    updatedAt: "2024-02-15",
    status: "active",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    price: 799.99,
    stock: 0,
    category: "Smartphones",
    brand: "Samsung",
    isPublished: false,
    image: "/api/placeholder/150/150",
    createdAt: "2024-01-10",
    updatedAt: "2024-02-05",
    status: "out_of_stock",
  },
  {
    id: 4,
    name: "Dell XPS 13 Plus Intel i7",
    slug: "dell-xps-13-plus-intel-i7",
    price: 1299.99,
    stock: 15,
    category: "Laptops",
    brand: "Dell",
    isPublished: true,
    image: "/api/placeholder/150/150",
    createdAt: "2024-01-08",
    updatedAt: "2024-02-12",
    status: "active",
  },
  {
    id: 5,
    name: "HP Spectre x360 14-inch",
    slug: "hp-spectre-x360-14-inch",
    price: 1199.99,
    stock: 8,
    category: "Laptops",
    brand: "HP",
    isPublished: true,
    image: "/api/placeholder/150/150",
    createdAt: "2024-01-25",
    updatedAt: "2024-02-08",
    status: "low_stock",
  },
];

// Main Component
export default function ViewProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Use the product table hook
  const {
    sortedProducts,
    selectedProducts,
    filters,
    updateFilter,
    resetFilters,
    sortConfig,
    handleSort,
    handleSelectAll,
    handleSelectProduct,
    clearSelections,
  } = useProductTable(mockProducts);

  // Calculate statistics
  const stats = calculateProductStats(mockProducts);

  // Event handlers
  const handleEdit = (productId: number) => {
    router.push(`/admin/product/${productId}/edit`);
  };

  const handleDelete = (productId: number) => {
    console.log("Delete product:", productId);
    // TODO: Implement delete functionality
  };

  const handleBulkDelete = () => {
    console.log("Bulk delete products:", selectedProducts);
    clearSelections();
    // TODO: Implement bulk delete functionality
  };

  const handleExport = () => {
    console.log("Export products");
    // TODO: Implement export functionality
  };

  const handleAddProduct = () => {
    router.push("/admin/product/create");
  };

  // Get table configuration
  const tableHeader = getProductTableHeader(
    filters,
    updateFilter,
    resetFilters,
    selectedProducts,
    handleBulkDelete,
    handleExport
  );

  const columns = getProductTableColumns();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            Manage your product inventory and catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Product
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          change="+12% from last month"
          Icon={Package}
          color="text-blue-600"
        />
        <StatCard
          title="Published Products"
          value={stats.publishedCount.toString()}
          change={`${stats.publishedPercentage}% published`}
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          change="Current stock value"
          Icon={DollarSign}
          color="text-purple-600"
        />
      </div>

      {/* Products Table */}
      <GenericDataTable
        header={tableHeader}
        data={sortedProducts}
        columns={columns}
        selectedItems={selectedProducts}
        onSelectItem={(id) => handleSelectProduct(id as number)}
        onSelectAll={handleSelectAll}
        onEdit={(product) => handleEdit(product.id)}
        onDelete={(product) => handleDelete(product.id)}
        showSelection={true}
        getItemId={(product) => product.id}
        loading={loading}
        loadingMessage="Loading products..."
        sortConfig={sortConfig}
        onSort={handleSort}
        className="max-w-full"
      />
    </div>
  );
}
