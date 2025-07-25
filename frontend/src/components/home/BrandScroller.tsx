'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getAllBrands } from '@/api/brand';
import { getImageUrl } from '@/lib/imageUtils';
import SkeletonLoader from '../common/skeletonloader';

interface Brand {
  id: number;
  name: string;
  image: string;
}

type BrandCarouselProps = {
  title?: string;
  titleClassName?: string;
};

export default function BrandCarousel({
  title = 'Shop by brands',
  titleClassName = '',
}: BrandCarouselProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [brandWidth, setBrandWidth] = useState(208);
  const animationRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const startTimeRef = useRef<number | undefined>(undefined);
  const pausedTimeRef = useRef<number>(0);
  const SCROLL_SPEED = 35;

  // Fetch brands from backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllBrands();
        const brandsData = response.data || [];
        setBrands(brandsData);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
        setError("Failed to load brands");
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (cardRef.current && brands.length > 0) {
      const width = cardRef.current.offsetWidth + 24; // gap-6 = 24px
      setBrandWidth(width);
    }
  }, [brands]);

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

 if (loading) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className={`text-2xl font-semibold text-gray-900 mb-8 ${titleClassName}`}>
        {title}
      </h2>
      <div className="flex gap-6 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <SkeletonLoader key={i} type="brand" />
        ))}
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className={`text-2xl font-semibold text-gray-900 mb-8 ${titleClassName}`}>
          {title}
        </h2>
        <div className="text-center py-16 text-gray-500">
          {error}
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className={`text-2xl font-semibold text-gray-900 mb-8 ${titleClassName}`}>
          {title}
        </h2>
        <div className="text-center py-16 text-gray-500">
          No brands available
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className={`text-2xl font-semibold text-gray-900 mb-8 ${titleClassName}`}>
        {title}
      </h2>

      <div className="relative overflow-hidden">
        <div
          ref={containerRef}
          className="flex gap-6 transition-transform duration-100 ease-out"
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
              className="relative flex-shrink-0 group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label={`Shop by brand ${brand.name}`}
            >
              <div className="w-40 h-24 sm:w-48 sm:h-28 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 p-4 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {brand.image ? (
                    <Image
                      src={getImageUrl(brand.image)}
                      alt={brand.name}
                      fill
                      className="object-contain filter brightness-75 group-hover:brightness-100 transition-all duration-300"
                      sizes="(max-width: 640px) 160px, 192px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
