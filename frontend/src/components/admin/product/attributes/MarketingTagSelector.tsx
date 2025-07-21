"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllMarketingTags } from "@/api/marketingTag";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";

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

  const handleTagsChange = (tagIds: string | number | null) => {
    // Convert single selection to array for backend
    const arrayValue = tagIds !== null ? [Number(tagIds)] : [];
    onMarketingTagsChange(arrayValue);
  };

  const marketingTagOptions = marketingTags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

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
          className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-500 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} className="mr-1" />
          Add Marketing Tag
        </button>
      </div>

      <Dropdown
        id="marketingTags"
        name="marketingTags"
        value={selectedMarketingTagIds.length > 0 ? selectedMarketingTagIds[0] : null}
        onChange={handleTagsChange}
        options={marketingTagOptions}
        placeholder="Select a marketing tag"
        disabled={loading}
        size="md"
      />
    </div>
  );
}