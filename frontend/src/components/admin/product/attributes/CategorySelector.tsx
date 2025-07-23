"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getAllCategories } from "@/api/category";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";
import CategoryPopup from "@/app/admin/(dashboard)/attributes/category/categoryPopup";

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  iconUrl?: string;
}

interface CategorySelectorProps {
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export default function CategorySelector({
  selectedCategoryId,
  onCategoryChange,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value: string | number | null) => {
    onCategoryChange(value as number | null);
  };

  const handleAddCategoryClick = () => {
    setShowCategoryModal(true);
  };

  const handleCategoryModalClose = () => {
    setShowCategoryModal(false);
  };

  const handleCategoryCreated = () => {
    loadCategories(); // Refresh the categories list
    setShowCategoryModal(false);
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <button
            type="button"
            onClick={handleAddCategoryClick}
            disabled={loading}
            className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-500 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} className="mr-1" />
            Add Category
          </button>
        </div>

        <Dropdown
          id="category"
          name="category"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          options={categoryOptions}
          placeholder="Select a category"
          disabled={loading}
          size="md"
        />
      </div>

      {/* Category Modal */}
      <CategoryPopup
        isOpen={showCategoryModal}
        onClose={handleCategoryModalClose}
        onSuccess={handleCategoryCreated}
      />
    </>
  );
}
