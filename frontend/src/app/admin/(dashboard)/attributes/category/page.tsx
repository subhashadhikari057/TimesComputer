"use client";

import { useState } from "react";
import { GenericDataTable } from "@/components/form/table/table";
import { Package, Plus, Tag, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/dashboard/Statcards";
import { toast } from "sonner";

// Import the refactored configuration
import {
  Category,
  useCategoryTable,
  getCategoryTableColumns,
  getCategoryTableHeader,
  calculateCategoryStats,
} from "./CategoryTableConfig";
import { categoryService } from "@/services/categoryService";
import AttributePopup, { ATTRIBUTE_CONFIGS } from "../attribute_popup";

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
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

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
  } = useCategoryTable(categories);

  // Calculate statistics
  const stats = calculateCategoryStats(categories);

  // Event handlers
  const handleEdit = async (categoryId: number) => {
    try {
      setLoading(true);
      // For now, use mock data since we don't have real API
      const categoryData = categories.find((cat) => cat.id === categoryId);
      if (categoryData) {
        setEditingCategory(categoryData);
        setShowEditPopup(true);
      } else {
        toast.error("Category not found");
      }
      // Uncomment when API is ready:
      // const categoryData = await categoryService.getCategoryById(categoryId);
      // setEditingCategory(categoryData);
      // setShowEditPopup(true);
    } catch (error) {
      console.error("Error loading category:", error);
      toast.error("Failed to load category data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (categoryId: number) => {
    setCategories((prev) =>
      prev.filter((category) => category.id !== categoryId)
    );
    toast.success("Category deleted successfully!");
  };

  const handleBulkDelete = () => {
    setCategories((prev) =>
      prev.filter((category) => !selectedCategories.includes(category.id))
    );
    toast.success(
      `${selectedCategories.length} categories deleted successfully!`
    );
    clearSelections();
  };

  const handleExport = () => {
    console.log("Export categories");
    toast.success("Categories exported successfully!");
    // TODO: Implement export functionality
  };

  const handleAddCategory = () => {
    setShowAddPopup(true);
  };

  // Category creation handler
  const handleCategorySave = async (data: any) => {
    try {
      // If using the service, uncomment this:
      // const newCategory = await categoryService.createCategory({
      //   name: data.name,
      //   image: data.image!,
      //   icon: data.icon!,
      // });

      // Create new category object
      const newCategory: Category = {
        id: Date.now(),
        name: data.name,
        productCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        image: data.image
          ? URL.createObjectURL(data.image)
          : "/api/placeholder/150/150",
        icon: data.icon
          ? URL.createObjectURL(data.icon)
          : "/api/placeholder/icon/50/50",
        parentId: data.parentId || null,
        sortOrder: categories.length + 1,
      };

      // Add to categories list
      setCategories((prev) => [...prev, newCategory]);

      // TODO: Implement actual API call here
      console.log("Creating category with:", data);
    } catch (err) {
      console.error("Error creating category:", err);
      throw err; // Re-throw to let AttributePopup handle the error
    }
  };

  // Category update handler
  const handleCategoryUpdate = async (data: any) => {
    try {
      // For now, use mock update since we don't have real API
      // await categoryService.updateCategory(editingCategory.id, data);

      // Update the category in the local state
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: data.name,
                description: data.description,
                updatedAt: new Date().toISOString(),
                // Only update image/icon if new ones were provided
                ...(data.image && { image: URL.createObjectURL(data.image) }),
                ...(data.icon && { icon: URL.createObjectURL(data.icon) }),
              }
            : cat
        )
      );

      setEditingCategory(null);
      setShowEditPopup(false);
      toast.success("Category updated successfully!");
    } catch (err) {
      console.error("Error updating category:", err);
      throw err; // Re-throw to let AttributePopup handle the error
    }
  };

  // Create category configuration with custom save handler and parent options
  const categoryConfig = {
    ...ATTRIBUTE_CONFIGS.category,
    parentOptions: categories.map((cat) => ({ id: cat.id, name: cat.name })),
    onSave: handleCategorySave,
  };

  // Edit category configuration
  const editCategoryConfig = {
    ...ATTRIBUTE_CONFIGS.category,
    title: "Edit Category",
    description: "Update category information",
    parentOptions: categories
      .filter((cat) => cat.id !== editingCategory?.id)
      .map((cat) => ({ id: cat.id, name: cat.name })),
    onSave: handleCategoryUpdate,
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
            onClick={handleAddCategory}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </button>
        </div>
      </div>

      {/* Add Category Popup */}
      <AttributePopup
        isOpen={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        config={categoryConfig}
      />

      {/* Edit Category Popup */}
      <AttributePopup
        isOpen={showEditPopup}
        onClose={() => {
          setShowEditPopup(false);
          setEditingCategory(null);
        }}
        config={editCategoryConfig}
        initialData={editingCategory}
      />

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
        loadingMessage="Loading categories..."
        sortConfig={sortConfig}
        onSort={handleSort}
        className="max-w-full"
        loading={loading}
      />
    </div>
  );
}
