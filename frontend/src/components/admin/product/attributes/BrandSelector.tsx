"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AddDetailsPopup from "../../../common/popup";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import PhotoUpload from "../photoUpload";
import IconUpload from "../iconUpload";
import { brandService, Brand } from "@/services/brandService";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";

interface BrandSelectorProps {
  selectedBrandId: number | null;
  onBrandChange: (brandId: number | null) => void;
}

interface BrandFormData {
  name: string;
  image: File | null;
  imagePreview: string;
  icon: File | null;
  iconPreview: string;
}

const INITIAL_BRAND_FORM: BrandFormData = {
  name: "",
  image: null,
  imagePreview: "",
  icon: null,
  iconPreview: "",
};

export default function BrandSelector({
  selectedBrandId,
  onBrandChange,
}: BrandSelectorProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [form, setForm] = useState<BrandFormData>({ ...INITIAL_BRAND_FORM });
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const brandsData = await brandService.getAllBrands();
      setBrands(brandsData);
    } catch (err) {
      setError("Failed to load brands");
      console.error("Error loading brands:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (updates: Partial<BrandFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleImageUpload = (files: File[], imageType: "image" | "icon") => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewKey = imageType === "image" ? "imagePreview" : "iconPreview";
      updateForm({
        [imageType]: file,
        [previewKey]: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (imageType: "image" | "icon") => {
    const previewKey = imageType === "image" ? "imagePreview" : "iconPreview";
    updateForm({
      [imageType]: null,
      [previewKey]: "",
    });
  };

  const handleBrandChange = (value: string | number | null) => {
    onBrandChange(value as number | null);
  };

  const isFormValid = () => {
    return form.name.trim() !== "" && form.image !== null && form.icon !== null;
  };

  const handleSave = async () => {
    setShowValidation(true);

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setError(null);

      const newBrand = await brandService.createBrand({
        name: form.name,
        image: form.image!,
        icon: form.icon!,
      });

      setBrands((prev) => [...prev, newBrand]);
      handleCancel();
    } catch (err) {
      setError("Failed to create brand");
      console.error("Error creating brand:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...INITIAL_BRAND_FORM });
    setShowAddPopup(false);
    setShowValidation(false);
    setError(null);
  };

  // Convert brands to dropdown options
  const brandOptions = brands.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setShowAddPopup(true);
          }}
          disabled={loading}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} className="mr-1" />
          Add Brand
        </button>
      </div>

      <Dropdown
        id="brand"
        name="brand"
        value={selectedBrandId}
        onChange={handleBrandChange}
        options={brandOptions}
        placeholder="Select a brand"
        disabled={loading}
        size="md"
      />

      {/* Add Brand Popup */}
      <AddDetailsPopup
        isOpen={showAddPopup}
        onClose={handleCancel}
        title="Add New Brand"
        description="Create a new brand for your products"
        onSave={handleSave}
        onCancel={handleCancel}
        saveButtonText={loading ? "Creating..." : "Add Brand"}
        maxWidth="md"
      >
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <DefaultInput
            label="Brand Name"
            name="brandName"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            placeholder="Enter brand name (e.g., Apple, Samsung)"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              
              <PhotoUpload
              label="Brand Image"
               required
                images={form.image ? [form.image] : []}
                imagePreviews={form.imagePreview ? [form.imagePreview] : []}
                onImageUpload={(e) =>
                  handleImageUpload(Array.from(e.target.files || []), "image")
                }
                onRemoveImage={() => handleRemove("image")}
                maxImages={1}
                maxSizeText="up to 10MB each"
                acceptedFormats="PNG, JPG"
                uploadText="Click to upload image"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Icon
              </label>
              <IconUpload
                images={form.icon ? [form.icon] : []}
                imagePreviews={form.iconPreview ? [form.iconPreview] : []}
                onImageUpload={(e) =>
                  handleImageUpload(Array.from(e.target.files || []), "icon")
                }
                onRemoveImage={() => handleRemove("icon")}
                maxImages={1}
              />
            </div>
          </div>

          {!isFormValid() && showValidation && !loading && (
            <p className="text-sm text-red-600">
              Please fill in all required fields: name, image, and icon.
            </p>
          )}
        </div>
      </AddDetailsPopup>
    </div>
  );
}
