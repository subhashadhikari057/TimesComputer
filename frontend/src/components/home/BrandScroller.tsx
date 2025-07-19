'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const brands = [
  { name: 'Dell', imgSrc: '/brands/Frame 162.png', bgColor: 'bg-blue-500', textColor: 'text-white' },
  { name: 'Apple', imgSrc: '/brands/Frame 163.png', bgColor: 'bg-gray-400', textColor: 'text-white' },
  { name: 'Lenovo', imgSrc: '/brands/Frame 164.png', bgColor: 'bg-white', textColor: 'text-red-500' },
  { name: 'ASUS', imgSrc: '/brands/Frame 165.png', bgColor: 'bg-black', textColor: 'text-white' },
  { name: 'HP', imgSrc: '/brands/Frame 166.png', bgColor: 'bg-blue-600', textColor: 'text-white' },
  { name: 'Acer', imgSrc: '/brands/Frame 167.png', bgColor: 'bg-green-500', textColor: 'text-white' },
  {
    name: 'Microsoft',
    imgSrc: '/brands/Frame 168.png',
    bgColor: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500',
    textColor: 'text-white',
  },
];


type BrandCarouselProps = {
  title?: string;
  titleClassName?: string;
};

export default function BrandCarousel({
  title = 'Shop by brands',
  titleClassName = '',
}: BrandCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [brandWidth, setBrandWidth] = useState(208);
  const animationRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const startTimeRef = useRef<number | undefined>(undefined);
  const pausedTimeRef = useRef<number>(0);
  const SCROLL_SPEED = 35;

  useEffect(() => {
    if (cardRef.current) {
      const width = cardRef.current.offsetWidth + 16; // gap-4 = 16px
      setBrandWidth(width);
    }
  }, []);

  const TOTAL_WIDTH = brands.length * brandWidth;

  useEffect(() => {
    if (!isPaused) {
      const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = currentTime - pausedTimeRef.current;
        }
        const elapsed = currentTime - startTimeRef.current;
        const newTranslateX = (elapsed * SCROLL_SPEED) / 1000;

        if (newTranslateX >= TOTAL_WIDTH) {
          startTimeRef.current = currentTime;
          pausedTimeRef.current = 0;
          setTranslateX(0);
        } else {
          setTranslateX(newTranslateX);
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
        pausedTimeRef.current = ((translateX / TOTAL_WIDTH) * (TOTAL_WIDTH * 1000)) / SCROLL_SPEED;
        startTimeRef.current = undefined;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, translateX, TOTAL_WIDTH]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className="max-w-6xl mx-auto px-2 py-6 font-sans">
      <h2 className={`text-2xl font-semibold text-gray-900 mb-8 ${titleClassName}`}>
        {title}
      </h2>

      <div className="relative overflow-hidden">
        <div
          ref={containerRef}
          className="flex gap-4 transition-transform duration-100 ease-out"
          style={{
            transform: `translateX(-${translateX}px)`,
            width: `${brandWidth * brands.length * 2}px`,
          }}
        >
          {[...brands, ...brands].map((brand, index) => (
  <Link
    key={`${brand.name}-${index}`}
    href={`/brand/${brand.name.toLowerCase()}`}
    ref={index === 0 ? cardRef : null}
    className="relative flex-shrink-0 w-36 h-20 sm:w-48 sm:h-24 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    aria-label={`Shop by brand ${brand.name}`}
  >
    <Image
      src={brand.imgSrc}
      alt={brand.name}
      fill
      style={{ objectFit: 'cover' }}
      priority
      sizes="(max-width: 640px) 12rem, 16rem" // for responsiveness
    />
  </Link>
))}
        </div>
      </div>
    </div>
  );
}
