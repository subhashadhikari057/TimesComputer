"use client";

import { useState } from "react";
import { CategoryCard } from "./categoriecard";
import { useMediaQuery } from "@/hooks/use-media-query";

const TopCategories = () => {
  const categories = [
    { id: 1, title: "Gaming laptop", image: "/products/Frame 68.png" },
    { id: 2, title: "Business laptop", image: "/products/Frame 134.png" },
    { id: 3, title: "Student laptop", image: "/products/Frame 135.png" },
    { id: 4, title: "Everyday laptop", image: "/products/Frame 136.png" },
    { id: 5, title: "Mac", image: "/topcat/mac.avif" },
    { id: 6, title: "Keyboard", image: "/topcat/keyboard.jpeg" },
    { id: 7, title: "Mouse", image: "/topcat/mouse.png" },
    { id: 8, title: "Monitor", image: "/topcat/monitor.jpeg" },
  ];

  const [showAll, setShowAll] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const visibleCategories =
    isMobile && !showAll ? categories.slice(0, 4) : categories;

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 md:pb-2">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 overflow-x-auto">
        {visibleCategories.map((category) => (
          <CategoryCard
            key={category.id}
            image={category.image}
            title={category.title}
            onClick={() => { }}
            className="min-h-[60px] md:min-h-[80px]"
          />
        ))}
      </div>

      <div className="mt-4 md:hidden text-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-primary font-medium hover:underline"
        >
          {showAll ? "View Less" : "View More"}
        </button>
      </div>
    </div>
  );
};

export default TopCategories;
