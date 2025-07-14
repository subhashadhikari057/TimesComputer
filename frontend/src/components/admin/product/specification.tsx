import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import ComponentCard from "@/components/common/ComponentsCard";

interface Specification {
  key: string;
  value: string;
}

interface SpecificationsManagerProps {
  specifications: Specification[];
  onSpecificationsChange: (specs: Specification[]) => void;
}

export default function SpecificationsManager({
  specifications,
  onSpecificationsChange,
}: SpecificationsManagerProps) {
  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    onSpecificationsChange(updatedSpecs);
  };

  const addSpecification = () => {
    onSpecificationsChange([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      const updatedSpecs = specifications.filter((_, i) => i !== index);
      onSpecificationsChange(updatedSpecs);
    }
  };

  return (
    <ComponentCard
      title="Specifications"
      desc="Add technical specifications and product details"
    >
      <div className="space-y-4">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div>
              <label
                htmlFor={`spec-key-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Specification Name
              </label>
              <input
                type="text"
                id={`spec-key-${index}`}
                value={spec.key}
                onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                placeholder="e.g., Display Size, RAM, Storage"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label
                  htmlFor={`spec-value-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Value
                </label>
                <input
                  type="text"
                  id={`spec-value-${index}`}
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecChange(index, "value", e.target.value)
                  }
                  placeholder="e.g., 15.6 inches, 16GB, 512GB SSD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              {specifications.length > 1 && (
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove specification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSpecification}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Specification
        </button>
      </div>
    </ComponentCard>
  );
}
