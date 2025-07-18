"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import {
  getAllFeatureTags,
  createFeatureTag,
  updateFeatureTag,
  deleteFeatureTag,
} from "@/api/featureTag";
import DefaultButton from "@/components/form/form-elements/DefaultButton";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import Popup from "@/components/common/popup";

interface FeatureTag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface TagForm {
  name: string;
}

export default function FeatureTagsPage() {
  const [tags, setTags] = useState<FeatureTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editingTag, setEditingTag] = useState<FeatureTag | null>(null);
  const [form, setForm] = useState<TagForm>({ name: "" });
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all feature tags
  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await getAllFeatureTags();
      setTags(response.data || []);
    } catch (error) {
      toast.error("Failed to load feature tags");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Filter tags based on search term
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: { name?: string } = {};
    if (!form.name.trim()) {
      errors.name = "Tag name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create/update tag
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      if (editingTag) {
        await updateFeatureTag(editingTag.id, form);
        toast.success("Feature tag updated successfully");
      } else {
        await createFeatureTag(form);
        toast.success("Feature tag created successfully");
      }
      
      setShowPopup(false);
      setForm({ name: "" });
      setEditingTag(null);
      fetchTags();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save feature tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (tag: FeatureTag) => {
    setEditingTag(tag);
    setForm({ name: tag.name });
    setShowPopup(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this feature tag?")) return;

    try {
      await deleteFeatureTag(id);
      toast.success("Feature tag deleted successfully");
      fetchTags();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete feature tag");
    }
  };

  // Reset form when popup closes
  const handleClosePopup = () => {
    setShowPopup(false);
    setForm({ name: "" });
    setEditingTag(null);
    setFormErrors({});
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feature Tags</h1>
        <DefaultButton
          onClick={() => setShowPopup(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Feature Tag
        </DefaultButton>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search feature tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tags Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </td>
              </tr>
            ) : filteredTags.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No feature tags found
                </td>
              </tr>
            ) : (
              filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{tag.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Popup */}
      <Popup
        isOpen={showPopup}
        onClose={handleClosePopup}
        title={editingTag ? "Edit Feature Tag" : "Add Feature Tag"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DefaultInput
            label="Tag Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter tag name"
            error={formErrors.name}
            required
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <DefaultButton
              type="button"
              onClick={handleClosePopup}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </DefaultButton>
            <DefaultButton
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : editingTag ? "Update" : "Create"}
            </DefaultButton>
          </div>
        </form>
      </Popup>
    </div>
  );
} 