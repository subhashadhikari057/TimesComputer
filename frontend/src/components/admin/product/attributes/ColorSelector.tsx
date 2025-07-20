"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllColors } from "@/api/color";
import { MultiSelectDropdown } from "@/components/form/form-elements/DefaultDropdown";

interface Color {
  id: number;
  name: string;
  hexCode: string;
}

interface ColorSelectorProps {
  selectedColorIds: number[];
  onColorsChange: (colorIds: number[]) => void;
}

export default function ColorSelector({
  selectedColorIds,
  onColorsChange,
}: ColorSelectorProps) {
  const router = useRouter();
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    try {
      setLoading(true);
      const response = await getAllColors();
      setColors(response.data || []);
    } catch (err) {
      console.error("Error loading colors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleColorsChange = (colorIds: (string | number)[]) => {
    const numberIds = colorIds.map(id => Number(id));
    onColorsChange(numberIds);
  };

  // Enhanced options with hex codes
  const colorOptions = colors.map((color) => ({
    value: color.id,
    label: color.name,
    hexCode: color.hexCode,
  }));

  // Custom renderer for selected color tags
  const renderSelectedColorTag = (option: any) => {
    const handleRemoveTag = (e: React.MouseEvent) => {
      e.stopPropagation();
      onColorsChange(selectedColorIds.filter(id => id !== option.value));
    };

    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
        <div 
          className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
          style={{ backgroundColor: option.hexCode }}
          title={option.hexCode}
        />
        <span className="truncate max-w-[80px]">{option.label}</span>
        <button
          type="button"
          onClick={handleRemoveTag}
          className="ml-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <X size={10} />
        </button>
      </span>
    );
  };

  // Custom renderer for dropdown options
  const renderColorOption = (option: any, isSelected: boolean) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div 
          className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"
          style={{ backgroundColor: option.hexCode }}
          title={option.hexCode}
        />
        <div className="flex flex-col">
          <span className="font-medium">{option.label}</span>
          <span className="text-xs text-gray-500 uppercase">{option.hexCode}</span>
        </div>
      </div>
      {isSelected && (
        <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Colors
        </label>
        <button
          type="button"
          onClick={() => router.push("/admin/attributes/color")}
          disabled={loading}
          className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} className="mr-1" />
          Add Color
        </button>
      </div>

      <MultiSelectDropdown
        id="colors"
        name="colors"
        value={selectedColorIds}
        onChange={handleColorsChange}
        options={colorOptions}
        placeholder="Select colors..."
        disabled={loading}
        size="md"
        renderSelectedTag={renderSelectedColorTag}
        renderOption={renderColorOption}
      />

      {/* Selection count */}
      {selectedColorIds.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            {selectedColorIds.length} color{selectedColorIds.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}