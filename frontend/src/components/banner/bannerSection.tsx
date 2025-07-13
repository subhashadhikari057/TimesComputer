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
   <div>
     <section className="grid grid-cols-4 grid-rows-2 gap-1 p-1 ">

{/* 🎞️ Left Carousel: mobile-only */}
<div className="col-span-4 row-span-2 block lg:hidden">
  <Carousel autoSlide autoSlideInterval={3000} slides={sliderBanners} />
</div>

{/* 🖥️ Desktop layout: only shown on md and up */}
<div className="hidden lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-1 lg:h-[500px] w-full col-span-4 row-span-2">

  {/* Left side Carousel hidden on mobile */}
  <div className="col-span-2 row-span-2">
    {/* Carousel still loads for layout consistency, but hidden on small screens */}
    <Carousel autoSlide autoSlideInterval={3000} slides={sliderBanners} />
  </div>

  {/* Top right banners */}
  <div className="col-span-1 row-span-1">
    <Adbanner banner={banners[0]} />
  </div>
  <div className="col-span-1 row-span-1">
    <Adbanner banner={banners[1]} />
  </div>

  {/* Bottom wide banner */}
  <div className="col-start-3 col-span-2 row-start-2 row-span-1">
    <Adbanner banner={banners[2]} />
  </div>
</div>

</section>
   </div>
  );
}
