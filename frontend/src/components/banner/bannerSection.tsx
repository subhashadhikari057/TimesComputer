// app/components/home/BannerSection.tsx

import React from "react";
import Carousel from "./bannerSlider";
import Adbanner from "./Adbanner";
import { Banner } from "../../../types/banner";

// Right banners
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

// Slider banners
const sliderBanners: Banner[] = [
  {
    id: "s1",
    imageUrl: "/banners/Frame 113.png",
    alt: "slide1",
    link: "/slide1",
  },
  {
    id: "s2",
    imageUrl: "/banners/Frame 114.png",
    alt: "slide2",
    link: "/slide2",
  },
  {
    id: "s3",
    imageUrl: "/banners/Frame 115.png",
    alt: "slide3",
    link: "/slide3",
  },
  {
    id: "s4",
    imageUrl: "/banners/Frame 116.png",
    alt: "slide4",
    link: "/slide4",
  },
];

export default function BannerSection() {
  return (
    <section className="grid grid-cols-4 grid-rows-2 gap-1 p-1 h-[500px]">

      {/* 🎞️ Left Carousel: spans 2 cols and all 2 rows */}
      <div className="col-span-2 row-span-2">
        <Carousel
          autoSlide
          autoSlideInterval={3000}
          slides={sliderBanners}
        />
      </div>

      {/* 📸 Top Right Banners (two square) */}
      <div className="col-span-1 row-span-1">
        <Adbanner banner={banners[0]} />
      </div>
      <div className="col-span-1 row-span-1">
        <Adbanner banner={banners[1]} />
      </div>

      {/* 📸 Bottom Right Banner (wide) */}
      <div className="col-start-3 col-span-2 row-start-2 row-span-1">
        <Adbanner banner={banners[2]} />
      </div>
    </section>

  );
}
