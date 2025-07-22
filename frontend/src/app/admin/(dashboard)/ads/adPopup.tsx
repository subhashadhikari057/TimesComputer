"use client";

import { useState, useEffect } from "react";
import { X, Upload, Link as LinkIcon, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createAd, updateAd } from "@/api/ads";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import DefaultTextarea from "@/components/form/form-elements/DefaultTextarea";
import DefaultButton from "@/components/form/form-elements/DefaultButton";

interface AdPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  initialData?: {
    id: number;
    title?: string;
    images: string[];
    link: string;
    placement: string;
    isActive?: boolean;
    createdAt: string;
  };
}

interface FormData {
  title: string;
  link: string;
  placement: string;
  images: File[];
}

const INITIAL_FORM_DATA: FormData = {
  title: "",
  link: "",
  placement: "",
  images: [],
};

const PLACEMENT_OPTIONS = [
  { value: "slider", label: "Slider Banner (Left side carousel)", description: "Rotating banner in main carousel (4 max)" },
  { value: "box1", label: "Box Banner 1 (Top right)", description: "First small box on the right side" },
  { value: "box2", label: "Box Banner 2 (Top right)", description: "Second small box on the right side" },
  { value: "box3", label: "Box Banner 3 (Bottom right)", description: "Wide box below the top boxes" },
  { value: "upper-banner", label: "Upper Single Banner", description: "Full width banner above main content" },
  { value: "lower-banner", label: "Lower Single Banner", description: "Full width banner below main content" },
];

export default function AdPopup({
  isOpen,
  onClose,
  onSuccess,
  mode,
  initialData,
}: AdPopupProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        link: initialData.link || "",
        placement: initialData.placement || "",
        images: [],
      });
      
      // Set existing image previews
      if (initialData.images && initialData.images.length > 0) {
        setImagePreviews(initialData.images);
      }
    } else {
      setFormData(INITIAL_FORM_DATA);
      setImagePreviews([]);
    }
  }, [mode, initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate image types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error("Please select only image files (JPEG, PNG, GIF)");
      return;
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error("Each image must be less than 5MB");
      return;
    }

    // Create previews
    const newPreviews: string[] = [];
    const newImages: File[] = [];

    files.forEach((file, index) => {
      newImages.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.link.trim()) {
      toast.error("Link is required");
      return false;
    }

    if (!formData.placement) {
      toast.error("Placement is required");
      return false;
    }

    if (mode === "create" && formData.images.length === 0) {
      toast.error("At least one image is required");
      return false;
    }

    // Validate URL format
    try {
      new URL(formData.link);
    } catch {
      toast.error("Please enter a valid URL");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("link", formData.link);
      submitData.append("placement", formData.placement);
      
      if (formData.title.trim()) {
        submitData.append("title", formData.title);
      }

      // Add all images
      formData.images.forEach((image) => {
        submitData.append("images", image);
      });

      if (mode === "create") {
        await createAd(submitData);
        toast.success("Ad created successfully!");
      } else if (mode === "edit" && initialData) {
        await updateAd(initialData.id, submitData);
        toast.success("Ad updated successfully!");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage = error.response?.data?.error || "Failed to save ad";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedPlacement = PLACEMENT_OPTIONS.find(p => p.value === formData.placement);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "create" ? "Create New Ad" : "Edit Ad"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <DefaultInput
              label="Ad Title (Optional)"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a title for admin reference"
              helpText="This title is only visible in the admin dashboard"
            />
          </div>

          {/* Placement Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placement *
            </label>
            <select
              name="placement"
              value={formData.placement}
              onChange={handleSelectChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select where this ad will appear</option>
              {PLACEMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {selectedPlacement && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>{selectedPlacement.label}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {selectedPlacement.description}
                </p>
              </div>
            )}
          </div>

          {/* Link Input */}
          <div>
            <DefaultInput
              label="Link URL *"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="https://example.com"
              required
              helpText="URL that users will be redirected to when they click the ad"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              Images {mode === "create" && "*"}
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload images or drag and drop
                </span>
                <span className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 5MB each
                </span>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Image Previews ({imagePreviews.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-gray-100 rounded border overflow-hidden">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <DefaultButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </DefaultButton>
            <DefaultButton
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {mode === "create" ? "Create Ad" : "Update Ad"}
            </DefaultButton>
          </div>
        </form>
      </div>
    </div>
  );
} 