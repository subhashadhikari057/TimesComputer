"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  Package,
  Tag,
  Calendar,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ComponentCard from "@/components/common/ComponentsCard";
import {
  GenericDataTable,
  TableColumn,
  TableAction,
} from "@/components/form/table/table";
import StatCard from "@/components/admin/dashboard/Statcards";
import AddDetailsPopup from "@/components/common/popup";
import { categoryService } from "@/services/categoryService";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "@/components/admin/product/photoUpload";
import IconUpload from "@/components/admin/product/iconUpload";

// Type definitions
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
  parentId: number | null;
  sortOrder: number;
}

interface CategoryTableProps {
  categories: Category[];
  selectedCategories: number[];
  onSelectCategory: (categoryId: number) => void;
  onSelectAll: () => void;
  onEdit: (categoryId: number) => void;
  onDelete: (categoryId: number) => void;
  onDuplicate: (categoryId: number) => void;
  onToggleStatus: (categoryId: number) => void;
}

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

  const [showAddPopup, setShowAddPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
   const [form, setForm] = useState<CategoryFormData>({
      ...INITIAL_CATEGORY_FORM,
    });
    const [showValidation, setShowValidation] = useState(false);

  const handleCancel = () => {
    setShowAddPopup(false);
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
  
        // Create a full category object with all required properties
        const fullCategory: Category = {
          id: newCategory.id,
          name: newCategory.name,
          slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
          description: `${newCategory.name} category`,
          productCount: 0,
          isActive: true,
          createdAt: newCategory.createdAt,
          updatedAt: newCategory.updatedAt,
          image: newCategory.image,
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



// TODO: Replace with actual API integration
// Enhanced mock data for categories
const mockCategories = [
  {
    id: 1,
    name: "Laptops",
    slug: "laptops",
    description: "High-performance laptops and notebooks for work and gaming",
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
    name: "Gaming Laptops",
    slug: "gaming-laptops",
    description: "High-end gaming laptops with dedicated graphics cards",
    productCount: 18,
    isActive: true,
    createdAt: "2024-01-20",
    updatedAt: "2024-02-12",
    image: "/api/placeholder/150/150",
    parentId: 1,
    sortOrder: 1,
  },
  {
    id: 3,
    name: "Smartphones",
    slug: "smartphones",
    description: "Latest smartphones from top brands",
    productCount: 32,
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-02-08",
    image: "/api/placeholder/150/150",
    parentId: null,
    sortOrder: 2,
  },
  {
    id: 4,
    name: "Tablets",
    slug: "tablets",
    description: "Tablets and iPad for productivity and entertainment",
    productCount: 12,
    isActive: false,
    createdAt: "2024-01-25",
    updatedAt: "2024-02-05",
    image: "/api/placeholder/150/150",
    parentId: null,
    sortOrder: 3,
  },
  {
    id: 5,
    name: "Accessories",
    slug: "accessories",
    description: "Computer accessories and peripherals",
    productCount: 67,
    isActive: true,
    createdAt: "2024-01-08",
    updatedAt: "2024-02-15",
    image: "/api/placeholder/150/150",
    parentId: null,
    sortOrder: 4,
  },
];

// Custom Table Component for Categories using GenericDataTable
const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  selectedCategories,
  onSelectCategory,
  onSelectAll,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
}) => {
  const columns: TableColumn<Category>[] = [
    {
      id: "category",
      label: "Category",
      render: (category) => (
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-12 w-12">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {category.parentId ? "└─ " : ""}
              {category.name}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {category.description}
            </div>
            <div className="text-xs text-gray-400 font-mono mt-1">
              /{category.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "products",
      label: "Products",
      render: (category) => (
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">
            {category.productCount}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      render: (category) => (
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            category.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {category.isActive ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 mr-1" />
              Inactive
            </>
          )}
        </span>
      ),
    },
    {
      id: "created",
      label: "Created",
      render: (category) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(category.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const primaryAction: TableAction<Category> = {
    label: "Edit",
    icon: <Edit3 className="w-4 h-4 mr-1.5" />,
    onClick: (category) => onEdit(category.id),
  };

  const dropdownActions: TableAction<Category>[] = [
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      onClick: (category) => onDelete(category.id),
    },
    {
      label: "Duplicate",
      icon: <Copy className="w-4 h-4 mr-2" />,
      onClick: (category) => onDuplicate(category.id),
    },
    {
      label: "Toggle Status",
      icon: <CheckCircle className="w-4 h-4 mr-2" />,
      onClick: (category) => onToggleStatus(category.id),
    },
  ];

  return (
    <GenericDataTable
      data={categories}
      columns={columns}
      selectedItems={selectedCategories}
      onSelectItem={(id) => onSelectCategory(id as number)}
      onSelectAll={onSelectAll}
      primaryAction={primaryAction}
      dropdownActions={dropdownActions}
      getItemId={(category) => category.id}
      emptyMessage="No categories found"
      emptyIcon={<Tag className="w-12 h-12 text-gray-400" />}
    />
  );
};

export default function CategoryManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // TODO: Replace with actual API data
  const statuses = ["all", "active", "inactive"];

  // Enhanced filtering logic
  const filteredCategories = mockCategories
    .filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && category.isActive) ||
        (filterStatus === "inactive" && !category.isActive);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "products":
          return b.productCount - a.productCount;
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  // Helper functions for category actions
  const handleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((c) => c.id));
    }
  };

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
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

  // TODO: Implement actual CRUD operations with backend
  const handleEdit = (categoryId: number) => {
    router.push(`/admin/attributes/category/${categoryId}/edit`);
  };

  const handleDelete = (categoryId: number) => {
    console.log("Delete category:", categoryId);
    toast.success("Category deleted successfully!");
    // TODO: Implement actual delete logic
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

  const handleBulkDelete = () => {
    console.log("Bulk delete categories:", selectedCategories);
    toast.success(
      `${selectedCategories.length} categories deleted successfully!`
    );
    setSelectedCategories([]);
    // TODO: Implement actual bulk delete logic
  };

  const handleDuplicate = (categoryId: number) => {
    console.log("Duplicate category:", categoryId);
    toast.success("Category duplicated successfully!");
    // TODO: Implement actual duplicate logic
  };

  const handleToggleStatus = (categoryId: number) => {
    console.log("Toggle category status:", categoryId);
    toast.success("Category status updated!");
    // TODO: Implement actual status toggle logic
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">
            Manage your product categories and organize your catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {selectedCategories.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete ({selectedCategories.length})</span>
            </button>
          )}
          <button
            onClick={() => setShowAddPopup(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
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
                value={mockCategories.length.toString()}
                change="+12% from last month"
                Icon={Package}
                color="text-blue-600"
              />
                <StatCard
                title="Total Categories"
                value={mockCategories.length.toString()}
                change="+12% from last month"
                Icon={Package}
                color="text-blue-600"
              />
                <StatCard
                title="Total Categories"
                value={mockCategories.length.toString()}
                change="+12% from last month"
                Icon={Package}
                color="text-blue-600"
              />
             
            </div>




      {/* Enhanced Filters */}
      <ComponentCard title="Filters & Search" desc="Find and filter categories">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="products">Sort by Products</option>
              <option value="created">Sort by Date Created</option>
            </select>
          </div>
        </div>
      </ComponentCard>

      {/* Categories Table */}
      <ComponentCard
        title={`Categories (${filteredCategories.length})`}
        desc="Manage your product categories with advanced controls"
      >
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Link
              href="/admin/attributes/category/create"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Category</span>
            </Link>
          </div>
        ) : (
          <CategoryTable
            categories={filteredCategories}
            selectedCategories={selectedCategories}
            onSelectCategory={handleSelectCategory}
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
