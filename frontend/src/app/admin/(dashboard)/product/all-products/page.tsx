"use client";

import {
  Plus,
  DollarSign,
  CheckCircle,
  Package,
  Search,
  Download,
  Eye,
  Calendar,
  Trash2,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/dashboard/Statcards";
import FilterComponent from "@/components/admin/product/filter";
import DefaultTable, { Column } from "@/components/form/table/defaultTable";
import { useTableData } from "@/hooks/useTableState";
import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "@/api/product";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/imageUtils";
import Image from "next/image";
import { DeleteConfirmation } from "@/components/common/helper_function";

// Main Component
export default function ViewProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllProducts();
        setProducts(Array.isArray(data) ? data : (data.products || []));
      } catch (err: any) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);


  // Define columns for the table
  const newColumns: Column[] = [
    {
      id: "name",
      label: "Product",
      sortable: false,
      filterable: false,
      searchable: true,
      width: "240px",
      render: (product: any) => {
        const imageUrl = product.images?.[0] ? getImageUrl(product.images[0]) : null;
        return (
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "category",
      label: "Category",
      sortable: true,
      filterable: true,
      searchable: true,
      width: "120px",
      render: (product: any) => (
        <div className="text-sm text-gray-900">
          {product.category?.name || product.category || 'No Category'}
        </div>
      ),
    },
    {
      id: "brand",
      label: "Brand",
      sortable: true,
      filterable: true,
      searchable: true,
      width: "120px",
      render: (product: any) => (
        <div className="text-sm font-medium text-gray-900">
          {product.brand?.name || product.brand || 'No Brand'}
        </div>
      ),
    },
    {
      id: "price",
      label: "Price",
      sortable: true,
      filterable: false,
      searchable: false,
      width: "120px",
      render: (product: any) => {
        const price =
          typeof product.price === "string"
            ? parseFloat(product.price.replace("$", ""))
            : product.price;

        return (
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold text-gray-900">
              ${price.toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      id: "stock",
      label: "Stock",
      sortable: true,
      filterable: false,
      searchable: false,
      width: "120px",
      render: (product: any) => (
        <div
          className={`text-sm font-medium ${product.stock === 0
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
      id: "isPublished",
      label: "Status",
      sortable: true,
      filterable: true,
      searchable: true,
      width: "120px",
      render: (product: any) => {
        return (
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${product.isPublished
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
        );
      },
    },
    {
      id: "createdAt",
      label: "Created At",
      sortable: true,
      filterable: false,
      searchable: false,
      width: "120px",
      render: (product: any) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(product.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  // Use custom hook for table data management
  // This hook handles search, filters, sorting, and selection state
  const {
    searchTerm,
    filters,
    sortConfig,
    selectedItems,
    processedData,
    filterConfigs,
    handleSearchChange,
    handleFilterChange,
    handleResetFilters,
    handleSort,
    handleSelectAll,
    handleSelectItem,
    handleBulkDelete,
  } = useTableData({
    data: products,
    columns: newColumns,
    defaultSort: { key: "createdAt", direction: "desc" },
  });

  const handleEdit = (row: any) => {
    router.push(`/admin/product/${row.id}/edit`);
  };

  const handleDelete = async (row: any) => {
    try {
      await deleteProduct(row.id);
      setProducts((prev) => prev.filter((p) => p.id !== row.id));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleExport = () => {
    console.log("Export products");
    // TODO: Implement export functionality
  };

  const handleAddProduct = () => {
    router.push("/admin/product/create");
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-3">
        <StatCard
          title="Total Products"
          value={products.length.toString()}
          change="+12% from last month"
          Icon={Package}
          color="text-blue-600"
        />
        <StatCard
          title="Published Products"
          value={products.filter((p) => p.isPublished).length.toString()}
          change="100%"
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total Value"
          value="$177.91"
          change="Current stock value"
          Icon={DollarSign}
          color="text-purple-600"
        />
      </div>

      <div className="bg-white border border-gray-300 rounded-lg transition-shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full lg:w-120 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 md:justify-self-end">
              {/* Bulk Delete Button - Show only when items are selected */}
              {selectedItems.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedItems.length})
                </button>
              )}

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={handleExport}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>

                <div className="flex-1">
                  <FilterComponent
                    filters={filters}
                    filterConfigs={filterConfigs}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <DefaultTable
            selectedItems={selectedItems}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            columns={newColumns}
            data={processedData} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
      </div>
    </div>
  );
}
