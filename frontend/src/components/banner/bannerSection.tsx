// app/components/home/BannerSection.tsx
import React from "react";
import Carousel from "./bannerSlider";
import Adbanner from "./Adbanner";
import { Banner } from "../../../types/banner";

// Static banners for the right section
const banners: Banner[] = [
  {
    id: "1",
    imageUrl: "/banners/Frame 111.png",
    alt: "banner2",
    link: "/banner2",
  },
  {
    id: "2",
    imageUrl: "/banners/Frame 112.png",
    alt: "banner3",
    link: "/banner3",
  },
  {
    id: "3",
    imageUrl: "/banners/Frame 110.png",
    alt: "banner4",
    link: "/banner4",
  },
];

// Slider banners for the carousel (left side)
const sliderBanners: Banner[] = [
  {
    id: 's1',
    imageUrl: '/banners/Frame 113.png',
    alt: 'slide1',
    link: '/slide1',
  },
  {
    id: 's2',
    imageUrl: '/banners/Frame 114.png',
    alt: 'slide2',
    link: '/slide2',
  },
  {
    id: 's3',
    imageUrl: '/banners/Frame 115.png',
    alt: 'slide3',
    link: '/slide3',
  },
  {
    id: 's4',
    imageUrl: '/banners/Frame 116.png',
    alt: 'slide4',
    link: '/slide4',
  },
];

export default function BannerSection() {
  return (
    // Main section using CSS grid layout
    // Removed fixed height for better responsiveness
    <section className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-1 p-1">

      {/* Left: Carousel takes up 2x2 grid area on desktop */}
      {/* Uses aspect ratio on mobile, fills height on desktop */}
      <div className="lg:col-span-2 lg:row-span-2 aspect-[16/9] lg:aspect-auto">
        <Carousel
          autoSlide={true}
          autoSlideInterval={3000}
          slides={sliderBanners}
        />
      </div>

      {/* Right: Top two static banners (hidden on mobile) */}
      <div className="hidden lg:block lg:col-span-1 lg:row-span-1 h-full">
        <Adbanner banner={banners[0]} />
      </div>
      <div className="hidden lg:block lg:col-span-1 lg:row-span-1 h-full">
        <Adbanner banner={banners[1]} />
      </div>

      {/* Right: Bottom wide static banner */}
      <div className="hidden lg:block lg:col-span-2 lg:row-span-1 h-full">
        <Adbanner banner={banners[2]} />
      </div>
    </section>
  );
}
