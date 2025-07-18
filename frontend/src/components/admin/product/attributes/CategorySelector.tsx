"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllCategories, createCategory } from "@/api/category";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";

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
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

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

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <button
          type="button"
          onClick={() => router.push("/admin/attributes/category")}
          disabled={loading}
          className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
