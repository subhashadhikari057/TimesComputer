"use client";

import { Plus, Image as ImageIcon, Search, Calendar, Trash2, Edit2, ExternalLink, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import StatCard from "@/components/admin/dashboard/Statcards";
import { toast } from "sonner";
import { getAllAds, deleteAd, updateAd } from "@/api/ads";
import { DeleteConfirmation } from "@/components/common/helper_function";
import { getImageUrl } from "@/lib/imageUtils";
import AdPopup from "./adPopup";

// Ad interface
interface Ad {
  id: number;
  title?: string;
  images: string[];
  link: string;
  placement: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PLACEMENT_LABELS: Record<string, string> = {
  'slider': 'Slider',
  'box1': 'Box 1',
  'box2': 'Box 2', 
  'box3': 'Box 3',
  'upper-banner': 'Upper Banner',
  'lower-banner': 'Lower Banner',
};

export default function AdsManagementPage() {
  const [adData, setAdData] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlacement, setFilterPlacement] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    ad: Ad | null;
  }>({
    isOpen: false,
    ad: null,
  });

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await getAllAds();
      console.log("Fetched ads response:", res);
      setAdData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      toast.error("Failed to fetch ads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setShowEditPopup(true);
  };

  const handleDelete = (ad: Ad) => {
    setDeleteModal({
      isOpen: true,
      ad: ad,
    });
  };

  const handleToggleActive = async (ad: Ad) => {
    try {
      const formData = new FormData();
      formData.append('isActive', (!ad.isActive).toString());
      
      await updateAd(ad.id, formData);
      toast.success(`Ad ${ad.isActive ? 'deactivated' : 'activated'} successfully`);
      
      // Update local state
      setAdData(prev => prev.map(item => 
        item.id === ad.id ? { ...item, isActive: !item.isActive } : item
      ));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update ad status");
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.ad) return;

    try {
      await deleteAd(deleteModal.ad.id);
      toast.success("Ad deleted successfully");
      setAdData((prev) => prev.filter((ad) => ad.id !== deleteModal.ad!.id));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete ad");
    } finally {
      setDeleteModal({ isOpen: false, ad: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, ad: null });
  };

  // Filter ads based on search term and placement
  const filteredAds = adData.filter((ad) => {
    const matchesSearch = 
      ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.link?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.id.toString().includes(searchTerm);
    
    const matchesPlacement = !filterPlacement || ad.placement === filterPlacement;
    
    return matchesSearch && matchesPlacement;
  });

  const totalAds = adData.length;
  const activeAds = adData.filter(ad => ad.isActive).length;
  const sliderAds = adData.filter(ad => ad.placement === 'slider').length;
  const boxAds = adData.filter(ad => ['box1', 'box2', 'box3'].includes(ad.placement)).length;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ad Management</h1>
            <p className="text-gray-600 mt-1">Loading ads...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ad Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your homepage banners and advertisement images
          </p>
        </div>
        <button
          onClick={() => setShowAddPopup(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Ad
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Ads"
          value={totalAds.toString()}
          Icon={ImageIcon}
          gradient="blue"
          subtitle="All advertisements"
        />
        <StatCard
          title="Active Ads"
          value={activeAds.toString()}
          Icon={Eye}
          gradient="emerald"
          subtitle="Currently visible"
        />
        <StatCard
          title="Slider Ads"
          value={sliderAds.toString()}
          Icon={ImageIcon}
          gradient="purple"
          subtitle="Carousel banners"
        />
        <StatCard
          title="Box Ads"
          value={boxAds.toString()}
          Icon={ImageIcon}
          gradient="orange"
          subtitle="Side box banners"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search ads by title, link, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={filterPlacement}
              onChange={(e) => setFilterPlacement(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300 focus:outline-none"
            >
              <option value="">All Placements</option>
              <option value="slider">Slider</option>
              <option value="box1">Box 1</option>
              <option value="box2">Box 2</option>
              <option value="box3">Box 3</option>
              <option value="upper-banner">Upper Banner</option>
              <option value="lower-banner">Lower Banner</option>
            </select>
          </div>
        </div>

        {/* Ads Grid */}
        {filteredAds.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ads found</h3>
            <p className="text-gray-500 mb-6">
              {adData.length === 0 
                ? "Get started by creating your first ad banner."
                : "No ads match your search criteria."
              }
            </p>
            <button
              onClick={() => setShowAddPopup(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Ad
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <div key={ad.id} className={`bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${!ad.isActive ? 'opacity-75' : ''}`}>
                {/* Image Preview */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                  {!ad.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                      <span className="text-white text-sm font-medium">INACTIVE</span>
                    </div>
                  )}
                  {ad.images && ad.images.length > 0 ? (
                    <img
                      src={getImageUrl(ad.images[0])}
                      alt="Ad preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", ad.images[0]);
                        console.error("Processed URL:", getImageUrl(ad.images[0]));
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`${ad.images && ad.images.length > 0 ? 'hidden' : ''} flex flex-col items-center text-gray-400`}>
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span className="text-sm">No image</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {ad.title || `Ad #${ad.id}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {ad.images?.length || 0} image{(ad.images?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {PLACEMENT_LABELS[ad.placement] || ad.placement}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ad.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ad.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {ad.link && (
                    <div className="mb-3">
                      <a
                        href={ad.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate block"
                      >
                        <ExternalLink className="w-3 h-3 inline mr-1" />
                        {ad.link}
                      </a>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {new Date(ad.createdAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(ad)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        ad.isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {ad.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {ad.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => handleEdit(ad)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ad)}
                      className="flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Ad Popup */}
      {showAddPopup && (
        <AdPopup
          isOpen={showAddPopup}
          onClose={() => setShowAddPopup(false)}
          onSuccess={() => {
            setShowAddPopup(false);
            fetchAds();
          }}
          mode="create"
        />
      )}

      {/* Edit Ad Popup */}
      {showEditPopup && editingAd && (
        <AdPopup
          isOpen={showEditPopup}
          onClose={() => {
            setShowEditPopup(false);
            setEditingAd(undefined);
          }}
          onSuccess={() => {
            setShowEditPopup(false);
            setEditingAd(undefined);
            fetchAds();
          }}
          mode="edit"
          initialData={editingAd}
        />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        title="Delete Ad"
        message={`Are you sure you want to delete this ad? This action cannot be undone.`}
      />
    </div>
  );
}
