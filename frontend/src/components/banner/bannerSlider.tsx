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

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval]);

  return (
    <div className="overflow-hidden relative h-full">
      {/* Slide container */}
      <div
        className="flex transition-transform ease-out duration-500 h-full"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <Link 
              href={slide.link} 
              className="block w-full h-full relative"
            >
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

      {/* Navigation arrows */}
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

      {/* Slide indicators */}
      <div className="absolute bottom-4 right-0 left-0 pointer-events-none">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`transition-all w-3 h-3 bg-white rounded-full ${
                curr === i ? "p-2" : "bg-opacity-50"
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