"use client";

import { useState } from "react";
import { GenericDataTable } from "@/components/form/table/table";
import { Package, Plus, Palette, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/dashboard/Statcards";
import { toast } from "sonner";

// Import the refactored configuration
import {
  Color,
  useColorTable,
  getColorTableColumns,
  getColorTableHeader,
  calculateColorStats,
} from "./ColorTableConfig";
import AttributePopup, { ATTRIBUTE_CONFIGS } from "../attribute_popup";

// Enhanced mock data for colors
const mockColors: Color[] = [
  {
    id: 1,
    name: "Midnight Black",
    hexCode: "#000000",
    productCount: 45,
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-02-10",
    sortOrder: 1,
  },
  {
    id: 2,
    name: "Snow White",
    hexCode: "#FFFFFF",
    productCount: 32,
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-02-08",
    sortOrder: 2,
  },
  {
    id: 3,
    name: "Ocean Blue",
    hexCode: "#0066CC",
    productCount: 12,
    isActive: false,
    createdAt: "2024-01-25",
    updatedAt: "2024-02-05",
    sortOrder: 3,
  },
  {
    id: 4,
    name: "Forest Green",
    hexCode: "#228B22",
    productCount: 67,
    isActive: true,
    createdAt: "2024-01-08",
    updatedAt: "2024-02-15",
    sortOrder: 4,
  },
  {
    id: 5,
    name: "Sunset Orange",
    hexCode: "#FF6347",
    productCount: 23,
    isActive: true,
    createdAt: "2024-01-20",
    updatedAt: "2024-02-12",
    sortOrder: 5,
  },
  {
    id: 6,
    name: "Purple Rain",
    hexCode: "#8A2BE2",
    productCount: 8,
    isActive: false,
    createdAt: "2024-01-18",
    updatedAt: "2024-02-03",
    sortOrder: 6,
  },
  {
    id: 7,
    name: "Rose Gold",
    hexCode: "#E8B4A0",
    productCount: 0,
    isActive: true,
    createdAt: "2024-01-22",
    updatedAt: "2024-02-01",
    sortOrder: 7,
  },
  {
    id: 8,
    name: "Silver",
    hexCode: "#C0C0C0",
    productCount: 28,
    isActive: true,
    createdAt: "2024-01-12",
    updatedAt: "2024-02-14",
    sortOrder: 8,
  },
];

// Main Component
export default function ColorManagementPage() {
  const router = useRouter();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingColor, setEditingColor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState<Color[]>(mockColors);

  // Use the custom hook for table logic
  const {
    sortedColors,
    selectedColors,
    filters,
    updateFilter,
    resetFilters,
    sortConfig,
    handleSort,
    handleSelectAll,
    handleSelectColor,
    clearSelections,
  } = useColorTable(colors);

  // Calculate statistics
  const stats = calculateColorStats(colors);

  // Event handlers
  const handleEdit = async (colorId: number) => {
    try {
      setLoading(true);
      // For now, get color from local state
      const colorData = colors.find((c) => c.id === colorId);
      if (colorData) {
        setEditingColor(colorData);
        setShowEditPopup(true);
      }
    } catch (error) {
      console.error("Error loading color:", error);
      toast.error("Failed to load color data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (colorId: number) => {
    setColors((prev) => prev.filter((color) => color.id !== colorId));
    toast.success("Color deleted successfully!");
  };

  const handleBulkDelete = () => {
    setColors((prev) =>
      prev.filter((color) => !selectedColors.includes(color.id))
    );
    toast.success(`${selectedColors.length} colors deleted successfully!`);
    clearSelections();
  };

  const handleExport = () => {
    console.log("Export colors");
    toast.success("Colors exported successfully!");
    // TODO: Implement export functionality
  };

  const handleAddColor = () => {
    setShowAddPopup(true);
  };

  // Color creation handler
  const handleColorSave = async (data: any) => {
    try {
      // Create new color object
      const newColor: Color = {
        id: Date.now(),
        name: data.name,
        hexCode: data.color, // AttributePopup uses 'color' field for hex values
        productCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sortOrder: colors.length + 1,
      };

      // Add to colors list
      setColors((prev) => [...prev, newColor]);

      // TODO: Implement actual API call here
      console.log("Creating color with:", data);
    } catch (err) {
      console.error("Error creating color:", err);
      throw err; // Re-throw to let AttributePopup handle the error
    }
  };

  // Color update handler
  const handleColorUpdate = async (data: any) => {
    try {
      // For now, use mock update since we don't have real API
      // await colorService.updateColor(editingColor.id, data);

      // Update the color in the local state
      setColors((prev) =>
        prev.map((color) =>
          color.id === editingColor.id
            ? {
                ...color,
                name: data.name,
                hexCode: data.color,
                updatedAt: new Date().toISOString(),
              }
            : color
        )
      );

      setEditingColor(null);
      setShowEditPopup(false);
      toast.success("Color updated successfully!");

      // Uncomment when API is ready:
      // await colorService.updateColor(editingColor.id, data);
    } catch (err) {
      console.error("Error updating color:", err);
      throw err; // Re-throw to let AttributePopup handle the error
    }
  };

  // Create color configuration with custom save handler
  const colorConfig = {
    ...ATTRIBUTE_CONFIGS.color,
    onSave: handleColorSave,
  };

  // Edit color configuration
  const editColorConfig = {
    ...ATTRIBUTE_CONFIGS.color,
    title: "Edit Color",
    description: "Update color information",
    onSave: handleColorUpdate,
  };

  // Get table configuration
  const tableHeader = getColorTableHeader(
    filters,
    updateFilter,
    resetFilters,
    selectedColors,
    handleBulkDelete,
    handleExport
  );

  const columns = getColorTableColumns();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
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
      <AttributePopup
        isOpen={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        config={colorConfig}
      />

      {/* Edit Color Popup */}
      <AttributePopup
        isOpen={showEditPopup}
        onClose={() => {
          setShowEditPopup(false);
          setEditingColor(null);
        }}
        config={editColorConfig}
        initialData={
          editingColor ? { ...editingColor, color: editingColor.hexCode } : null
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Colors"
          value={stats.totalColors.toString()}
          change="+12% from last month"
          Icon={Palette}
          color="text-purple-600"
        />
        <StatCard
          title="Active Colors"
          value={stats.activeCount.toString()}
          change={`${stats.activePercentage}% active`}
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          change={`Avg ${stats.averageProducts} per color`}
          Icon={Package}
          color="text-blue-600"
        />
      </div>

      {/* Colors Table */}
      <GenericDataTable
        header={tableHeader}
        data={sortedColors}
        columns={columns}
        selectedItems={selectedColors}
        onSelectItem={(id) => handleSelectColor(id as number)}
        onSelectAll={handleSelectAll}
        onEdit={(color) => handleEdit(color.id)}
        onDelete={(color) => handleDelete(color.id)}
        showSelection={true}
        showActions={true}
        getItemId={(color) => color.id}
        emptyMessage="No colors found matching your criteria"
        emptyIcon={<Palette className="w-12 h-12 text-gray-400" />}
        loadingMessage="Loading colors..."
        sortConfig={sortConfig}
        onSort={handleSort}
        className="max-w-full"
      />
    </div>
  );
}
