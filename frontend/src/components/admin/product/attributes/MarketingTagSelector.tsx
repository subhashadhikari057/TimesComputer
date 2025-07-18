"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllMarketingTags, createMarketingTag } from "@/api/marketingTag";

interface MarketingTag {
  id: number;
  name: string;
}

interface MarketingTagSelectorProps {
  selectedMarketingTagIds: number[];
  onMarketingTagsChange: (tagIds: number[]) => void;
}

export default function MarketingTagSelector({
  selectedMarketingTagIds,
  onMarketingTagsChange,
}: MarketingTagSelectorProps) {
  const router = useRouter();
  const [marketingTags, setMarketingTags] = useState<MarketingTag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarketingTags();
  }, []);

  const loadMarketingTags = async () => {
    try {
      setLoading(true);
      const response = await getAllMarketingTags();
      setMarketingTags(response.data || []);
    } catch (err) {
      console.error("Error loading marketing tags:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (tagId: number, checked: boolean) => {
    if (checked) {
      onMarketingTagsChange([...selectedMarketingTagIds, tagId]);
    } else {
      onMarketingTagsChange(selectedMarketingTagIds.filter(id => id !== tagId));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Marketing Tags
        </label>
        <button
          type="button"
          onClick={() => router.push("/admin/attributes/marketing-tag")}
          disabled={loading}
          className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} className="mr-1" />
          Add Marketing Tag
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
        {loading ? (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : marketingTags.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-2">
            No marketing tags available
          </p>
        ) : (
          <div className="space-y-2">
            {marketingTags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMarketingTagIds.includes(tag.id)}
                  onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">{tag.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {selectedMarketingTagIds.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            {selectedMarketingTagIds.length} marketing tag(s) selected
          </p>
        </div>
      )}
    </div>
  );
} 