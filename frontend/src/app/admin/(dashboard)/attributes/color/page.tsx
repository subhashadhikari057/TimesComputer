"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Palette,
  Calendar,
  Package,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  GenericDataTable,
  TableColumn,
  TableHeader,
} from "@/components/form/table/table";
import { FilterComponent, FilterConfig } from "@/components/admin/product/filter";
import { useFilters } from "@/hooks/useFilter";
import StatCard from "@/components/admin/dashboard/Statcards";
import AddDetailsPopup from "@/components/common/popup";
import { colorService } from "@/services/colorService";
import DefaultInput from "@/components/form/form-elements/DefaultInput";

// Type definitions
interface Color {
  id: number;
  name: string;
  hexCode: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
}

interface ColorFormData {
  name: string;
  hexCode: string;
}

const INITIAL_COLOR_FORM: ColorFormData = {
  name: "",
  hexCode: "#000000",
};

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
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ColorFormData>({
    ...INITIAL_COLOR_FORM,
  });
  const [showValidation, setShowValidation] = useState(false);

  // Initialize filters using the custom hook
  const { filters, updateFilter, resetFilters } = useFilters({
    search: '',
    sortBy: 'name',
    productCount: 'all'
  });

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search Colors',
      type: 'search',
      placeholder: 'Search by color name or hex code...',
      width: 'lg'
    },
    
    {
      key: 'productCount',
      label: 'Product Count',
      type: 'select',
      width: 'md',
      options: [
        { value: 'all', label: 'All Colors' },
        { value: 'high', label: 'High (50+)' },
        { value: 'medium', label: 'Medium (10-49)' },
        { value: 'low', label: 'Low (1-9)' },
        { value: 'empty', label: 'Empty (0)' }
      ]
    },
    {
      key: 'sortBy',
      label: 'Sort By',
      type: 'select',
      width: 'md',
      options: [
        { value: 'name', label: 'Sort by Name' },
        { value: 'products', label: 'Sort by Product Count' },
        { value: 'created', label: 'Sort by Date Created' },
        { value: 'updated', label: 'Sort by Last Updated' }
      ]
    }
  ];

  // Filter and sort colors
  const filteredColors = mockColors
    .filter((color) => {
      const searchTerm = filters.search as string;
      const filterProductCount = filters.productCount as string;

      const matchesSearch = color.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        color.hexCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      
      const matchesProductCount = (() => {
        if (filterProductCount === "all") return true;
        const count = color.productCount;
        switch (filterProductCount) {
          case "high": return count >= 50;
          case "medium": return count >= 10 && count <= 49;
          case "low": return count >= 1 && count <= 9;
          case "empty": return count === 0;
          default: return true;
        }
      })();

      return matchesSearch  && matchesProductCount;
    })
    .sort((a, b) => {
      const sortBy = filters.sortBy as string;
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "products":
          return b.productCount - a.productCount;
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

  // Calculate statistics
  const activeCount = mockColors.filter((c) => c.isActive).length;
  const totalProducts = mockColors.reduce((sum, c) => sum + c.productCount, 0);
  const averageProducts = Math.round(totalProducts / mockColors.length);

  // Event handlers
  const handleSelectAll = () => {
    setSelectedColors(
      selectedColors.length === filteredColors.length
        ? []
        : filteredColors.map((c) => c.id)
    );
  };

  const handleSelectColor = (colorId: number) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handleEdit = (colorId: number) => {
    router.push(`/admin/attributes/color/${colorId}/edit`);
  };

  const handleDelete = (colorId: number) => {
    console.log("Delete color:", colorId);
    toast.success("Color deleted successfully!");
    // TODO: Implement actual delete logic
  };

  const handleBulkDelete = () => {
    console.log("Bulk delete colors:", selectedColors);
    toast.success(`${selectedColors.length} colors deleted successfully!`);
    setSelectedColors([]);
    // TODO: Implement actual bulk delete logic
  };

  const handleExport = () => {
    console.log("Export colors");
    toast.success("Colors exported successfully!");
    // TODO: Implement export functionality
  };

  const handleAddColor = () => {
    setShowAddPopup(true);
  };

  // Form handlers
  const handleCancel = () => {
    setShowAddPopup(false);
    setForm({ ...INITIAL_COLOR_FORM });
    setShowValidation(false);
    setError(null);
  };

  const isFormValid = () => {
    return form.name.trim() !== "" && form.hexCode.trim() !== "";
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      const newColor = await colorService.createColor({
        name: form.name,
        hexCode: form.hexCode,
      });

      // Create a full color object with all required properties
      const fullColor: Color = {
        id: newColor.id,
        name: newColor.name,
        hexCode: newColor.hexCode,
        productCount: 0,
        isActive: true,
        createdAt: newColor.createdAt,
        updatedAt: newColor.updatedAt,
        sortOrder: 0,
      };

      toast.success("Color created successfully!");
      handleCancel();
    } catch (err) {
      setError("Failed to create color");
      console.error("Error creating color:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (updates: Partial<ColorFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  // Table configuration
  const tableHeader: TableHeader = {
    title: `Colors (${filteredColors.length})`,
    description: "Manage your product colors with advanced controls",
    headerActions: (
      <div className="flex items-center space-x-2">
        {selectedColors.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete ({selectedColors.length})
          </button>
        )}
        <button
          onClick={handleExport}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </button>
        <button
          onClick={handleAddColor}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Color
        </button>
      </div>
    ),
  };

  const columns: TableColumn<Color>[] = [
    {
      id: "color",
      label: "Color",
      width: "300px",
      render: (color) => (
        <div className="flex items-center space-x-4">
          <div
            className="h-12 w-12 rounded-lg border border-gray-300 shadow-sm"
            style={{ backgroundColor: color.hexCode }}
          ></div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {color.name}
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {color.hexCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "products",
      label: "Products",
      width: "120px",
      render: (color) => (
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className={`text-sm font-medium ${
            color.productCount === 0 
              ? 'text-red-600' 
              : color.productCount < 10 
                ? 'text-yellow-600' 
                : 'text-gray-900'
          }`}>
            {color.productCount}
          </span>
        </div>
      ),
    },
    {
      id: "hexCode",
      label: "Hex Code",
      width: "120px",
      render: (color) => (
        <div className="text-sm font-mono text-gray-900">
          {color.hexCode}
        </div>
      ),
    },
    
    {
      id: "created",
      label: "Created",
      width: "120px",
      render: (color) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(color.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Colors</h1>
          <p className="text-gray-600">
            Manage your product colors and organize your catalog
          </p>
        </div>
      </div>

      {/* Add Color Popup */}
      <AddDetailsPopup
        isOpen={showAddPopup}
        onClose={handleCancel}
        title="Add New Color"
        description="Create a new color for your products"
        onSave={handleSave}
        onCancel={handleCancel}
        saveButtonText={loading ? "Creating..." : "Add Color"}
        maxWidth="md"
      >
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <DefaultInput
            label="Color Name *"
            name="colorName"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            placeholder="Enter color name (e.g., Midnight Black, Ocean Blue)"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color & Hex Code *
            </label>
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
                style={{ backgroundColor: form.hexCode }}
              ></div>
              <div className="flex-1">
                <input
                  type="color"
                  value={form.hexCode}
                  onChange={(e) => updateForm({ hexCode: e.target.value })}
                  className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>
              <div className="flex-2">
                <input
                  type="text"
                  value={form.hexCode}
                  onChange={(e) => updateForm({ hexCode: e.target.value })}
                  placeholder="#000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {!isFormValid() && showValidation && !loading && (
            <p className="text-sm text-red-600">
              Please fill in all required fields: name and hex code.
            </p>
          )}
        </div>
      </AddDetailsPopup>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Colors"
          value={mockColors.length.toString()}
          change="+12% from last month"
          Icon={Palette}
          color="text-purple-600"
        />
        <StatCard
          title="Active Colors"
          value={activeCount.toString()}
          change={`${Math.round((activeCount / mockColors.length) * 100)}% active`}
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          change={`Avg ${averageProducts} per color`}
          Icon={Package}
          color="text-blue-600"
        />
      </div>

      {/* Reusable Filter Component */}
      <FilterComponent
        title="Filters & Search"
        description="Find and filter colors"
        filters={filterConfig}
        values={filters}
        onChange={updateFilter}
        onReset={resetFilters}
      />

      {/* Colors Table */}
      <GenericDataTable
        header={tableHeader}
        data={filteredColors}
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
        loading={loading}
        loadingMessage="Loading colors..."
        className="max-w-full"
      />
    </div>
  );
}