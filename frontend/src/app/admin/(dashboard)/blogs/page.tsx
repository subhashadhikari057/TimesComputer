"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Eye, Image } from "lucide-react";
import dynamic from "next/dynamic";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/api/blog";
import DefaultButton from "@/components/form/form-elements/DefaultButton";
import DefaultInput from "@/components/form/form-elements/DefaultInput";
import Popup from "@/components/common/popup";

// Dynamically import Markdown Editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">Loading editor...</div>
});

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  slug: string;
  images: string[];
  metadata: any;
  createdAt: string;
  updateedAt: string;
}

interface BlogForm {
  title: string;
  content: string;
  author: string;
  slug: string;
  images: File[];
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState<BlogForm>({ title: "", content: "", author: "", slug: "", images: [] });
  const [formErrors, setFormErrors] = useState<{ title?: string; content?: string; author?: string; slug?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
    
    // Auto-generate slug from title
    if (name === "title") {
      setForm(prev => ({
        ...prev,
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')
      }));
    }
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setForm({ ...form, images: files });
      
      // Create previews
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: { title?: string; content?: string; author?: string; slug?: string } = {};
    if (!form.title.trim()) {
      errors.title = "Blog title is required";
    }
    if (!form.content.trim()) {
      errors.content = "Blog content is required";
    }
    if (!form.author.trim()) {
      errors.author = "Author is required";
    }
    if (!form.slug.trim()) {
      errors.slug = "Slug is required";
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
      formData.append('author', form.author || 'admin');
      formData.append('slug', form.slug || form.title.toLowerCase().replace(/\s+/g, '-'));
      formData.append('metadata', JSON.stringify({}));
      
      // Add images
      form.images.forEach((image) => {
        formData.append('images', image);
      });

      if (editingBlog) {
        await updateBlog(editingBlog.id, formData);
        toast.success("Blog updated successfully");
      } else {
        await createBlog(formData);
        toast.success("Blog created successfully");
      }
      
      setShowPopup(false);
      setForm({ title: "", content: "", author: "", slug: "", images: [] });
      setImagePreviews([]);
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
    setForm({ 
      title: blog.title, 
      content: blog.content, 
      author: blog.author,
      slug: blog.slug,
      images: [] 
    });
    setImagePreviews(blog.images || []);
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
    setForm({ title: "", content: "", author: "", slug: "", images: [] });
    setImagePreviews([]);
    setEditingBlog(null);
    setFormErrors({});
  };

  // Truncate content for display (removes HTML tags)
  const truncateContent = (content: string, maxLength: number = 100) => {
    // Remove HTML tags for display
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent;
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
                Author
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
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </td>
              </tr>
            ) : filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No blogs found
                </td>
              </tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {blog.images && blog.images.length > 0 ? (
                      <img
                        src={blog.images[0]}
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{blog.author}</div>
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

          <DefaultInput
            label="Author"
            name="author"
            value={form.author}
            onChange={handleInputChange}
            placeholder="Enter author name"
            error={formErrors.author}
            required
          />

          <DefaultInput
            label="Slug"
            name="slug"
            value={form.slug}
            onChange={handleInputChange}
            placeholder="blog-url-slug (auto-generated)"
            error={formErrors.slug}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content *
            </label>
            <div data-color-mode="light">
              <MDEditor
                value={form.content}
                onChange={(content: string | undefined) => {
                  setForm(prev => ({ ...prev, content: content || '' }));
                  if (formErrors.content) {
                    setFormErrors(prev => ({ ...prev, content: undefined }));
                  }
                }}
                preview="edit"
                hideToolbar={false}
                visibleDragbar={false}
                textareaProps={{
                  placeholder: 'Write your blog content here... (Supports Markdown and HTML)',
                }}
                height={400}
              />
            </div>
            {formErrors.content && (
              <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {imagePreviews.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                ))}
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