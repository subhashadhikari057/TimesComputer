"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getAllBrands } from "@/api/brand";
import Dropdown from "@/components/form/form-elements/DefaultDropdown";
import BrandPopup from "@/app/admin/(dashboard)/attributes/brand/brandPopup";

interface Brand {
  id: number;
  name: string;
  image?: string;
}

interface BrandSelectorProps {
  selectedBrandId: number | null;
  onBrandChange: (brandId: number | null) => void;
}

export default function BrandSelector({
  selectedBrandId,
  onBrandChange,
}: BrandSelectorProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);

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

  const handleAddBrandClick = () => {
    setShowBrandModal(true);
  };

  const handleBrandModalClose = () => {
    setShowBrandModal(false);
  };

  const handleBrandCreated = () => {
    loadBrands(); // Refresh the brands list
    setShowBrandModal(false);
  };

  // Convert brands to dropdown options
  const brandOptions = brands.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <button
            type="button"
            onClick={handleAddBrandClick}
            disabled={loading}
            className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-500 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Brand Modal */}
      <BrandPopup
        isOpen={showBrandModal}
        onClose={handleBrandModalClose}
        onSuccess={handleBrandCreated}
      />
    </>
  );
}
