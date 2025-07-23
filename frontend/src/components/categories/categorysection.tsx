"use client";

import { useState, useEffect } from "react";
import { CategoryCard } from "./categoriecard";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";
import { getAllCategories } from "@/api/category";
import { getImageUrl } from "@/lib/imageUtils";
import SkeletonLoader from "../common/skeletonloader";

interface Category {
  id: number;
  title: string;
  displayTitle: string;
  image: string;
}

const TopCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Transform backend categories to component format
  const transformCategories = (backendCategories: { id: number; name: string; image: string }[]): Category[] => {
    return backendCategories.map((category) => ({
      id: category.id,
      title: category.name.toLowerCase(),
      displayTitle: category.name,
      image: getImageUrl(category.image)
    }));
  };

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllCategories();
        const categoriesData = response.data || [];
        const transformedCategories = transformCategories(categoriesData);
        setCategories(transformedCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
        // Fallback to empty array on error
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const visibleCategories =
    isMobile && !showAll ? categories.slice(0, 4) : categories;

  if (loading) {
    return (
      <div className=" max-w-7xl mx-auto">
       <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
        </div>
        <div className="flex py-8">
          <SkeletonLoader type="category-pill" count={4} className="mr-4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-3 md:px-4 md:pb-2">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          {error}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-3 md:px-4 md:pb-2">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          No categories available
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 md:pb-2">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 overflow-x-auto">
        {visibleCategories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${encodeURIComponent(category.title)}`}
          >
            <CategoryCard
              image={category.image}
              title={category.displayTitle}
              onClick={() => { }}
              className="min-h-[60px] md:min-h-[80px]"
            />
          </Link>
        ))}
      </div>

      {categories.length > 4 && (
        <div className="mt-4 md:hidden text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary font-medium hover:underline"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopCategories;
