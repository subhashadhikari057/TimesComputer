"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllFeatureTags } from "@/api/featureTag";
import { MultiSelectDropdown } from "@/components/form/form-elements/DefaultDropdown";

interface FeatureTag {
  id: number;
  name: string;
}

interface FeatureTagSelectorProps {
  selectedFeatureTagIds: number[];
  onFeatureTagsChange: (tagIds: number[]) => void;
}

export default function FeatureTagSelector({
  selectedFeatureTagIds,
  onFeatureTagsChange,
}: FeatureTagSelectorProps) {
  const router = useRouter();
  const [featureTags, setFeatureTags] = useState<FeatureTag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeatureTags();
  }, []);

  const loadFeatureTags = async () => {
    try {
      setLoading(true);
      const response = await getAllFeatureTags();
      setFeatureTags(response.data || []);
    } catch (err) {
      console.error("Error loading feature tags:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (tagIds: (string | number)[]) => {
    // Convert to number array since our API expects numbers
    const numberIds = tagIds.map(id => Number(id));
    onFeatureTagsChange(numberIds);
  };

  const featureTagOptions = featureTags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Feature Tags
        </label>
        <button
          type="button"
          onClick={() => router.push("/admin/attributes/tag")}
          disabled={loading}
          className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-500 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} className="mr-1" />
          Add Feature Tag
        </button>
      </div>

      <MultiSelectDropdown
        id="featureTags"
        name="featureTags"
        value={selectedFeatureTagIds}
        onChange={handleTagsChange}
        options={featureTagOptions}
        placeholder="Select feature tags"
        disabled={loading}
        size="md"
      />

      {/* Selection count */}
      {selectedFeatureTagIds.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            {selectedFeatureTagIds.length} feature tag{selectedFeatureTagIds.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}