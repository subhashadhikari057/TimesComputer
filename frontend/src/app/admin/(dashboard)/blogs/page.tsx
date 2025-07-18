"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Eye, Image } from "lucide-react";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/api/blog";
import DefaultButton from "@/components/form/form-elements/DefaultButton";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import DefaultTextarea from "@/components/form/form-elements/DefaultTextarea";
import Popup from "@/components/common/popup";

interface Blog {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogForm {
  title: string;
  content: string;
  image: File | null;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState<BlogForm>({ title: "", content: "", image: null });
  const [formErrors, setFormErrors] = useState<{ title?: string; content?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await getAllBlogs();
      setBlogs(response.data || []);
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: { title?: string; content?: string } = {};
    if (!form.title.trim()) {
      errors.title = "Blog title is required";
    }
    if (!form.content.trim()) {
      errors.content = "Blog content is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create/update blog
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      if (form.image) {
        formData.append('image', form.image);
      }

      if (editingBlog) {
        await updateBlog(editingBlog.id, formData);
        toast.success("Blog updated successfully");
      } else {
        await createBlog(formData);
        toast.success("Blog created successfully");
      }
      
      setShowPopup(false);
      setForm({ title: "", content: "", image: null });
      setImagePreview(null);
      setEditingBlog(null);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setForm({ title: blog.title, content: blog.content, image: null });
    setImagePreview(blog.imageUrl || null);
    setShowPopup(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(id);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete blog");
    }
  };

  // Reset form when popup closes
  const handleClosePopup = () => {
    setShowPopup(false);
    setForm({ title: "", content: "", image: null });
    setImagePreview(null);
    setEditingBlog(null);
    setFormErrors({});
  };

  // Truncate content for display
  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
        <DefaultButton
          onClick={() => setShowPopup(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Blog
        </DefaultButton>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
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
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </td>
              </tr>
            ) : filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No blogs found
                </td>
              </tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {blog.imageUrl ? (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{blog.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs">
                      {truncateContent(blog.content)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
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
        title={editingBlog ? "Edit Blog" : "Add Blog"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DefaultInput
            label="Blog Title"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Enter blog title"
            error={formErrors.title}
            required
          />

          <DefaultTextarea
            label="Blog Content"
            name="content"
            value={form.content}
            onChange={handleInputChange}
            placeholder="Enter blog content"
            error={formErrors.content}
            rows={6}
            required
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
          
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
              {isSubmitting ? "Saving..." : editingBlog ? "Update" : "Create"}
            </DefaultButton>
          </div>
        </form>
      </Popup>
    </div>
  );
} 