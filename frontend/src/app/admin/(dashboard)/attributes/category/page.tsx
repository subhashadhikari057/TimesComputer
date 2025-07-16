"use client";

import { useState } from "react";
import { GenericDataTable } from "@/components/form/table/table";
import { Package, Plus, Tag, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/dashboard/Statcards";
import { toast } from "sonner";
import AddDetailsPopup from "@/components/common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";
import IconUpload from "@/components/admin/product/iconUpload";

// Import the refactored configuration
import {
  Category,
  useCategoryTable,
  getCategoryTableColumns,
  getCategoryTableHeader,
  calculateCategoryStats,
} from "./CategoryTableConfig";
import { categoryService } from "@/services/categoryService";

// Form data interface
interface CategoryFormData {
  name: string;
  image: File | null;
  imagePreview: string;
  icon: File | null;
  iconPreview: string;
}

const INITIAL_CATEGORY_FORM: CategoryFormData = {
  name: "",
  image: null,
  imagePreview: "",
  icon: null,
  iconPreview: "",
};

// Enhanced mock data for categories
const mockCategories: Category[] = [
  {
    id: 1,
    name: "Laptops",

    productCount: 45,
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-02-10",
    image: "/api/placeholder/150/150",
    icon: "/api/placeholder/icon/50/50",
    parentId: null,
    sortOrder: 1,
  },
  {
    id: 2,
    name: "Smartphones",
    productCount: 32,
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-02-08",
    image: "/api/placeholder/150/150",
    icon: "/api/placeholder/icon/50/50",
    parentId: null,
    sortOrder: 2,
  },
  {
    id: 3,
    name: "Tablets",

    productCount: 12,
    isActive: false,
    createdAt: "2024-01-25",
    updatedAt: "2024-02-05",
    image: "/api/placeholder/150/150",
    icon: "/api/placeholder/icon/50/50",
    parentId: null,
    sortOrder: 3,
  },
  {
    id: 4,
    name: "Accessories",

    productCount: 67,
    isActive: true,
    createdAt: "2024-01-08",
    updatedAt: "2024-02-15",
    image: "/api/placeholder/150/150",
    icon: "/api/placeholder/icon/50/50",
    parentId: null,
    sortOrder: 4,
  },
  {
    id: 5,
    name: "Gaming",

    productCount: 28,
    isActive: true,
    createdAt: "2024-01-20",
    updatedAt: "2024-02-12",
    image: "/api/placeholder/150/150",
    icon: "/api/placeholder/icon/50/50",
    parentId: null,
    sortOrder: 5,
  },
  {
    id: 6,
    name: "Audio",

    productCount: 19,
    isActive: false,
    createdAt: "2024-01-18",
    updatedAt: "2024-02-03",
    image: "/api/placeholder/150/150",
    icon: "/api/placeholder/icon/50/50",
    parentId: null,
    sortOrder: 6,
  },
];

// Main Component
export default function CategoryManagementPage() {
  const router = useRouter();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormData>({
    ...INITIAL_CATEGORY_FORM,
  });
  const [showValidation, setShowValidation] = useState(false);

  // Use the custom hook for table logic
  const {
    sortedCategories,
    selectedCategories,
    filters,
    updateFilter,
    resetFilters,
    sortConfig,
    handleSort,
    handleSelectAll,
    handleSelectCategory,
    clearSelections,
  } = useCategoryTable(mockCategories);

  // Calculate statistics
  const stats = calculateCategoryStats(mockCategories);

  // Event handlers
  const handleEdit = (categoryId: number) => {
    router.push(`/admin/attributes/category/${categoryId}/edit`);
  };

  const handleDelete = (categoryId: number) => {
    console.log("Delete category:", categoryId);
    toast.success("Category deleted successfully!");
    // TODO: Implement actual delete logic
  };

  const handleBulkDelete = () => {
    console.log("Bulk delete categories:", selectedCategories);
    toast.success(
      `${selectedCategories.length} categories deleted successfully!`
    );
    clearSelections();
    // TODO: Implement actual bulk delete logic
  };

  const handleExport = () => {
    console.log("Export categories");
    toast.success("Categories exported successfully!");
    // TODO: Implement export functionality
  };

  // Form handlers
  const handleCancel = () => {
    setShowAddPopup(false);
    setForm({ ...INITIAL_CATEGORY_FORM });
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

      const newCategory = await categoryService.createCategory({
        name: form.name,
        image: form.image!,
        icon: form.icon!,
      });

      // Create a complete Category object with all required properties
      const fullCategory: Category = {
        id: newCategory.id,
        name: newCategory.name,
        productCount: 0,
        isActive: true,
        createdAt: newCategory.createdAt,
        updatedAt: newCategory.updatedAt,
        image: newCategory.image,
        icon: newCategory.icon,
        parentId: null,
        sortOrder: 0,
      };

      setCategories((prev) => [...prev, fullCategory]);
      handleCancel();
    } catch (err) {
      setError("Failed to create category");
      console.error("Error creating category:", err);
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

  const updateForm = (updates: Partial<CategoryFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  // Get table configuration
  const tableHeader = getCategoryTableHeader(
    filters,
    updateFilter,
    resetFilters,
    selectedCategories,
    handleBulkDelete,
    handleExport
  );

  const columns = getCategoryTableColumns();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">
            Manage your product categories and organize your catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddPopup(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </button>
        </div>
      </div>

      {/* Add Category Popup */}
      <AddDetailsPopup
        isOpen={showAddPopup}
        onClose={handleCancel}
        title="Add New Category"
        description="Create a new category for your products"
        onSave={handleSave}
        onCancel={handleCancel}
        saveButtonText={loading ? "Creating..." : "Add Category"}
        maxWidth="md"
      >
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <DefaultInput
            label="Category Name *"
            name="categoryName"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            placeholder="Enter category name (e.g., Laptops, Smartphones)"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <PhotoUpload
                label="Category Image"
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
                Category Icon *
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
          title="Total Categories"
          value={stats.totalCategories.toString()}
          change="+12% from last month"
          Icon={Tag}
          color="text-purple-600"
        />
        <StatCard
          title="Active Categories"
          value={stats.activeCount.toString()}
          change={`${stats.activePercentage}% active`}
          Icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          change={`Avg ${stats.averageProducts} per category`}
          Icon={Package}
          color="text-blue-600"
        />
      </div>

      {/* Categories Table */}
      <GenericDataTable
        header={tableHeader}
        data={sortedCategories}
        columns={columns}
        selectedItems={selectedCategories}
        onSelectItem={(id) => handleSelectCategory(id as number)}
        onSelectAll={handleSelectAll}
        onEdit={(category) => handleEdit(category.id)}
        onDelete={(category) => handleDelete(category.id)}
        showSelection={true}
        showActions={true}
        getItemId={(category) => category.id}
        emptyMessage="No categories found matching your criteria"
        emptyIcon={<Tag className="w-12 h-12 text-gray-400" />}
        loading={loading}
        loadingMessage="Loading categories..."
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  );
}
