"use client";

import Image from "next/image";
import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";
import { Button } from "../ui/button";

interface Blog {
  title: string;
  content: string;
  id: number;
  metadata?: {
    category?: string;
  };
}

interface HeroSectionProps {
  latestBlog: Blog | null;
}

export default function HeroSection({ latestBlog }: HeroSectionProps) {
  if (!latestBlog) return null;

  const { title, content, metadata } = latestBlog;

  const extractDescription = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "");
    return text.length > 120 ? text.slice(0, 120) + "..." : text;
  };

  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {/* ✅ STATIC Background Image */}
      <Image
        src="/blogimg/bloghero.png"
        alt="Hero Background"
        width={1920}
        height={960}
        className="object-cover object-center z-0 w-full h-full"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Dynamic Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-6 md:px-20 text-white">
        <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-md mb-4">
          {metadata?.category || "Featured"}
        </span>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          {title}
        </h1>

        <p className="text-sm md:text-lg mt-4 max-w-xl">
          {extractDescription(content)}
        </p>

        <Button
          asChild
          className="mt-6 text-white bg-secondary hover:bg-secondary/90 text-sm font-semibold rounded-lg shadow-2xl transition"
        >
          <Link href={`/blogs/${latestBlog.id}`}>
            Read more <IoArrowForwardOutline className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
