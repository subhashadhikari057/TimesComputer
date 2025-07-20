"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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

  const colorOptions = colors.map((color) => ({
    value: color.id,
    label: color.name,
  }));

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