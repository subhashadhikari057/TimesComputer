"use client";

import { Plus, Award, Search, Download, Calendar, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/dashboard/Statcards";

import DefaultTable, { Column } from "@/components/form/table/defaultTable";
import { useTableData } from "@/hooks/useTableState";
import { toast } from "sonner";
import BrandPopup from "./brandPopup";
import { deleteBrand, getAllBrands } from "@/api/brand";
import { DeleteConfirmation } from "@/components/common/helper_function";
import { getImageUrl } from "@/lib/imageUtils";
import ExportPopup from "@/components/form/table/exportModal";
import { FullHeightShimmerTable } from "@/components/common/shimmerEffect";

// Brand interface
interface Brand extends Record<string, unknown> {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}

export default function BrandManagementPage() {
  const [brandData, setBrandData] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>(
    undefined
  );
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    brand: Brand | null;
  }>({
    isOpen: false,
    brand: null,
  });

  const fetchBrands = async () => {
    try {
      const res = await getAllBrands();
      setBrandData(res.data || res);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      toast.error("Failed to fetch brands.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const brandColumns: Column[] = [
    {
      id: "name",
      label: "Brand",
      sortable: false,
      filterable: true,
      searchable: true,

      render: (brand: Brand) => {
        const imageUrl = getImageUrl(brand.image);
        return (
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center overflow-hidden">
              {brand.image ? (
                <Image
                  src={imageUrl}
                  alt={brand.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Award className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {brand.name}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "createdAt",
      label: "Created At",
      sortable: true,
      filterable: false,
      searchable: false,

      render: (brand: Brand) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(brand.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const {
    searchTerm,

    sortConfig,
    selectedItems,
    processedData,

    handleSearchChange,
    handleSort,
    handleSelectAll,
    handleSelectItem,
    handleBulkDelete,
  } = useTableData({
    data: brandData,
    columns: brandColumns,
    defaultSort: { key: "createdAt", direction: "desc" },
  });

  const handleEdit = (row: Record<string, unknown>) => {
    setEditingBrand(row as unknown as Brand);
    setShowEditPopup(true);
  };

  const handleDelete = (row: Record<string, unknown>) => {
    setDeleteModal({
      isOpen: true,
      brand: row as unknown as Brand,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.brand) return;

    try {
      await deleteBrand(deleteModal.brand.id);
      toast.success("Brand deleted successfully");

      setBrandData((prev) =>
        prev.filter((brand) => brand.id !== deleteModal.brand!.id)
      );
    } catch (error) {
      console.error('Failed to delete brand:', error);
      toast.error("Failed to delete Brand");
    } finally {
      setDeleteModal({ isOpen: false, brand: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, brand: null });
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleAddBrand = () => {
    setShowAddPopup(true);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setEditingBrand(undefined);
  };

  const totalBrands = brandData.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Brands</h1>
          <p className="text-gray-600">
            Manage your product brands and organize your catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddBrand}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Brand
          </button>
        </div>
      </div>

      <BrandPopup
        isOpen={showAddPopup}
        onClose={handleCloseAddPopup}
        onSuccess={fetchBrands}
      />
      <BrandPopup
        isOpen={showEditPopup}
        onClose={handleCloseEditPopup}
        onSuccess={fetchBrands}
        initialData={editingBrand}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Brands"
          value={totalBrands.toString()}
          Icon={Award}
          loading={loading}
          gradient="orange"
        />
      </div>

      <div className="bg-white border border-gray-300 rounded-lg transition-shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full lg:w-120 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300 focus:outline-none"
              />
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 md:justify-self-end">
              {selectedItems.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedItems.length})
                </button>
              )}

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={handleExport}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <FullHeightShimmerTable cols={2} />
        ) : (
          <DefaultTable
            selectedItems={selectedItems}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            columns={brandColumns}
            data={processedData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Brand"
          itemName={deleteModal.brand?.name}
        />

        <ExportPopup
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          data={processedData}
          columns={brandColumns}
          title="Products"
          filename="Brand_Details"
        />
      </div>
    </div>
  );
}
