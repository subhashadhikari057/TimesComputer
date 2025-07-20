"use client";
import React, { useState, useEffect } from "react";
import BlogCard from "./blogCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
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
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

const Blog: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
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
        setBlogs(blogsData.slice(0, 8)); // Limit to 8 blogs for carousel
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load blogs");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Extract description from content (first 100 characters)
  const extractDescription = (content: string) => {
    // Remove HTML tags and get first 100 characters
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
  };

  if (loading) {
    return (
      <section className="relative py-12 px-4 max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Blogs</h2>
        </div>
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-12 px-4 max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Blogs</h2>
        </div>
        <div className="text-center py-16 text-gray-500">
          {error}
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="relative py-12 px-4 max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Blogs</h2>
        </div>
        <div className="text-center py-16 text-gray-500">
          No blogs available
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 px-4 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Blogs</h2>
      </div>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: isMobile ? 1 : 4,
        }}
        className="w-full"
      >
        {blogs.length > 4 && (
          <CarouselPrevious className="hidden sm:flex md:left-[-20px] lg:absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-10 w-10" />
        )}
        <CarouselContent className="">
          {blogs.map((blog) => (
            <CarouselItem
              key={blog.id}
              className="p-2 gap-5 ml-2 sm:p-3 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 rounded-lg"
            >
              <BlogCard 
                image={blog.images?.[0] ? getImageUrl(blog.images[0]) : "/products/Frame_68.png"}
                title={blog.title}
                description={extractDescription(blog.content)}
                id={blog.id.toString()}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {blogs.length > 4 && (
          <CarouselNext className="hidden sm:flex md:right-[-20px] lg:absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-10 w-10" />
        )}
      </Carousel>
    </section>
  );
};

export default Blog;
