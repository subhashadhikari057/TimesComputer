"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getAllBrands, createBrand } from "@/api/brand";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";
import { useRouter } from "next/navigation";

interface Brand {
  id: number;
  name: string;
  imageUrl?: string;
  iconUrl?: string;
}

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
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<BrandFormData>({ ...INITIAL_BRAND_FORM });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);

      const response = await getAllBrands();
      setBrands(response.data || []);
    } catch (err) {
      console.error("Error loading brands:", err);
    } finally {
      setLoading(false);
    }
  };



  const handleBrandChange = (value: string | number | null) => {
    onBrandChange(value as number | null);
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
          onClick={() => router.push("/admin/attributes/brand")}
          disabled={loading}
          className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed "
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
    </div>
  );
}
