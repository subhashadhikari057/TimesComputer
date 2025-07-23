import React from "react";
import { Plus, Trash2 } from "lucide-react";
import ComponentCard from "@/components/common/ComponentsCard";

interface Specification {
  key: string;
  value: string;
}

interface SpecificationsProps {
  specifications: Specification[];
  onSpecificationsChange: (specs: Specification[]) => void;
}

export default function Specifications({
  specifications,
  onSpecificationsChange,
}: SpecificationsProps) {
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
      <div className="space-y-3">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50/50"
          >
            <div>
              <label
                htmlFor={`spec-key-${index}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Specification Name
              </label>
              <input
                type="text"
                id={`spec-key-${index}`}
                value={spec.key}
                onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                placeholder="e.g., Display Size, RAM, Storage"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-all duration-200"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label
                  htmlFor={`spec-value-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-all duration-200"
                />
              </div>

              {specifications.length > 1 && (
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg focus:outline-none focus:text-red-500 focus:bg-red-50 active:bg-red-100 transition-all duration-200"
                    title="Remove specification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSpecification}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:bg-gray-50 focus:border-gray-300 active:bg-gray-100 transition-all duration-200"
        >
          <Plus size={14} className="mr-1" />
          Add Specification
        </button>
      </div>
    </ComponentCard>
  );
}