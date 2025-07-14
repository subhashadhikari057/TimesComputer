"use client";
import React from "react";
import { ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const blogs: BlogCardProps[] = [
  {
    title: "Best Laptops for Students in 2024?",
    description:
      "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/images/blog1.jpg",
  },
  {
    title: "Gaming Laptops Under NPR 1,00,000",
    description:
      "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/images/blog2.jpg",
  },
  {
    title: "How to Keep Your Laptop Fast?",
    description:
      "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/images/blog3.jpg",
  },
  {
    title: "Why Buy from Times Computer Automation?",
    description:
      "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/images/blog4.jpg",
  },
  {
    title: "Best Laptops for Students in 2024?",
    description:
      "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/images/blog1.jpg",
  },
  {
    title: "Best Laptops for Students in 2024?",
    description:
      "Top student-friendly laptops that balance performance, portability, and price.",
    imageUrl: "/images/blog1.jpg",
  },
];

const Blog: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

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
        {/* Navigation buttons must be INSIDE the Carousel component */}
        <CarouselPrevious className="hidden sm:flex absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-10 w-10" />

        <CarouselContent className="m-2 flex gap-6">
          {blogs.map((blog,index) => (
            <CarouselItem
              key={index}
              className="p-4 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 border border-muted-foreground/50 rounded-lg"
            >
              <div className="rounded-md overflow-hidden mb-4">
                <Image
                  src="/products/Frame 68.png"
                  alt={"blog-1"}
                  width={300}
                  height={180}
                  className="rounded-lg object-cover w-full h-[180px]"
                />
              </div>
              <h3 className="font-semibold text-md mb-1">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{blog.description}</p>
              <Link
                href="#"
                className="text-blue-600 text-sm bg-blue-100 px-3 py-1.5 rounded-2xl  font-medium hover:underline inline-flex items-center"
              >
                  READ MORE <ChevronRight className="w-4 h-4" />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselNext className="hidden sm:flex absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-10 w-10" />
      </Carousel>
    </section>
  );
};

export default Blog;
