"use client";

import { useState } from "react";
import {
  GenericDataTable,
  TableColumn,
  TableAction,
} from "@/components/form/table/table";
import {
  Package,
  Search,
  Trash2,
  Plus,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Edit3,
  Copy,
  Eye,
} from "lucide-react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentsCard";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/dashboard/Statcards";

// Product interface
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

// Enhanced mock data
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

// Constants
const CATEGORIES = ["all", "Laptops", "Smartphones", "Tablets"];
const BRANDS = ["all", "Apple", "Samsung", "Dell", "HP"];
const STATUSES = ["all", "active", "out_of_stock", "low_stock"];

const STATUS_LABELS = {
  all: "All Status",
  out_of_stock: "Out of Stock",
  low_stock: "Low Stock",
  active: "Active",
};

// Product Table Component
const ProductTable: React.FC<{
  products: Product[];
  selectedProducts: number[];
  onSelectProduct: (productId: number) => void;
  onSelectAll: () => void;
  onEdit: (productId: number) => void;
  onDelete: (productId: number) => void;
  onDuplicate: (productId: number) => void;
  onToggleStatus: (productId: number) => void;
}> = ({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
}) => {
  const columns: TableColumn<Product>[] = [
    {
      id: "product",
      label: "Product",
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
      render: (product) => (
        <div className="text-sm text-gray-900">{product.category}</div>
      ),
    },
    {
      id: "brand",
      label: "Brand",
      render: (product) => (
        <div className="text-sm font-medium text-gray-900">{product.brand}</div>
      ),
    },
    {
      id: "price",
      label: "Price",
      render: (product) => (
        <div className="text-sm font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </div>
      ),
    },
    {
      id: "stock",
      label: "Stock",
      render: (product) => (
        <div className="text-sm font-medium text-gray-900">
          {product.stock} units
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
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

  const primaryAction: TableAction<Product> = {
    label: "Edit",
    icon: <Edit3 className="w-4 h-4 mr-1.5" />,
    onClick: (product) => onEdit(product.id),
  };

  const dropdownActions: TableAction<Product>[] = [
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      onClick: (product) => onDelete(product.id),
    },
    {
      label: "Duplicate",
      icon: <Copy className="w-4 h-4 mr-2" />,
      onClick: (product) => onDuplicate(product.id),
    },
    {
      label: "Toggle Status",
      icon: <CheckCircle className="w-4 h-4 mr-2" />,
      onClick: (product) => onToggleStatus(product.id),
    },
  ];

  return (
    <GenericDataTable
      data={products}
      columns={columns}
      selectedItems={selectedProducts}
      onSelectItem={(id) => onSelectProduct(id as number)}
      onSelectAll={onSelectAll}
      primaryAction={primaryAction}
      dropdownActions={dropdownActions}
      getItemId={(product) => product.id}
      emptyMessage="No products found"
      emptyIcon={<Package className="w-12 h-12 text-gray-400" />}
    />
  );
};

// Main Component
export default function ViewProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter((product) => {
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
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete ({selectedProducts.length})</span>
            </button>
          )}
          <Link
            href="/admin/product/create"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
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
          value={`${totalValue.toLocaleString()}`}
          change="Current stock value"
          Icon={DollarSign}
          color="text-purple-600"
        />
      </div>

      {/* Filters */}
      <ComponentCard title="Filters & Search" desc="Find and filter products">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand === "all" ? "All Brands" : brand}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
            <option value="created">Sort by Date Created</option>
          </select>
        </div>
      </ComponentCard>

      {/* Products Table */}
      <ComponentCard
        title={`Products (${filteredProducts.length})`}
        desc="Manage your product catalog with advanced controls"
      >
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Link
              href="/admin/product/create"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Product</span>
            </Link>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </ComponentCard>
    </div>
  );
}