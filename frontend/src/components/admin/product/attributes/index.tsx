"use client";


import BrandSelector from "./BrandSelector";
import CategorySelector from "./CategorySelector";
import ColorSelector from "./ColorSelector";
import FeatureTagSelector from "./FeatureTagSelector";
import MarketingTagSelector from "./MarketingTagSelector";

interface AttributeSelectorProps {
  selectedBrandId: number | null;
  onBrandChange: (brandId: number | null) => void;
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  selectedColorIds: number[];
  onColorsChange: (colorIds: number[]) => void;
  selectedFeatureTagIds: number[];
  onFeatureTagsChange: (tagIds: number[]) => void;
  selectedMarketingTagIds: number | null;
  onMarketingTagsChange: (tagIds: number | null) => void;
}

export default function AttributeSelector({
  selectedBrandId,
  onBrandChange,
  selectedCategoryId,
  onCategoryChange,
  selectedColorIds,
  onColorsChange,
  selectedFeatureTagIds,
  onFeatureTagsChange,
  selectedMarketingTagIds,
  onMarketingTagsChange,
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

      <FeatureTagSelector
        selectedFeatureTagIds={selectedFeatureTagIds}
        onFeatureTagsChange={onFeatureTagsChange}
      />

      <MarketingTagSelector
        selectedMarketingTagIds={selectedMarketingTagIds}
        onMarketingTagsChange={onMarketingTagsChange}
      />
    </div>
  );
}
