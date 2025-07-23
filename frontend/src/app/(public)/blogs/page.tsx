"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/blog/blogHeroSection";
import BlogCard from "@/components/blog/blogCard";
import { getAllBlogs } from "@/api/blog";
import { getImageUrl } from "@/lib/imageUtils";
import LoadingSpinner from "@/components/common/LoadingSpinner";

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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllBlogs();
        const blogsData = response.data || [];

        // Sort blogs by creation date (latest first)
        const sortedBlogs = blogsData.sort(
          (a: Blog, b: Blog) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setBlogs(sortedBlogs);
      } catch (err: unknown) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load blogs");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const extractDescription = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > 100
      ? textContent.substring(0, 100) + "..."
      : textContent;
  };

  if (loading) {
    return (
      <div>
        <HeroSection latestBlog={blogs[0]} />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeroSection latestBlog={blogs[0]} />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-16 text-gray-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection latestBlog={blogs[0]} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Latest Blogs</h2>
        {blogs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No blogs available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id.toString()}
                image={
                  blog.images?.[0]
                    ? getImageUrl(blog.images[0])
                    : "/products/Frame_68.png"
                }
                title={blog.title}
                description={extractDescription(blog.content)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
