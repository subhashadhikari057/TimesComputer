"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import { colorService, Color } from "@/services/colorService";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";
import AddDetailsPopup from "@/components/common/popup";

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
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [form, setForm] = useState<ColorFormData>({ ...INITIAL_COLOR_FORM });
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    try {
      setLoading(true);
      setError(null);
      const colorsData = await colorService.getAllColors();
      setColors(colorsData);
    } catch (err) {
      setError("Failed to load colors");
      console.error("Error loading colors:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (updates: Partial<ColorFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleColorChange = (value: string | number | null) => {
    if (value && typeof value === "number" && !selectedColorIds.includes(value)) {
      onColorsChange([...selectedColorIds, value]);
    }
  };

  const isFormValid = () => {
    return (
      form.name.trim() !== "" && form.hexCode && form.hexCode.trim() !== ""
    );
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      const newColor = await colorService.createColor({
        name: form.name,
        hexCode: form.hexCode,
      });

      setColors((prev) => [...prev, newColor]);
      handleCancel();
    } catch (err) {
      setError("Failed to create color");
      console.error("Error creating color:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...INITIAL_COLOR_FORM });
    setShowAddPopup(false);
    setShowValidation(false);
    setError(null);
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
          onClick={() => {
            setError(null);
            setShowAddPopup(true);
          }}
          disabled={loading}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Add Color Popup */}
      <AddDetailsPopup
        isOpen={showAddPopup}
        onClose={handleCancel}
        title="Add New Color"
        description="Create a new color for your products"
        onSave={handleSave}
        onCancel={handleCancel}
        saveButtonText={loading ? "Creating..." : "Add Color"}
        maxWidth="md"
      >
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <DefaultInput
            label="Color Name *"
            name="colorName"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            placeholder="Enter color name (e.g., Red, Blue, Black)"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Code *
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={form.hexCode || "#000000"}
                onChange={(e) => updateForm({ hexCode: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={form.hexCode || ""}
                onChange={(e) => updateForm({ hexCode: e.target.value })}
                placeholder="#000000"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {!isFormValid() && showValidation && !loading && (
            <p className="text-sm text-red-600">
              Please fill in all required fields: name and color code.
            </p>
          )}
        </div>
      </AddDetailsPopup>
    </div>
  );
}