// app/components/home/bannerSlider.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "../../../types/banner";

interface CarouselProps {
  autoSlide?: boolean;
  autoSlideInterval?: number;
  slides: Banner[];
}

export default function Carousel({
  autoSlide = false,
  autoSlideInterval = 3000,
  slides,
}: CarouselProps) {
  const [curr, setCurr] = useState(0);

  // Navigate to previous slide
  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));

  // Navigate to next slide
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  // Auto slide logic
  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval]);

  return (
    // Outer wrapper: ensures it doesn't overflow screen width on mobile
    <div className="relative w-full max-w-screen mx-auto aspect-[16/9] lg:h-full overflow-hidden">
      {/* Slides container with horizontal scroll logic */}
      <div
        className="flex transition-transform ease-out duration-500 h-full"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slide) => (
          // Slide: ensure it doesn’t push past viewport width
          <div key={slide.id} className="w-full h-full relative flex-shrink-0">
            <Link href={slide.link} className="block w-full h-full relative">
              <Image
                src={slide.imageUrl}
                alt={slide.alt || "banner"}
                fill
                className="object-cover"
                unoptimized
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation arrows (left/right) */}
      <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
        <button
          onClick={prev}
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white pointer-events-auto"
        >
          <ChevronLeft size={40} />
        </button>
        <button
          onClick={next}
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white pointer-events-auto"
        >
          <ChevronRight size={40} />
        </button>
      </div>

      {/* Slide indicators (bottom center) */}
      <div className="absolute bottom-4 left-0 right-0 pointer-events-none">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`transition-all w-3 h-3 bg-white rounded-full ${curr === i ? "p-2" : "bg-opacity-50"
                } pointer-events-auto`}
              onClick={() => setCurr(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
