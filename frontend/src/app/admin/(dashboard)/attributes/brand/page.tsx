"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Award,
  Calendar,
  Package,
  Trash2,
  CheckCircle,
  XCircle,
  ImageIcon,
  TrendingUp,
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
import { brandService } from "@/services/brandService";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";
import IconUpload from "@/components/admin/product/iconUpload";

// Type definitions
interface Brand {
  id: number;
  name: string;
  description: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
  parentId: number | null;
  sortOrder: number;
}

interface BrandFormData {
  name: string;
  image: File | null;
  imagePreview: string;
  icon: File | null;
  iconPreview: string;
}

const INITIAL_BRAND_FORM: BrandFormData = {
  name: "",
  image: null,
  imagePreview: "",
  icon: null,
  iconPreview: "",
};

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
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BrandFormData>({
    ...INITIAL_BRAND_FORM,
  });
  const [showValidation, setShowValidation] = useState(false);

  // Initialize filters using the custom hook
  const { filters, updateFilter, resetFilters } = useFilters({
    search: '',
    status: 'all',
    sortBy: 'name',
    productCount: 'all'
  });

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search Brands',
      type: 'search',
      placeholder: 'Search by brand name or description...',
      width: 'lg'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      width: 'md',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'productCount',
      label: 'Product Count',
      type: 'select',
      width: 'md',
      options: [
        { value: 'all', label: 'All Brands' },
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

  // Filter and sort brands
  const filteredBrands = mockBrands
    .filter((brand) => {
      const searchTerm = filters.search as string;
      const filterStatus = filters.status as string;
      const filterProductCount = filters.productCount as string;

      const matchesSearch = brand.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && brand.isActive) ||
        (filterStatus === "inactive" && !brand.isActive);
      
      const matchesProductCount = (() => {
        if (filterProductCount === "all") return true;
        const count = brand.productCount;
        switch (filterProductCount) {
          case "high": return count >= 50;
          case "medium": return count >= 10 && count <= 49;
          case "low": return count >= 1 && count <= 9;
          case "empty": return count === 0;
          default: return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesProductCount;
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
  const activeCount = mockBrands.filter((b) => b.isActive).length;
  const totalProducts = mockBrands.reduce((sum, b) => sum + b.productCount, 0);
  const averageProducts = Math.round(totalProducts / mockBrands.length);

  // Event handlers
  const handleSelectAll = () => {
    setSelectedBrands(
      selectedBrands.length === filteredBrands.length
        ? []
        : filteredBrands.map((b) => b.id)
    );
  };

  const handleSelectBrand = (brandId: number) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleEdit = (brandId: number) => {
    router.push(`/admin/attributes/brand/${brandId}/edit`);
  };

  const handleDelete = (brandId: number) => {
    console.log("Delete brand:", brandId);
    toast.success("Brand deleted successfully!");
    // TODO: Implement actual delete logic
  };

  const handleBulkDelete = () => {
    console.log("Bulk delete brands:", selectedBrands);
    toast.success(`${selectedBrands.length} brands deleted successfully!`);
    setSelectedBrands([]);
    // TODO: Implement actual bulk delete logic
  };

  const handleExport = () => {
    console.log("Export brands");
    toast.success("Brands exported successfully!");
    // TODO: Implement export functionality
  };

  const handleAddBrand = () => {
    setShowAddPopup(true);
  };

  // Form handlers
  const handleCancel = () => {
    setShowAddPopup(false);
    setForm({ ...INITIAL_BRAND_FORM });
    setShowValidation(false);
    setError(null);
  };

  const isFormValid = () => {
    return form.name.trim() !== "" && form.image !== null && form.icon !== null;
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      const newBrand = await brandService.createBrand({
        name: form.name,
        image: form.image!,
        icon: form.icon!,
      });

      // Create a full brand object with all required properties
      const fullBrand: Brand = {
        id: newBrand.id,
        name: newBrand.name,
        description: `${newBrand.name} brand`,
        productCount: 0,
        isActive: true,
        createdAt: newBrand.createdAt,
        updatedAt: newBrand.updatedAt,
        image: newBrand.image,
        parentId: null,
        sortOrder: 0,
      };

      toast.success("Brand created successfully!");
      handleCancel();
    } catch (err) {
      setError("Failed to create brand");
      console.error("Error creating brand:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (files: File[], imageType: "image" | "icon") => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewKey = imageType === "image" ? "imagePreview" : "iconPreview";
      updateForm({
        [imageType]: file,
        [previewKey]: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (imageType: "image" | "icon") => {
    const previewKey = imageType === "image" ? "imagePreview" : "iconPreview";
    updateForm({
      [imageType]: null,
      [previewKey]: "",
    });
  };

  const updateForm = (updates: Partial<BrandFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  // Table configuration
  const tableHeader: TableHeader = {
    title: `Brands (${filteredBrands.length})`,
    description: "Manage your product brands with advanced controls",
    headerActions: (
      <div className="flex items-center space-x-2">
        {selectedBrands.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete ({selectedBrands.length})
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
          onClick={handleAddBrand}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Brand
        </button>
      </div>
    ),
  };

  const columns: TableColumn<Brand>[] = [
    {
      id: "brand",
      label: "Brand",
      width: "300px",
      render: (brand) => (
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {brand.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {brand.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "products",
      label: "Products",
      width: "120px",
      render: (brand) => (
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className={`text-sm font-medium ${
            brand.productCount === 0 
              ? 'text-red-600' 
              : brand.productCount < 10 
                ? 'text-yellow-600' 
                : 'text-gray-900'
          }`}>
            {brand.productCount}
          </span>
        </div>
      ),
    },
    {
      id: "image",
      label: "Image",
      width: "120px",
      render: (brand) => (
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Available
          </span>
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      width: "120px",
      render: (brand) => (
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            brand.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {brand.isActive ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3 mr-1" />
              Inactive
            </>
          )}
        </span>
      ),
    },
    {
      id: "created",
      label: "Created",
      width: "120px",
      render: (brand) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(brand.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Brands</h1>
          <p className="text-gray-600">
            Manage your product brands and organize your catalog
          </p>
        </div>
      </div>

      {/* Add Brand Popup */}
      <AddDetailsPopup
        isOpen={showAddPopup}
        onClose={handleCancel}
        title="Add New Brand"
        description="Create a new brand for your products"
        onSave={handleSave}
        onCancel={handleCancel}
        saveButtonText={loading ? "Creating..." : "Add Brand"}
        maxWidth="md"
      >
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <DefaultInput
            label="Brand Name *"
            name="brandName"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            placeholder="Enter brand name (e.g., Apple, Samsung)"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <PhotoUpload
                label="Brand Image"
                required
                images={form.image ? [form.image] : []}
                imagePreviews={form.imagePreview ? [form.imagePreview] : []}
                onImageUpload={(e) =>
                  handleImageUpload(Array.from(e.target.files || []), "image")
                }
                onRemoveImage={() => handleRemove("image")}
                maxImages={1}
                maxSizeText="up to 10MB each"
                acceptedFormats="PNG, JPG"
                uploadText="Click to upload image"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Icon *
              </label>
              <IconUpload
                images={form.icon ? [form.icon] : []}
                imagePreviews={form.iconPreview ? [form.iconPreview] : []}
                onImageUpload={(e) =>
                  handleImageUpload(Array.from(e.target.files || []), "icon")
                }
                onRemoveImage={() => handleRemove("icon")}
                maxImages={1}
              />
            </div>
          </div>

          {!isFormValid() && showValidation && !loading && (
            <p className="text-sm text-red-600">
              Please fill in all required fields: name, image, and icon.
            </p>
          )}
        </div>
      </AddDetailsPopup>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Brands"
          value={mockBrands.length.toString()}
          change="+12% from last month"
          Icon={Award}
          color="text-blue-600"
        />
        <StatCard
          title="Active Brands"
          value={activeCount.toString()}
          change={`${Math.round((activeCount / mockBrands.length) * 100)}% active`}
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          change={`Avg ${averageProducts} per brand`}
          Icon={Package}
          color="text-purple-600"
        />
      </div>

      {/* Reusable Filter Component */}
      <FilterComponent
        title="Filters & Search"
        description="Find and filter brands"
        filters={filterConfig}
        values={filters}
        onChange={updateFilter}
        onReset={resetFilters}
        
      />

      {/* Brands Table */}
      <GenericDataTable
        header={tableHeader}
        data={filteredBrands}
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
        loading={loading}
        loadingMessage="Loading brands..."
        className="max-w-full"
      />
    </div>
  );
}