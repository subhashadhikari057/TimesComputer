"use client";

import { useState } from "react";
import { GenericDataTable } from "@/components/form/table/table";
import { Package, Plus, Award, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/dashboard/Statcards";
import { toast } from "sonner";

// Import the refactored configuration
import {
  Brand,
  useBrandTable,
  getBrandTableColumns,
  getBrandTableHeader,
  calculateBrandStats,
} from "./BrandTableConfig";
import AttributePopup, { ATTRIBUTE_CONFIGS } from "../attribute_popup";

// Enhanced mock data for brands
const mockBrands: Brand[] = [
  {
    id: 1,
    name: "Apple",
    description: "Premium technology products and innovative devices",
    productCount: 45,
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-02-10",
    image: "/api/placeholder/150/150",
    parentId: null,
    sortOrder: 1,
  },
  {
    id: 2,
    name: "Samsung",
    description: "Global leader in technology and electronics",
    productCount: 32,
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-02-08",
    image: "/api/placeholder/150/150",
    parentId: null,
    sortOrder: 2,
  },
  {
    id: 3,
    name: "Google",
    description: "Search, cloud, and consumer technology products",
    productCount: 12,
    isActive: false,
    createdAt: "2024-01-25",
    updatedAt: "2024-02-05",
    image: "/api/placeholder/150/150",
    parentId: null,
    sortOrder: 3,
  },
  {
    id: 4,
    name: "Microsoft",
    description: "Software, cloud computing, and productivity tools",
    productCount: 67,
    isActive: true,
    createdAt: "2024-01-08",
    updatedAt: "2024-02-15",
    image: "/api/placeholder/150/150",
    parentId: null,
    sortOrder: 4,
  },
  {
    id: 5,
    name: "Dell",
    description: "Computer hardware and enterprise solutions",
    productCount: 28,
    isActive: true,
    createdAt: "2024-01-20",
    updatedAt: "2024-02-12",
    image: "/api/placeholder/150/150",
    parentId: null,
    sortOrder: 5,
  },
  {
    id: 6,
    name: "HP",
    description: "Personal computing and printing solutions",
    productCount: 19,
    isActive: false,
    createdAt: "2024-01-18",
    updatedAt: "2024-02-03",
    image: "/api/placeholder/150/150",
    parentId: null,
    sortOrder: 6,
  },
  {
    id: 7,
    name: "Sony",
    description: "Consumer electronics and entertainment technology",
    productCount: 0,
    isActive: true,
    createdAt: "2024-01-22",
    updatedAt: "2024-02-01",
    image: "/api/placeholder/150/150",
    parentId: null,
    sortOrder: 7,
  },
];

// Main Component
export default function BrandManagementPage() {
  const router = useRouter();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [brands, setBrands] = useState<Brand[]>(mockBrands);

  // Use the custom hook for table logic
  const {
    sortedBrands,
    selectedBrands,
    filters,
    updateFilter,
    resetFilters,
    sortConfig,
    handleSort,
    handleSelectAll,
    handleSelectBrand,
    clearSelections,
  } = useBrandTable(brands);

  // Calculate statistics
  const stats = calculateBrandStats(brands);

  // Event handlers
  const handleEdit = (brandId: number) => {
    router.push(`/admin/attributes/brand/${brandId}/edit`);
  };

  const handleDelete = (brandId: number) => {
    setBrands(prev => prev.filter(brand => brand.id !== brandId));
    toast.success("Brand deleted successfully!");
  };

  const handleBulkDelete = () => {
    setBrands(prev => prev.filter(brand => !selectedBrands.includes(brand.id)));
    toast.success(`${selectedBrands.length} brands deleted successfully!`);
    clearSelections();
  };

  const handleExport = () => {
    console.log("Export brands");
    toast.success("Brands exported successfully!");
    // TODO: Implement export functionality
  };

  const handleAddBrand = () => {
    setShowAddPopup(true);
  };

  // Brand creation handler
  const handleBrandSave = async (data: any) => {
    // Create new brand object
    const newBrand: Brand = {
      id: Date.now(),
      name: data.name,
      description: data.description || `${data.name} brand`,
      productCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      image: data.image ? URL.createObjectURL(data.image) : "/api/placeholder/150/150",
      parentId: null,
      sortOrder: brands.length + 1,
    };

    // Add to brands list
    setBrands(prev => [...prev, newBrand]);
    
    // TODO: Implement actual API call here
    console.log("Creating brand with:", data);
  };

  // Create brand configuration with custom save handler
  const brandConfig = {
    ...ATTRIBUTE_CONFIGS.brand,
    onSave: handleBrandSave
  };

  // Get table configuration
  const tableHeader = getBrandTableHeader(
    filters,
    updateFilter,
    resetFilters,
    selectedBrands,
    handleBulkDelete,
    handleExport
  );

  const columns = getBrandTableColumns();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Brands</h1>
          <p className="text-gray-600">
            Manage your product brands and organize your catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddBrand}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Brand
          </button>
        </div>
      </div>

      {/* Add Brand Popup */}
      <AttributePopup
        isOpen={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        config={brandConfig}
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Brands"
          value={stats.totalBrands.toString()}
          change="+12% from last month"
          Icon={Award}
          color="text-blue-600"
        />
        <StatCard
          title="Active Brands"
          value={stats.activeCount.toString()}
          change={`${stats.activePercentage}% active`}
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          change={`Avg ${stats.averageProducts} per brand`}
          Icon={Package}
          color="text-purple-600"
        />
      </div>

      {/* Brands Table */}
      <GenericDataTable
        header={tableHeader}
        data={sortedBrands}
        columns={columns}
        selectedItems={selectedBrands}
        onSelectItem={(id) => handleSelectBrand(id as number)}
        onSelectAll={handleSelectAll}
        onEdit={(brand) => handleEdit(brand.id)}
        onDelete={(brand) => handleDelete(brand.id)}
        showSelection={true}
        showActions={true}
        getItemId={(brand) => brand.id}
        emptyMessage="No brands found matching your criteria"
        emptyIcon={<Award className="w-12 h-12 text-gray-400" />}
        loadingMessage="Loading brands..."
        sortConfig={sortConfig}
        onSort={handleSort}
        className="max-w-full"
      />
    </div>
  );
}