// app/components/home/bannerSlider.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "../../../../types/banner";

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
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Navigate to previous slide
  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));

  // Navigate to next slide
  const next = useCallback(() =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1)),
    [slides.length]
  );

  // Auto slide logic - only auto-slide if there are multiple slides
  useEffect(() => {
    if (!autoSlide || slides.length <= 1) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval, next, slides.length]);

  // Return null if no slides are provided
  if (!slides || slides.length === 0) {
    return null;
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    if (autoSlide) {
      clearInterval(autoSlideInterval);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (carouselRef.current) {
      // Apply temporary transform during drag
      carouselRef.current.style.transition = 'none';
      const percentage = (diff / window.innerWidth) * 100;
      const newPosition = curr * 100 + percentage;
      carouselRef.current.style.transform = `translateX(-${newPosition}%)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = window.innerWidth / 5; // 20% of screen width
    
    if (diff > threshold) {
      next(); // Swipe left
    } else if (diff < -threshold) {
      prev(); // Swipe right
    }
    
    // Reset the position with smooth transition
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.5s ease-out';
      carouselRef.current.style.transform = `translateX(-${curr * 100}%)`;
    }
  };

  return (
    // Outer wrapper: ensures it doesn't overflow screen width on mobile
    <div className="relative w-full max-w-screen mx-auto aspect-[16/9] lg:h-full overflow-hidden">
      {/* Slides container with horizontal scroll logic */}
      <div
        ref={carouselRef}
        className="flex transition-transform ease-out duration-500 h-full"
        style={{ transform: `translateX(-${curr * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide) => (
          // Slide: ensure it doesn't push past viewport width
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
        {/* <button
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
        </button> */}
      </div>

      {/* Slide indicators (bottom center) - only show if multiple slides */}
      {slides.length > 1 && (
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
      )}
    </div>
  );
}