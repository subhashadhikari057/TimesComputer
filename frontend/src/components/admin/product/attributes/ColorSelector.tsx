"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllColors, createColor } from "@/api/color";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";

interface Color {
  id: number;
  name: string;
  hexCode: string;
}

interface ColorSelectorProps {
  selectedColorIds: number[];
  onColorsChange: (colorIds: number[]) => void;
}

interface ColorFormData {
  name: string;
  hexCode: string;
}

const INITIAL_COLOR_FORM: ColorFormData = {
  name: "",
  hexCode: "",
};

export default function ColorSelector({
  selectedColorIds,
  onColorsChange,
}: ColorSelectorProps) {
  const router = useRouter();
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ColorFormData>({ ...INITIAL_COLOR_FORM });

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

 

  const handleColorChange = (value: string | number | null) => {
    if (
      value &&
      typeof value === "number" &&
      !selectedColorIds.includes(value)
    ) {
      onColorsChange([...selectedColorIds, value]);
    }
  };



  // Convert available colors to dropdown options (filter out already selected)
  const availableColorOptions = colors
    .filter((color) => !selectedColorIds.includes(color.id))
    .map((color) => ({
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
          className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} className="mr-1" />
          Add Color
        </button>
      </div>

      {/* Color Dropdown */}
      <div className="mb-3">
        <Dropdown
          id="color"
          name="color"
          value={null} // Always null since we're adding to a list
          onChange={handleColorChange}
          options={availableColorOptions}
          placeholder="Select a color to add"
          disabled={loading}
          size="md"
        />
      </div>

      {/* Selected Colors Display */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Selected colors:</p>
        <div className="flex flex-wrap gap-2">
          {selectedColorIds.length > 0 ? (
            selectedColorIds.map((colorId) => {
              const color = colors.find((c) => c.id === colorId);
              if (!color) return null;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => {
                    const newSelectedIds = selectedColorIds.filter(
                      (id) => id !== color.id
                    );
                    onColorsChange(newSelectedIds);
                  }}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 transition-all duration-200"
                >
                  <div
                    className="w-4 h-4 rounded mr-2 border border-gray-300"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  {color.name}
                  <span className="ml-2 text-xs">×</span>
                </button>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">
              No colors selected. Select from dropdown above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
