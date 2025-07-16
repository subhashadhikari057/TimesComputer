"use client";

import { useState } from "react";
import BrandSelector from "./BrandSelector";
import CategorySelector from "./CategorySelector";
import ColorSelector from "./ColorSelector";

interface AttributeSelectorProps {
  selectedBrandId: number | null;
  onBrandChange: (brandId: number | null) => void;
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  selectedColorIds: number[];
  onColorsChange: (colorIds: number[]) => void;
}

export default function AttributeSelector({
  selectedBrandId,
  onBrandChange,
  selectedCategoryId,
  onCategoryChange,
  selectedColorIds,
  onColorsChange,
}: AttributeSelectorProps) {
  return (
    <div className="space-y-6">
      <BrandSelector
        selectedBrandId={selectedBrandId}
        onBrandChange={onBrandChange}
      />

      <CategorySelector
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={onCategoryChange}
      />

      <ColorSelector
        selectedColorIds={selectedColorIds}
        onColorsChange={onColorsChange}
      />
    </div>
  );
}
