"use client";

import {
  Plus,
  Tag,
  Search,
  Download,
 
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import StatCard from "@/components/admin/dashboard/Statcards";

import DefaultTable, { Column } from "@/components/form/table/defaultTable";
import { useTableData } from "@/hooks/useTableState";
import { toast } from "sonner";
import FeatureTagPopup from "./featureTagPopup";
import { deleteFeatureTag, getAllFeatureTags } from "@/api/featureTag"; 
import { DeleteConfirmation } from "@/components/common/helper_function";

interface FeatureTag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeatureTagPage() {
  const [featureTagData, setFeatureTagData] = useState<FeatureTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingFeatureTag, setEditingFeatureTag] = useState<FeatureTag | undefined>(undefined);
const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    featureTag: FeatureTag | null;
  }>({
    isOpen: false,
    featureTag: null,
  });

  const fetchFeatureTags = async () => {
      try {
        const res = await getAllFeatureTags();
        setFeatureTagData(res.data);
      } catch (err) {
        toast.error("Failed to fetch feature Tags.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchFeatureTags();
  }, []);

  const featureTagColumns: Column[] = [
    {
      id: "name",
      label: "Feature Tag",
      sortable: false,
      filterable: true,
      searchable: true,
      width: "200px",
      render: (featureTag: FeatureTag) => (
        <div className="flex items-center space-x-4">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {featureTag.name}
            </div>
          </div>
        </div>
      ),
    },
   
  ];

  const {
    searchTerm,
    filters,
    sortConfig,
    selectedItems,
    processedData,
    filterConfigs,
    handleSearchChange,
    handleFilterChange,
    handleResetFilters,
    handleSort,
    handleSelectAll,
    handleSelectItem,
    handleBulkDelete,
  } = useTableData({
    data: featureTagData,
    columns: featureTagColumns,
    defaultSort: { key: "createdAt", direction: "desc" },
  });

  const handleEdit = (row: any) => {
    setEditingFeatureTag(row);
    setShowEditPopup(true);
  };

  const handleDelete = (row: any) => {
      setDeleteModal({
        isOpen: true,
        featureTag: row,
      });
    };
  
    const confirmDelete = async () => {
      if (!deleteModal.featureTag) return;
  
      try {
        await deleteFeatureTag(deleteModal.featureTag.id);
        toast.success("Feature tag deleted successfully");

        setFeatureTagData((prev) =>
          prev.filter((featureTag) => featureTag.id !== deleteModal.featureTag!.id)
        );
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to delete Feature Tag");
      } finally {
        setDeleteModal({ isOpen: false, featureTag: null });
      }
    };
  
    const cancelDelete = () => {
      setDeleteModal({ isOpen: false, featureTag: null });
    };

  const handleAddFeatureTag = () => {
    setShowAddPopup(true);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setEditingFeatureTag(undefined);
  };

  const totalFeatureTags = featureTagData.length;
  const activeFeatureTags = "5"; // Optional: Replace with actual logic
  // const totalProducts = featureTagData.reduce(
  //   (sum, cat) => sum + cat.productCount,
  //   0
  // );

  

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Feature Tags</h1>
          <p className="text-gray-600">
            Manage your product Feature Tags and organize your catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddFeatureTag}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Feature Tags
          </button>
        </div>
      </div>

      <FeatureTagPopup 
      isOpen={showAddPopup} 
      onClose={handleCloseAddPopup} 
      onSuccess={fetchFeatureTags}
      />
      <FeatureTagPopup
        isOpen={showEditPopup}
        onClose={handleCloseEditPopup}
        onSuccess={fetchFeatureTags}
        initialData={editingFeatureTag}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Feature Tags"
          value={totalFeatureTags.toString()}
          change=""
          Icon={Tag}
          color="text-purple-600"
        />
        
      </div>

      <div className="bg-white border border-gray-300 rounded-lg transition-shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search feature Tags..."
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

        {loading ? <div className="p-6">Loading feature Tags...</div> : <DefaultTable
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          columns={featureTagColumns}
          data={processedData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortConfig={sortConfig}
          onSort={handleSort}
        /> }

        {/* Delete Confirmation Modal */}
                <DeleteConfirmation
                  isOpen={deleteModal.isOpen}
                  onClose={cancelDelete}
                  onConfirm={confirmDelete}
                  title="Delete Feature Tag"
                  itemName={deleteModal.featureTag?.name}
                />

        
      </div>
    </div>
  );
}