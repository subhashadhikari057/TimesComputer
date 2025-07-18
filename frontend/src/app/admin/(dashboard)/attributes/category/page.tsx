"use client";

import {
  Plus,
  Tag,
  CheckCircle,
  Package,
  Search,
  Download,
  Eye,
  Calendar,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import StatCard from "@/components/admin/dashboard/Statcards";
import FilterComponent from "@/components/admin/product/filter";
import DefaultTable, { Column } from "@/components/form/table/defaultTable";
import { useTableData } from "@/hooks/useTableState";
import { toast } from "sonner";
import CategoryPopup from "./categoryPopup";

// Category interface
interface Category {
  id: number;
  name: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
  image: string;
  icon: string;
}

// Main Component
export default function CategoryManagementPage() {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
    image: string;
    icon: string;
  } | undefined>(undefined);

  // Sample data matching the product page structure
  const categoryData: Category[] = [
    {
      id: 1,
      name: "Laptops",
      productCount: 45,
    
      createdAt: "2025-07-01",
      updatedAt: "2025-07-15",
      image: "/api/placeholder/150/150",
      icon: "/api/placeholder/icon/50/50",
 
    },
    {
      id: 2,
      name: "Smartphones",
      productCount: 32,
     
      createdAt: "2025-06-24",
      updatedAt: "2025-07-10",
      image: "/api/placeholder/150/150",
      icon: "/api/placeholder/icon/50/50",
   
    },
    {
      id: 3,
      name: "Tablets",
      productCount: 12,
   
      createdAt: "2025-07-15",
      updatedAt: "2025-07-15",
      image: "/api/placeholder/150/150",
      icon: "/api/placeholder/icon/50/50",
    
    },
    {
      id: 4,
      name: "Accessories",
      productCount: 67,
    
      createdAt: "2025-07-10",
      updatedAt: "2025-07-12",
      image: "/api/placeholder/150/150",
      icon: "/api/placeholder/icon/50/50",
      
    },
    {
      id: 5,
      name: "Gaming",
      productCount: 28,
   
      createdAt: "2025-06-30",
      updatedAt: "2025-07-08",
      image: "/api/placeholder/150/150",
      icon: "/api/placeholder/icon/50/50",
    
    },
    {
      id: 6,
      name: "Audio",
      productCount: 19,
      
      createdAt: "2025-06-25",
      updatedAt: "2025-07-05",
      image: "/api/placeholder/150/150",
      icon: "/api/placeholder/icon/50/50",
  
    },
  ];

  // Define columns for the table 
  const categoryColumns: Column[] = [
    {
      id: "name",
      label: "Category",
      sortable: false,
      filterable: true,
      searchable: true,
      width: "300px",
      render: (category: Category) => (
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover"
            />
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
      id: "productCount",
      label: "Products",
      sortable: true,
      filterable: false,
      searchable: false,
      width: "120px",
      render: (category: Category) => (
        <div className="flex items-center space-x-1">
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
            {category.productCount} items
          </span>
        </div>
      ),
    },
    
    {
      id: "createdAt",
      label: "Created At",
      sortable: true,
      filterable: false,
      searchable: false,
      width: "120px",
      render: (category: Category) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(category.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "updatedAt",
      label: "Updated At",
      sortable: true,
      filterable: false,
      searchable: false,
      width: "120px",
      render: (category: Category) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(category.updatedAt).toLocaleDateString()}
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
    data: categoryData,
    columns: categoryColumns,
    defaultSort: { key: "createdAt", direction: "desc" },
  });

  // Event handlers
  const handleEdit = (row: any, index: number) => {
    
    const categoryData = {
      id: row.id,
      name: row.name,
      image: row.image, 
      icon: row.icon, 
    };
    setEditingCategory(categoryData);
    setShowEditPopup(true);
  };

  const handleDelete = (row: any, index: number) => {
    console.log("Delete category:", row, index);
    toast.success("Category deleted successfully!");
  };

  const handleExport = () => {
    console.log("Export categories");
    toast.success("Categories exported successfully!");
  };

  const handleAddCategory = () => {
    setShowAddPopup(true);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setEditingCategory(undefined);
  };

  // Calculate stats
  const totalCategories = categoryData.length;
  const activeCategories = "5"
  const totalProducts = categoryData.reduce(
    (sum, cat) => sum + cat.productCount,
    0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header - Same structure as product page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">
            Manage your product categories and organize your catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddCategory}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </button>
        </div>
      </div>

      {/* Add Category Popup */}
      <CategoryPopup isOpen={showAddPopup} onClose={handleCloseAddPopup} />

      {/* Edit Category Popup */}
      <CategoryPopup
        isOpen={showEditPopup}
        onClose={handleCloseEditPopup}
        initialData={editingCategory}
      />

      {/* Statistics - Same structure as product page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Categories"
          value={totalCategories.toString()}
          change="+12% from last month"
          Icon={Tag}
          color="text-purple-600"
        />
        <StatCard
          title="Active Categories"
          value={activeCategories.toString()}
          change={`${Math.round(
            (totalCategories) * 100
          )}% active`}
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          change={`Avg ${Math.round(
            totalProducts / totalCategories
          )} per category`}
          Icon={Package}
          color="text-blue-600"
        />
      </div>

      {/* Table Container - Same structure as product page */}
      <div className="bg-white border border-gray-300 rounded-lg transition-shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
            {/* Search Input - Same as product page */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full lg:w-120 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300 focus:outline-none"
              />
            </div>

            {/* Action Buttons - Same structure as product page */}
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

        {/* Table  */}
        <DefaultTable
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          columns={categoryColumns}
          data={processedData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}