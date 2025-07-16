"use client";

import { useState } from "react";
import {
  GenericDataTable,
  TableColumn,
  TableHeader,
} from "@/components/form/table/table";
import {
  Package,
  Trash2,
  Plus,
  DollarSign,
  CheckCircle,
  Edit3,
  Copy,
  Eye,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/dashboard/Statcards";
import { FilterComponent, FilterConfig } from "@/components/admin/product/filter";
import { useFilters } from "@/hooks/useFilter";

// Product interface (same as before)
interface Product {
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

// Mock data (same as before)
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
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize filters using the custom hook
  const { filters, updateFilter, resetFilters } = useFilters({
    search: '',
    category: 'all',
    brand: 'all',
    status: 'all',
    sort: 'name'
  });

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search Products',
      type: 'search',
      placeholder: 'Search by product name...',
      width: 'lg'
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      width: 'md',
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'Laptops', label: 'Laptops' },
        { value: 'Smartphones', label: 'Smartphones' },
        { value: 'Tablets', label: 'Tablets' }
      ]
    },
    {
      key: 'brand',
      label: 'Brand',
      type: 'select',
      width: 'md',
      options: [
        { value: 'all', label: 'All Brands' },
        { value: 'Apple', label: 'Apple' },
        { value: 'Samsung', label: 'Samsung' },
        { value: 'Dell', label: 'Dell' },
        { value: 'HP', label: 'HP' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      width: 'md',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'out_of_stock', label: 'Out of Stock' },
        { value: 'low_stock', label: 'Low Stock' }
      ]
    },
    {
      key: 'sort',
      label: 'Sort By',
      type: 'select',
      width: 'md',
      options: [
        { value: 'name', label: 'Sort by Name' },
        { value: 'price', label: 'Sort by Price' },
        { value: 'stock', label: 'Sort by Stock' },
        { value: 'created', label: 'Sort by Date Created' }
      ]
    }
  ];

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter((product) => {
      const searchTerm = filters.search as string;
      const filterCategory = filters.category as string;
      const filterBrand = filters.brand as string;
      const filterStatus = filters.status as string;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || product.category === filterCategory;
      const matchesBrand =
        filterBrand === "all" || product.brand === filterBrand;
      const matchesStatus =
        filterStatus === "all" || product.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    })
    .sort((a, b) => {
      const sortBy = filters.sort as string;
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "stock":
          return b.stock - a.stock;
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  // Calculate statistics
  const publishedCount = mockProducts.filter((p) => p.isPublished).length;
  const totalValue = mockProducts.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Event handlers
  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length
        ? []
        : filteredProducts.map((p) => p.id)
    );
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleEdit = (productId: number) => {
    router.push(`/admin/product/${productId}/edit`);
  };

  const handleDelete = (productId: number) => {
    console.log("Delete product:", productId);
    // TODO: Implement delete functionality
  };

  const handleBulkDelete = () => {
    console.log("Bulk delete products:", selectedProducts);
    setSelectedProducts([]);
    // TODO: Implement bulk delete functionality
  };

  const handleDuplicate = (productId: number) => {
    console.log("Duplicate product:", productId);
    // TODO: Implement duplicate functionality
  };

  const handleToggleStatus = (productId: number) => {
    console.log("Toggle product status:", productId);
    // TODO: Implement toggle status functionality
  };

  const handleExport = () => {
    console.log("Export products");
    // TODO: Implement export functionality
  };

  const handleAddProduct = () => {
    router.push("/admin/product/create");
  };

// Table configuration
const tableHeader: TableHeader = {
  title: `Products (${filteredProducts.length})`,
  description: "Manage your product catalog with advanced controls",
  headerActions: (
    <div className="flex items-center space-x-2 sm:space-x-2">
      {selectedProducts.length > 0 && (
        <button
          onClick={handleBulkDelete}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete ({selectedProducts.length})
        </button>
      )}
      <button
        onClick={handleExport}
        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <Download className="h-4 w-4 mr-1" />
        Export
      </button>
      <button
        onClick={handleAddProduct}
        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Product
      </button>
    </div>
  ),
};

  const columns: TableColumn<Product>[] = [
    {
      id: "product",
      label: "Product",
      width: "300px",
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
      render: (product) => (
        <div className="text-sm text-gray-900">{product.category}</div>
      ),
    },
    {
      id: "brand",
      label: "Brand",
      width: "100px",
      render: (product) => (
        <div className="text-sm font-medium text-gray-900">{product.brand}</div>
      ),
    },
    {
      id: "price",
      label: "Price",
      width: "100px",
      render: (product) => (
        <div className="text-sm font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </div>
      ),
    },
    {
      id: "stock",
      label: "Stock",
      width: "100px",
      render: (product) => (
        <div className={`text-sm font-medium ${
          product.stock === 0 
            ? 'text-red-600' 
            : product.stock < 10 
              ? 'text-yellow-600' 
              : 'text-gray-900'
        }`}>
          {product.stock} units
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      width: "120px",
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
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            Manage your product inventory and catalog
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value={mockProducts.length.toString()}
          change="+12% from last month"
          Icon={Package}
          color="text-blue-600"
        />
        <StatCard
          title="Published Products"
          value={publishedCount.toString()}
          change={`${Math.round((publishedCount / mockProducts.length) * 100)}% published`}
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total Value"
          value={`$${totalValue.toLocaleString()}`}
          change="Current stock value"
          Icon={DollarSign}
          color="text-purple-600"
        />
      </div>

      {/* Reusable Filter Component */}
      <FilterComponent
        title="Filters & Search"
        description="Find and filter products"
        filters={filterConfig}
        values={filters}
        onChange={updateFilter}
        onReset={resetFilters}
      />

      {/* Products Table */}
      <GenericDataTable
        header={tableHeader}
        data={filteredProducts}
        columns={columns}
        selectedItems={selectedProducts}
        onSelectItem={(id) => handleSelectProduct(id as number)}
        onSelectAll={handleSelectAll}
        onEdit={(product) => handleEdit(product.id)}
        onDelete={(product) => handleDelete(product.id)}
        showSelection={true}
        showActions={true}
        getItemId={(product) => product.id}
        emptyMessage="No products found matching your criteria"
        emptyIcon={<Package className="w-12 h-12 text-gray-400" />}
        loading={loading}
        loadingMessage="Loading products..."
        className="max-w-full"
      />
    </div>
  );
}