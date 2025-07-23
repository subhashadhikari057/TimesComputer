"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getBlogById } from "@/api/blog";
import { getImageUrl } from "@/lib/imageUtils";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Calendar, User } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  content: string;
  images: string[];
  author: string;
  slug: string;
  metadata: {
    tags?: string[] | string;
    category?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      setError(null);
      try {
        const response = await getBlogById(Number(id));
        setBlog(response.data);
      } catch (err: unknown) {
        console.error("Failed to fetch blog:", err);
        setError("Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBlog();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
        <p>The blog you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Blog Header */}
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-8 text-gray-900">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-700 font-medium">
              By {blog.author || "Times Computer Automation"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        {blog.images && blog.images.length > 0 && (
          <div className="w-full mb-8 rounded-2xl overflow-hidden">
            <Image
              src={getImageUrl(blog.images[0])}
              alt={blog.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}
      </header>

      {/* Blog Content */}
      <div className="prose prose-lg prose-gray max-w-none">
        <div
          className="text-gray-800 leading-relaxed [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-8 [&>h1]:text-gray-900 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-4 [&>h2]:mt-6 [&>h2]:text-gray-900 [&>h3]:text-xl [&>h3]:font-medium [&>h3]:mb-3 [&>h3]:mt-5 [&>h3]:text-gray-900 [&>p]:mb-4 [&>p]:leading-7 [&>ul]:mb-4 [&>ol]:mb-4 [&>li]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:bg-blue-50 [&>blockquote]:italic [&>blockquote]:text-gray-700"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {blog.images && blog.images.length > 1 && (
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">
            Additional Images
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blog.images.slice(1).map((image, index) => (
              <div key={index} className="rounded-xl overflow-hidden">
                <Image
                  src={getImageUrl(image)}
                  alt={`${blog.title} - Image ${index + 2}`}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {blog.metadata && Object.keys(blog.metadata).length > 0 && (
        <div className="mt-16 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Tags & Categories
          </h3>
          <div className="space-y-3">
            {blog.metadata.tags && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-gray-700">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(blog.metadata.tags)
                    ? blog.metadata.tags
                    : [blog.metadata.tags]
                  ).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {blog.metadata.category && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Category:</span>
                <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {blog.metadata.category}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDetailPage;
