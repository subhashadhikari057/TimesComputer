"use client";

import {
  Plus,
  CheckCircle,
  Package,
  Search,
  Download,
  Calendar,
  Trash2,
  Grid,
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
import ExportPopup from "@/components/form/table/exportModal";
import { DeleteConfirmation } from "@/components/common/helper_function";
import { FullHeightShimmerTable } from "@/components/common/shimmerEffect";

// Product interface
interface Product extends Record<string, unknown> {
  id: string | number;
  name: string;
  images?: string[];
  category?: {
    name: string;
  } | string;
  brand?: {
    name: string;
  } | string;
  price: string | number;
  stock: number;
  isPublished: boolean;
  isFeature: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Main Component
export default function ViewProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const newColumns: Column[] = [
    {
      id: "images",
      label: "Product Images",
      sortable: false,
      filterable: false,
      searchable: false,

      widthClass: "w-16 lg:w-20",
      render: (product: Product) => {
        const imageUrl = product.images?.[0]
          ? getImageUrl(product.images[0])
          : null;
        return (
          <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "name",
      label: "Product Name",
      sortable: false,
      filterable: false,
      searchable: true,
      widthClass: "w-48 lg:w-1/4",
      render: (product: Product) => {
        return (
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 break-words leading-tight max-w-xs">
              {product.name}
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
      widthClass: "w-28 lg:w-32",
      render: (product: Product) => {
        const categoryName = typeof product.category === 'object' 
          ? product.category?.name 
          : product.category || "No Category";
        return (
          <div
            className="text-sm text-gray-900 truncate"
            title={categoryName}
          >
            {categoryName}
          </div>
        );
      },
    },
    {
      id: "brand",
      label: "Brand",
      sortable: true,
      filterable: true,
      searchable: true,
      widthClass: "w-28 lg:w-32",
      render: (product: Product) => {
        const brandName = typeof product.brand === 'object' 
          ? product.brand?.name 
          : product.brand || "No Brand";
        return (
          <div
            className="text-sm font-medium text-gray-900 truncate"
            title={brandName}
          >
            {brandName}
          </div>
        );
      },
    },
    {
      id: "price",
      label: "Price (Rs.)",
      sortable: true,
      filterable: false,
      searchable: false,
      widthClass: "w-24 lg:w-28",
      render: (product: Product) => {
        const price =
          typeof product.price === "string"
            ? parseFloat(product.price.replace("$", ""))
            : product.price;

        return (
          <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
            Rs.{price}
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
      widthClass: "w-16 lg:w-20",
      render: (product: Product) => (
        <div
          className={`text-sm font-medium break-words leading-tight line-clamp-2 ${
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
      id: "isPublished",
      label: "Status",
      sortable: true,
      filterable: true,
      searchable: true,
      widthClass: "w-28 lg:w-32",
      render: (product: Product) => {
        return (
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
              product.isPublished
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            {product.isPublished ? "Published" : "Draft"}
          </span>
        );
      },
    },
    {
      id: "isFeature",
      label: "Featured",
      sortable: true,
      filterable: true,
      searchable: true,
      widthClass: "w-24 lg:w-28",
      render: (product: Product) => {
        return (
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
              product.isFeature
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            {product.isFeature ? "Yes" : "No"}
          </span>
        );
      },
    },
    {
      id: "createdAt",
      label: "Created Date",
      sortable: true,
      filterable: false,
      searchable: false,
      widthClass: "w-32 lg:w-36",
      render: (product: Product) => (
        <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
          <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
          {new Date(product.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  // Use custom hook for table data management
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

  const handleEdit = (row: Record<string, unknown>) => {
    const product = row as unknown as Product;
    router.push(`/admin/product/${product.id}/edit`);
  };

  const handleDelete = (row: Record<string, unknown>) => {
    setDeleteModal({
      isOpen: true,
      product: row as unknown as Product,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;

    try {
      // Ensure id is converted to number if deleteProduct expects a number
      const productId = typeof deleteModal.product.id === 'string' 
        ? parseInt(deleteModal.product.id) 
        : deleteModal.product.id;
      await deleteProduct(productId);
      toast.success("Product deleted successfully");

      setProducts((prev) =>
        prev.filter((product) => product.id !== deleteModal.product!.id)
      );
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error("Failed to delete Product");
    } finally {
      setDeleteModal({ isOpen: false, product: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, product: null });
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
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
          Icon={Grid}
          gradient="emerald"
          loading={loading}
        />
        <StatCard
          title="Published Products"
          value={products.filter((p) => p.isPublished).length.toString()}
          Icon={CheckCircle}
          gradient="purple"
          loading={loading}
        />
        <StatCard
          title="Out of Stock"
          value={products.filter((p) => p.stock === 0).length.toString()}
          Icon={Package}
          gradient="cyan"
          loading={loading}
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
                    filterConfigs={filterConfigs as never}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <FullHeightShimmerTable cols={10} />
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Product"
        itemName={deleteModal.product?.name}
      />

      <ExportPopup
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={processedData}
        columns={newColumns}
        title="Products"
        filename="products_Details"
      />
    </div>
  );
}
