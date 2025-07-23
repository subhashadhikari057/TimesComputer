"use client";

import { Plus, Tag, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import StatCard from "@/components/admin/dashboard/Statcards";
import DefaultTable, { Column } from "@/components/form/table/defaultTable";
import { useTableData } from "@/hooks/useTableState";
import { toast } from "sonner";
import MarketingTagPopup from "./marketingTagPopup";
import { deleteMarketingTag, getAllMarketingTags } from "@/api/marketingTag"; // ✅ API import
import { DeleteConfirmation } from "@/components/common/helper_function";
import { FullHeightShimmerTable } from "@/components/common/shimmerEffect";

interface MarketingTag extends Record<string, unknown> {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function MarketingTagManagementPage() {
  const [marketingTagData, setMarketingTagData] = useState<MarketingTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingMarketingTag, setEditingMarketingTag] = useState<
    MarketingTag | undefined
  >(undefined);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    marketingTag: MarketingTag | null;
  }>({
    isOpen: false,
    marketingTag: null,
  });

  const fetchMarketingTags = async () => {
    try {
      const res = await getAllMarketingTags();
      setMarketingTagData(res.data);
    } catch (error) {
      console.error('Failed to fetch marketing tags:', error);
      toast.error("Failed to fetch marketingTags.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingTags();
  }, []);

  const marketingTagColumns: Column[] = [
    {
      id: "name",
      label: "Marketing Tag",
      sortable: false,
      filterable: true,
      searchable: true,

      render: (marketingTag: Record<string, unknown>) => (
        <div className="flex items-center space-x-4">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {(marketingTag as MarketingTag).name}
            </div>
          </div>
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
    data: marketingTagData,
    columns: marketingTagColumns,
    defaultSort: { key: "createdAt", direction: "desc" },
  });

  const handleEdit = (row: Record<string, unknown>) => {
    setEditingMarketingTag(row as unknown as MarketingTag);
    setShowEditPopup(true);
  };

  const handleDelete = (row: Record<string, unknown>) => {
    setDeleteModal({
      isOpen: true,
      marketingTag: row as unknown as MarketingTag,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.marketingTag) return;

    try {
      await deleteMarketingTag(deleteModal.marketingTag.id);
      toast.success("Marketing Tag deleted successfully");

      setMarketingTagData((prev) =>
        prev.filter(
          (marketingTag) => marketingTag.id !== deleteModal.marketingTag!.id
        )
      );
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(
        err.response?.data?.error || "Failed to delete Marketing Tag"
      );
    } finally {
      setDeleteModal({ isOpen: false, marketingTag: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, marketingTag: null });
  };

  const handleAddMarketingTag = () => {
    setShowAddPopup(true);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setEditingMarketingTag(undefined);
  };

  const totalMarketingTags = marketingTagData.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Marketing Tags
          </h1>
          <p className="text-gray-600">
            Manage your product Marketing Tags and organize your catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddMarketingTag}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Marketing Tags
          </button>
        </div>
      </div>

      <MarketingTagPopup
        isOpen={showAddPopup}
        onClose={handleCloseAddPopup}
        onSuccess={fetchMarketingTags}
      />
      <MarketingTagPopup
        isOpen={showEditPopup}
        onClose={handleCloseEditPopup}
        onSuccess={fetchMarketingTags}
        initialData={editingMarketingTag}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Marketing Tags"
          value={totalMarketingTags.toString()}
          Icon={Tag}
          gradient="purple"
        />
      </div>

      <div className="bg-white border border-gray-300 rounded-lg transition-shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search marketing Tags..."
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
            columns={marketingTagColumns}
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
          title="Delete Marketing Tag"
          itemName={deleteModal.marketingTag?.name}
        />
      </div>
    </div>
  );
}
