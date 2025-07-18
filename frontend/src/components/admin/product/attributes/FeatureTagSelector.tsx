"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllFeatureTags, createFeatureTag } from "@/api/featureTag";

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

  const handleTagChange = (tagId: number, checked: boolean) => {
    if (checked) {
      onFeatureTagsChange([...selectedFeatureTagIds, tagId]);
    } else {
      onFeatureTagsChange(selectedFeatureTagIds.filter(id => id !== tagId));
    }
  };

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
          className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} className="mr-1" />
          Add Feature Tag
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
        {loading ? (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        ) : featureTags.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-2">
            No feature tags available
          </p>
        ) : (
          <div className="space-y-2">
            {featureTags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFeatureTagIds.includes(tag.id)}
                  onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{tag.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {selectedFeatureTagIds.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            {selectedFeatureTagIds.length} feature tag(s) selected
          </p>
        </div>
      )}
    </div>
  );
} 