"use client";

import { useState } from "react";
import {
  Package,
  Upload,
  DollarSign,
  FileText,
  Tag,
  Palette,
  Building2,
  FolderOpen,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import ComponentCard from "@/components/common/ComponentsCard";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import DefaultTextarea from "@/components/form/form-elements/DefaultTextarea";
import DefaultNumberInput from "@/components/form/form-elements/DefaultNumberInput";
import DefaultCheckbox from "@/components/form/form-elements/DefaultCheckbox";
import DefaultSelect from "@/components/form/form-elements/DefaultSelect";
import FileUpload from "@/components/form/form-elements/FileUpload";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isPublished: boolean;
  brochure: string;
  specs: Record<string, any>;
  brandId: number | null;
  categoryId: number | null;
}

export default function CreateProductPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    isPublished: true,
    brochure: "",
    specs: {},
    brandId: null,
    categoryId: null,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFeatureTags, setSelectedFeatureTags] = useState<number[]>([]);
  const [selectedMarketingTags, setSelectedMarketingTags] = useState<number[]>(
    []
  );
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

  // Mock data - replace with actual API calls
  const brands = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Samsung" },
    { id: 3, name: "Dell" },
  ];

  const categories = [
    { id: 1, name: "Laptops" },
    { id: 2, name: "Smartphones" },
    { id: 3, name: "Tablets" },
  ];

  const featureTags = [
    { id: 1, name: "Wireless" },
    { id: 2, name: "Waterproof" },
    { id: 3, name: "Fast Charging" },
  ];

  const marketingTags = [
    { id: 1, name: "Best Seller" },
    { id: 2, name: "New Arrival" },
    { id: 3, name: "Limited Edition" },
  ];

  const colors = [
    { id: 1, name: "Black", hexCode: "#000000" },
    { id: 2, name: "White", hexCode: "#FFFFFF" },
    { id: 3, name: "Blue", hexCode: "#0066CC" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setSpecs((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  };

  const addSpec = () => {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert specs array to object
    const specsObject = specs.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, any>);

    const submitData = {
      ...formData,
      specs: specsObject,
      images,
      featureTags: selectedFeatureTags,
      marketingTags: selectedMarketingTags,
      colors: selectedColors,
    };

    console.log("Product data:", submitData);
    // Here you would send the data to your API
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create New Product
        </h1>
        <p className="text-gray-600">Add a new product to your inventory</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-5 gap-6"
      >
        {/* Product Details Section - Takes 3/4 of space */}
        <div className="xl:col-span-3 space-y-6">
          {/* Basic Information */}
          <ComponentCard
            title="Basic Information"
            desc="Add the basic details of your product"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DefaultInput
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />

              <DefaultInput
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="product-slug"
                required
                helpText="URL-friendly version of the product name"
              />

              <DefaultTextarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                className="md:col-span-2"
                rows={4}
              />
            </div>
          </ComponentCard>
        </div>

        {/* Pricing & Actions Section - Takes 1/4 of space */}
        <div className="xl:col-span-2 space-y-6">
          {/* Pricing & Inventory */}
          <ComponentCard
            title="Pricing & Inventory"
            desc="Set pricing and stock information"
          >
            <div className="space-y-4">
              <DefaultNumberInput
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min={0}
                step={0.01}
                placeholder="0.00"
                required
                helpText="Enter the selling price"
              />

              <DefaultNumberInput
                label="Stock Quantity"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min={0}
                placeholder="0"
                required
                helpText="Available quantity in inventory"
              />

              <DefaultCheckbox
                label="Published"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleCheckboxChange}
                helpText="Make this product visible to customers"
              />
            </div>
          </ComponentCard>

          {/* Submit Button */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Save className="w-4 h-4" />
              <span>Create Product</span>
            </button>
            <button
              type="button"
              className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
