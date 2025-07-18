"use client";

import {
  Plus,
  Palette,
  CheckCircle,
  Package,
  Search,
  Download,
  Calendar,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StatCard from "@/components/admin/dashboard/Statcards";
import FilterComponent from "@/components/admin/product/filter";
import DefaultTable, { Column } from "@/components/form/table/defaultTable";
import { useTableData } from "@/hooks/useTableState";
import { toast } from "sonner";
import ColorPopup from "./colorPopup";

// Color interface
interface Color {
  id: number;
  name: string;
  hexCode: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

// Main Component
export default function ColorManagementPage() {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingColor, setEditingColor] = useState<{
    id: number;
    name: string;
    color: string;
  } | null>(null);

  // Sample data matching the product page structure
  const colorData: Color[] = [
    {
      id: 1,
      name: "Midnight Black",
      hexCode: "#000000",
      productCount: 45,
      createdAt: "2025-07-01",
      updatedAt: "2025-07-15",
    },
    {
      id: 2,
      name: "Snow White",
      hexCode: "#FFFFFF",
      productCount: 32,
      createdAt: "2025-06-24",
      updatedAt: "2025-07-10",
    },
    {
      id: 3,
      name: "Ocean Blue",
      hexCode: "#0066CC",
      productCount: 12,
      createdAt: "2025-07-15",
      updatedAt: "2025-07-15",
    },
    {
      id: 4,
      name: "Forest Green",
      hexCode: "#228B22",
      productCount: 67,
      createdAt: "2025-07-10",
      updatedAt: "2025-07-12",
    },
    {
      id: 5,
      name: "Sunset Orange",
      hexCode: "#FF6347",
      productCount: 23,
      createdAt: "2025-06-30",
      updatedAt: "2025-07-08",
    },
    {
      id: 6,
      name: "Purple Rain",
      hexCode: "#8A2BE2",
      productCount: 8,
      createdAt: "2025-06-25",
      updatedAt: "2025-07-05",
    },
    {
      id: 7,
      name: "Rose Gold",
      hexCode: "#E8B4A0",
      productCount: 0,
      createdAt: "2025-06-22",
      updatedAt: "2025-07-01",
    },
    {
      id: 8,
      name: "Silver",
      hexCode: "#C0C0C0",
      productCount: 28,
      createdAt: "2025-06-20",
      updatedAt: "2025-07-03",
    },
  ];

  // Define columns for the table (similar to product page)
  const colorColumns: Column[] = [
    {
      id: "name",
      label: "Color",
      sortable: false,
      filterable: true,
      searchable: true,
      width: "200px",
      render: (color: Color) => (
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center relative overflow-hidden">
            <div
              className="w-full h-full"
              style={{ backgroundColor: color.hexCode }}
            />
            {/* Add a subtle border for very light colors */}
            {color.hexCode === "#FFFFFF" && (
              <div className="absolute inset-0 border border-gray-300 rounded-lg" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {color.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "hexCode",
      label: "Hex Code",
      sortable: true,
      filterable: true,
      searchable: true,
      width: "120px",
      render: (color: Color) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono text-gray-900">
            {color.hexCode.toUpperCase()}
          </span>
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
      render: (color: Color) => (
        <div className="flex items-center space-x-1">
          <Package className="w-4 h-4 text-gray-400" />
          <span
            className={`text-sm font-medium ${
              color.productCount === 0
                ? "text-red-600"
                : color.productCount < 10
                ? "text-yellow-600"
                : "text-gray-900"
            }`}
          >
            {color.productCount} items
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
      render: (color: Color) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(color.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  // Use custom hook for table data management (same as product page)
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
    data: colorData,
    columns: colorColumns,
    defaultSort: { key: "createdAt", direction: "desc" },
  });

  // Event handlers
  const handleEdit = (row: any, index: number) => {
    // Convert Color to the format expected by ColorPopup
    const colorData = {
      id: row.id,
      name: row.name,
      color: row.hexCode, // Map hexCode to color for ColorPopup
    };
    setEditingColor(colorData);
    setShowEditPopup(true);
  };

  const handleDelete = (row: any, index: number) => {
    console.log("Delete color:", row, index);
    toast.success("Color deleted successfully!");
  };

  const handleExport = () => {
    console.log("Export colors");
    toast.success("Colors exported successfully!");
  };

  const handleAddColor = () => {
    setShowAddPopup(true);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setEditingColor(null);
  };

  // Calculate stats
  const totalColors = colorData.length;
  const colorsWithProducts = colorData.filter((c) => c.productCount > 0).length;
  const totalProducts = colorData.reduce(
    (sum, color) => sum + color.productCount,
    0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header - Same structure as product page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Colors</h1>
          <p className="text-gray-600">
            Manage your product colors and organize your catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddColor}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Color
          </button>
        </div>
      </div>

      {/* Add Color Popup */}
      <ColorPopup isOpen={showAddPopup} onClose={handleCloseAddPopup} />

      {/* Edit Color Popup */}
      <ColorPopup
        isOpen={showEditPopup}
        onClose={handleCloseEditPopup}
        initialData={editingColor || undefined}
      />

      {/* Statistics - Same structure as product page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Colors"
          value={totalColors.toString()}
          change="+12% from last month"
          Icon={Palette}
          color="text-purple-600"
        />
        <StatCard
          title="Colors in Use"
          value={colorsWithProducts.toString()}
          change={`${Math.round(
            (colorsWithProducts / totalColors) * 100
          )}% in use`}
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          change={`Avg ${Math.round(totalProducts / totalColors)} per color`}
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
                placeholder="Search colors..."
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

        {/* Table - Same as product page */}
        <DefaultTable
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          columns={colorColumns}
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
