"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getAllMarketingTags } from "@/api/marketingTag";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";
import MarketingTagPopup from "@/app/admin/(dashboard)/attributes/marketing-tag/marketingTagPopup";

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
  const [marketingTags, setMarketingTags] = useState<MarketingTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMarketingTagModal, setShowMarketingTagModal] = useState(false);

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
    // Handle "None" selection (value: 0) or null
    if (tagIds === 0 || tagIds === null) {
      onMarketingTagsChange([]); // Clear selection
    } else {
      // Convert single selection to array for backend
      onMarketingTagsChange([Number(tagIds)]);
    }
  };

  const handleAddMarketingTagClick = () => {
    setShowMarketingTagModal(true);
  };

  const handleMarketingTagModalClose = () => {
    setShowMarketingTagModal(false);
  };

  const handleMarketingTagCreated = () => {
    loadMarketingTags(); // Refresh the marketing tags list
    setShowMarketingTagModal(false);
  };

  // Create options with "None" option at the beginning
  const marketingTagOptions = [
    { value: 0, label: "None" }, // Special "None" option
    ...marketingTags.map((tag) => ({
      value: tag.id,
      label: tag.name,
    }))
  ];

  // Determine current selection value
  const currentValue = selectedMarketingTagIds.length > 0 ? selectedMarketingTagIds[0] : 0;

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Marketing Tags
          </label>
          <button
            type="button"
            onClick={handleAddMarketingTagClick}
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
          value={currentValue}
          onChange={handleTagsChange}
          options={marketingTagOptions}
          placeholder="Select a marketing tag"
          disabled={loading}
          size="md"
        />

        {/* Show current selection info */}
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            {selectedMarketingTagIds.length > 0 
              ? `Selected: ${marketingTags.find(tag => tag.id === selectedMarketingTagIds[0])?.name || 'Unknown'}`
              : 'No marketing tag selected'
            }
          </p>
        </div>
      </div>

      {/* Marketing Tag Modal */}
      <MarketingTagPopup
        isOpen={showMarketingTagModal}
        onClose={handleMarketingTagModalClose}
        onSuccess={handleMarketingTagCreated}
      />
    </>
  );
}