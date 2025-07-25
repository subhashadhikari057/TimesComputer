"use client";

import Image from "next/image";
import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";
import { Button } from "../ui/button";
import { getImageUrl } from "@/lib/imageUtils";

interface Blog {
  id: number;
  title: string;
  content: string;
  images: string[];
  author: string;
  slug: string;
  metadata?: {
    category?: string;
    tags?: string[] | string;
  };
  createdAt: string;
  updatedAt: string;
}

interface HeroSectionProps {
  latestBlog: Blog | null;
}

export default function HeroSection({ latestBlog }: HeroSectionProps) {
  if (!latestBlog) return null;

  const { title, content, metadata, images } = latestBlog;

  const extractDescription = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "");
    return text.length > 120 ? text.slice(0, 120) + "..." : text;
  };

  // Use the first image from the blog's images array, converted to absolute URL
  const blogImage = images && images.length > 0 ? getImageUrl(images[0]) : null;

  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {blogImage ? (
        <>
          {/* Dynamic Blog Image Background */}
          <Image
            src={blogImage}
            alt="Blog Background"
            fill
            className="object-cover object-center"
            priority
          />
        </>
      ) : (
        <>
          {/* Fallback if no blog image */}
          <Image
            src="/blogimg/bloghero.png"
            alt="Blog Background"
            width={1920}
            height={960}
            className="object-cover object-center w-full h-full"
            priority
          />
        </>
      )}

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-6 md:px-20 text-white max-w-2xl">
        <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-md mb-4">
          {metadata?.category || "Featured"}
        </span>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg mb-4">
          {title}
        </h1>

        <p className="text-sm md:text-lg mb-6 drop-shadow-md leading-relaxed">
          {extractDescription(content)}
        </p>

        <Button
          asChild
          className="text-white bg-secondary hover:bg-secondary/90 text-sm font-semibold rounded-lg shadow-2xl transition-all hover:scale-105"
        >
          <Link href={`/blogs/${latestBlog.id}`}>
            Read more <IoArrowForwardOutline className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
