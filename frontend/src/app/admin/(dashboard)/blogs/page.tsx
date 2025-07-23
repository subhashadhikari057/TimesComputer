"use client";

import {
  Plus,
  BookOpen,
  Edit2,
  Users,
  Search,
  Download,
  Calendar,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import StatCard from "@/components/admin/dashboard/Statcards";
import DefaultTable, { Column } from "@/components/form/table/defaultTable";
import { useTableData } from "@/hooks/useTableState";
import { toast } from "sonner";
import { deleteBlog, getAllBlogs } from "@/api/blog";
import { useRouter } from "next/navigation";
import { DeleteConfirmation } from "@/components/common/helper_function";
import { getImageUrl } from "@/lib/imageUtils";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  slug: string;
  images: string[];
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogData, setBlogData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    blog: Blog | null;
  }>({
    isOpen: false,
    blog: null
  });

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs();
      setBlogData(res.data || []);
    } catch {
      toast.error("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Truncate content for display (removes HTML tags)
  const truncateContent = (content: string, maxLength: number = 100) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent;
  };

  const blogColumns: Column[] = [
    {
      id: "title",
      label: "Blog",
      sortable: false,
      filterable: true,
      searchable: true,
      width: "300px",
      render: (blog: Record<string, unknown>) => {
        const blogData = blog as Blog;
        const imageUrl = getImageUrl(blogData.images[0]);
        return (
          <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center overflow-hidden">
            {blogData.images && blogData.images.length > 0 ? (
              <Image
                src={imageUrl}
                alt={blogData.title}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <BookOpen className="w-6 h-6 text-blue-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {blogData.title}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {blogData.slug}
            </div>
          </div>
        </div>
        )
      }
    },
    {
      id: "author",
      label: "Author",
      sortable: true,
      filterable: true,
      searchable: true,
      width: "150px",
      render: (blog: Record<string, unknown>) => (
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">
            {(blog as Blog).author}
          </span>
        </div>
      ),
    },
    {
      id: "content",
      label: "Content",
      sortable: false,
      filterable: false,
      searchable: true,
      width: "200px",
      render: (blog: Record<string, unknown>) => (
        <div className="text-sm text-gray-500 max-w-xs">
          {truncateContent((blog as Blog).content)}
        </div>
      ),
    },
    {
      id: "createdAt",
      label: "Created At",
      sortable: true,
      filterable: false,
      searchable: false,
      width: "120px",
      render: (blog: Record<string, unknown>) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date((blog as Blog).createdAt).toLocaleDateString()}
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
    data: blogData,
    columns: blogColumns,
    defaultSort: { key: "createdAt", direction: "desc" },
  });

  const handleEdit = (row: Record<string, unknown>, index: number) => {
    const blog = row as Blog;
    router.push(`/admin/blogs/${blog.id}/edit`);
  };

  const handleDelete = (row: Record<string, unknown>, index: number) => {
    setDeleteModal({
      isOpen: true,
      blog: row as Blog
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.blog) return;
    
    try {
      await deleteBlog(deleteModal.blog.id);
      toast.success("Blog deleted successfully");
      
      // Update blogData by filtering out the deleted blog
      setBlogData(prev => prev.filter(blog => blog.id !== deleteModal.blog!.id));
      
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to delete blog");
    } finally {
      setDeleteModal({ isOpen: false, blog: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, blog: null });
  };

  const handleExport = () => {
    console.log("Export blogs");
    toast.success("Blogs exported successfully!");
  };

  const totalBlogs = blogData.length;
  const publishedBlogs = blogData.length; // All blogs are considered published for now
  const totalAuthors = new Set(blogData.map(blog => blog.author)).size;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blogs</h1>
          <p className="text-gray-600">
            Create and manage your blog posts and articles
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => router.push("/admin/blogs/create")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Blog
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Blogs"
          value={totalBlogs.toString()}
          Icon={BookOpen}
          loading={loading}
          gradient="blue"
        />
        <StatCard
          title="Published Blogs"
          value={publishedBlogs.toString()}
          Icon={Edit2}
          loading={loading}
          gradient="green"
        />
        <StatCard
          title="Authors"
          value={totalAuthors.toString()}
          Icon={Users}
          loading={loading}
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
                placeholder="Search blogs..."
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
          <div className="p-6">Loading blogs...</div>
        ) : (
          <DefaultTable
            selectedItems={selectedItems}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            columns={blogColumns}
            data={processedData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Blog"
        itemName={deleteModal.blog?.title}
      />
    </div>
  );
}