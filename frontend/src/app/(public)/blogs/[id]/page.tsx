"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getBlogById } from "@/api/blog";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBlogById(Number(id));
        setBlog(data);
      } catch (err) {
        setError("Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBlog();
  }, [id]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!blog) return <div className="text-center py-10">Blog not found</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 flex flex-col">
      {/* Blog Title */}
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight break-words text-start">
        {blog.title}
      </h1>

      {/* Blog Main Image */}
      <div className="w-full mb-6">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          width={1200}
          height={500}
          className="w-full h-auto rounded-lg object-contain"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-y-10 md:gap-x-20">
        {/* Author Info */}
        <div className="flex flex-col items-start gap-4">
          <h2 className="text-gray-400 text-sm font-semibold">Author</h2>

          <div className="flex items-center gap-4">
            <Image
              src="/logos/logo.png"
              alt="author"
              width={46}
              height={46}
              className="rounded-full border border-gray-200"
            />

            <div className="flex flex-col text-primary font-medium text-base leading-snug">
              <span className="block whitespace-nowrap">Times computer</span>
              <span className="block">automation</span>
              <p className="text-gray-500 text-sm mt-2">July 17, 2025</p>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="text-justify text-gray-800 text-base space-y-4 break-words">
          <p className="whitespace-pre-line">
            Looking to buy a new laptop in Nepal? Here&apos;s our 2025 guide.
            Whether you&apos;re a student, professional, or content creator,
            finding the right laptop in Nepal can be tricky.

            With rising import prices, availability issues, and a flood of models
            in the market, choosing the best one for your needs and budget requires
            clarity. We&apos;ve listed some of the best options available right now—
            from budget-friendly picks to performance beasts.
          </p>
          <h2 className="font-bold text-xl mt-6">1. Apple MacBook Air M2 (2024)</h2>
          <Image
            src="/products/Frame 134.png"
            alt="MacBook"
            width={1037}
            height={400}
            className="rounded-md w-full h-auto"
          />
          <p>
            The MacBook Air with the M2 chip remains one of the best laptops you can
            buy in Nepal. It&apos;s sleek, lightweight, and incredibly powerful for
            its size. Ideal for students, designers, and professionals who prioritize
            battery life and smooth performance.
          </p>
          <ul className="list-disc list-inside">
            <li>Price in Nepal: Approx. NPR 170,000 – 185,000</li>
            <li>Best for: Portability, macOS ecosystem, long battery life</li>
            <li>Why buy: Premium build, reliable performance, amazing display</li>
          </ul>

          <h2 className="font-bold text-xl mt-6">2. Dell XPS 13 (2023)</h2>
          <Image
            src="/products/Frame 135.png"
            alt="Dell XPS"
            width={1037}
            height={448}
            className="rounded-md w-full h-auto"
          />
          <p>
            The Dell XPS 13 is another excellent choice for performance and display
            quality in a sleek package.
          </p>

          <h2 className="font-bold text-xl mt-6">3. Acer Aspire 7 (2024)</h2>
          <Image
            src="/products/Frame 136.png"
            alt="Acer Aspire"
            width={1037}
            height={448}
            className="rounded-md w-full h-auto"
          />
          <p>
            A great mid-range option for both students and professionals that offers
            a balance between performance and affordability.
          </p>

          <h3 className="font-bold text-xl">Conclusion</h3>
          <p className="pb-8">
            These laptops cover a wide range of budgets and use cases, making them
            some of the best options to consider in Nepal right now. Always remember
            to buy from authorized stores to ensure warranty and after-sales service.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailPage;
