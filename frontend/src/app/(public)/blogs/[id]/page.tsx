"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getBlogById } from "@/api/blog";
import { getImageUrl } from "@/lib/imageUtils";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Blog {
  id: number;
  title: string;
  content: string;
  images: string[];
  author: string;
  slug: string;
  metadata: any;
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
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBlog();
  }, [id]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
        <p>The blog you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Blog Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Author and Date Info */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <Image
            src="/logos/logo.png"
            alt="author"
            width={50}
            height={50}
            className="rounded-full border border-gray-200"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-primary">
              {blog.author || "Times Computer Automation"}
            </span>
            <span className="text-gray-500 text-sm">
              Published on {formatDate(blog.createdAt)}
            </span>
            {blog.updatedAt !== blog.createdAt && (
              <span className="text-gray-400 text-xs">
                Updated on {formatDate(blog.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Blog Main Image */}
        {blog.images && blog.images.length > 0 && (
          <div className="w-full mb-8">
            <Image
              src={getImageUrl(blog.images[0])}
              alt={blog.title}
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg object-cover max-h-96"
              priority
            />
          </div>
        )}
      </header>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none">
        <div 
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* Additional Images */}
      {blog.images && blog.images.length > 1 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Additional Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blog.images.slice(1).map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
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

      {/* Blog Metadata */}
      {blog.metadata && Object.keys(blog.metadata).length > 0 && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Tags & Categories</h3>
          <div className="space-y-2">
            {blog.metadata.tags && (
              <div>
                <span className="font-medium text-gray-700">Tags: </span>
                <span className="text-gray-600">
                  {Array.isArray(blog.metadata.tags) 
                    ? blog.metadata.tags.join(', ') 
                    : blog.metadata.tags}
                </span>
              </div>
            )}
            {blog.metadata.category && (
              <div>
                <span className="font-medium text-gray-700">Category: </span>
                <span className="text-gray-600">{blog.metadata.category}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDetailPage;
