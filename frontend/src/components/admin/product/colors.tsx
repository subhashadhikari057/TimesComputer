"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ComponentCard from "@/components/common/ComponentsCard";
import AddDetailsPopup from "./add_details_popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import Dropdown from "@/components/form/form-elements/dropdown";

interface Color {
  id: number;
  name: string;
  hex: string;
}

interface ColorsProps {
  colors: Color[];
  selectedColorIds: number[];
  onColorsChange: (colors: Color[]) => void;
  onSelectedColorsChange: (colorIds: number[]) => void;
}

export default function Colors({
  colors,
  selectedColorIds,
  onColorsChange,
  onSelectedColorsChange,
}: ColorsProps) {
  const [showAddColorPopup, setShowAddColorPopup] = useState(false);
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });

  const handleColorSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      onSelectedColorsChange([]);
    } else {
      const colorId = Number(value);
      if (!selectedColorIds.includes(colorId)) {
        onSelectedColorsChange([...selectedColorIds, colorId]);
      }
    }
  };

  const removeSelectedColor = (colorId: number) => {
    onSelectedColorsChange(selectedColorIds.filter((id) => id !== colorId));
  };

  const handleSaveColor = () => {
    if (newColor.name.trim() && newColor.hex) {
      const newId = Math.max(0, ...colors.map((c) => c.id)) + 1;
      const color: Color = {
        id: newId,
        name: newColor.name.trim(),
        hex: newColor.hex,
      };
      onColorsChange([...colors, color]);
      setNewColor({ name: "", hex: "#000000" });
      setShowAddColorPopup(false);
    }
  };

  const handleCancelColor = () => {
    setNewColor({ name: "", hex: "#000000" });
    setShowAddColorPopup(false);
  };

  return (
    <ComponentCard
      title="Product Colors"
      desc="Select available colors for this product"
    >
      <div className="space-y-4">
        {/* Color Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700"
            >
              Available Colors
            </label>
            <button
              type="button"
              onClick={() => setShowAddColorPopup(true)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus size={14} className="mr-1" />
              Add Color
            </button>
          </div>
          <select
            id="color"
            name="color"
            value=""
            onChange={handleColorSelection}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-all duration-200"
          >
            <option value="">Select a color to add</option>
            {colors
              .filter((color) => !selectedColorIds.includes(color.id))
              .map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
          </select>
        </div>

        {/* Selected Colors */}
        {selectedColorIds.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selected Colors ({selectedColorIds.length})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedColorIds.map((colorId) => {
                const color = colors.find((c) => c.id === colorId);
                if (!color) return null;

                return (
                  <div
                    key={colorId}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {color.name}
                        </p>
                        <p className="text-xs text-gray-500">{color.hex}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSelectedColor(colorId)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedColorIds.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v10a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z"
                />
              </svg>
            </div>
            <p className="text-sm">No colors selected</p>
            <p className="text-xs">
              Choose from available colors or add new ones
            </p>
          </div>
        )}
      </div>

      {/* Add Color Popup */}
      <AddDetailsPopup
        isOpen={showAddColorPopup}
        onClose={() => setShowAddColorPopup(false)}
        title="Add New Color"
        description="Create a new color option for your products"
        onSave={handleSaveColor}
        onCancel={handleCancelColor}
        saveButtonText="Add Color"
        maxWidth="md"
      >
        <div className="space-y-4">
          <DefaultInput
            label="Color Name"
            name="colorName"
            value={newColor.name}
            onChange={(e) =>
              setNewColor((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter color name (e.g., Navy Blue, Forest Green)"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={newColor.hex}
                onChange={(e) =>
                  setNewColor((prev) => ({ ...prev, hex: e.target.value }))
                }
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <DefaultInput
                label=""
                name="colorHex"
                value={newColor.hex}
                onChange={(e) =>
                  setNewColor((prev) => ({ ...prev, hex: e.target.value }))
                }
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

        </div>
      </AddDetailsPopup>
    </ComponentCard>
  );
}
