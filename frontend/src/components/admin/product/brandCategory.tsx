import ComponentCard from "@/components/common/ComponentsCard";

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface BrandCategorySelectorProps {
  brands: Brand[];
  categories: Category[];
  selectedBrandId: number | null;
  selectedCategoryId: number | null;
  onBrandChange: (brandId: number | null) => void;
  onCategoryChange: (categoryId: number | null) => void;
}

export default function BrandCategorySelector({
  brands,
  categories,
  selectedBrandId,
  selectedCategoryId,
  onBrandChange,
  onCategoryChange,
}: BrandCategorySelectorProps) {
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onBrandChange(value === "" ? null : Number(value));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onCategoryChange(value === "" ? null : Number(value));
  };

  return (
    <ComponentCard
      title="Brand & Category"
      desc="Select the brand and category for this product"
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Brand Dropdown */}
        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Brand
          </label>
          <select
            id="brand"
            name="brand"
            value={selectedBrandId || ""}
            onChange={handleBrandChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-all duration-200"
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={selectedCategoryId || ""}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-all duration-200"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ComponentCard>
  );
}