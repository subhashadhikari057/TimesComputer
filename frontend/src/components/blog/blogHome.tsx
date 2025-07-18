"use client";
import React from "react";

import BlogCard from "./blogCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { blogs } from "@/lib/blogdummy";






const Blog: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section className="relative py-12 px-2  max-w-7xl mx-auto">
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
        <CarouselPrevious className="hidden sm:flex  md:left-[-20px] lg:absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-10 w-10" />
        <CarouselContent className="">
          {blogs.map((blog, index) => (
            <CarouselItem
              key={index}
              className="p-2 gap-5 ml-2  sm:p-3 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4  rounded-lg"
            >
           <BlogCard 
               image={blog.imageUrl}
               title={blog.title}
               description={blog.description}
              id={blog.id}
              />
           
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselNext className="hidden sm:flex md:right-[-20px] lg:absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg h-10 w-10" />
      </Carousel>
    </section>
  );
};

export default Blog;
