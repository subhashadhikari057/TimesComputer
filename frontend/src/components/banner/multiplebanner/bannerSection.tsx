// app/components/home/BannerSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import Carousel from "../multiplebanner/bannerSlider";
import Adbanner from "./Adbanner";
import AdPlaceholder from "../AdPlaceholder";
import { Banner } from "../../../../types/banner";
import { getAllAds } from "@/api/ads";
import { getImageUrl } from "@/lib/imageUtils";

export default function BannerSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [sliderBanners, setSliderBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Fetch ads from backend
        const response = await getAllAds();
        console.log("Banner response:", response);
        const adsData = response.data || [];
        
        // Filter ads by placement and active status
        const sliderAds = adsData.filter((ad: any) => ad.placement === 'slider' && ad.isActive);
        const boxAds = adsData.filter((ad: any) => 
          ['box1', 'box2', 'box3'].includes(ad.placement) && ad.isActive
        );
        
        // Convert slider ads to banner format
        const convertedSliderBanners: Banner[] = sliderAds
          .slice(0, 4) // Max 4 slider banners
          .map((ad: any, index: number) => ({
            id: ad.id.toString(),
            imageUrl: ad.images[0] ? getImageUrl(ad.images[0]) : "",
            alt: ad.title || `Slider Banner ${index + 1}`,
            link: ad.link || "/",
          }));

        // Sort box ads by placement order and convert to banner format
        const sortedBoxAds = boxAds.sort((a: any, b: any) => {
          const order = ['box1', 'box2', 'box3'];
          return order.indexOf(a.placement) - order.indexOf(b.placement);
        });
        
        const convertedBoxBanners: Banner[] = sortedBoxAds
          .slice(0, 3) // Max 3 box banners
          .map((ad: any, index: number) => ({
            id: ad.id.toString(),
            imageUrl: ad.images[0] ? getImageUrl(ad.images[0]) : "",
            alt: ad.title || `Box Banner ${index + 1}`,
            link: ad.link || "/",
          }));

        // Set slider banners - use dynamic ads or empty array for placeholder
        setSliderBanners(convertedSliderBanners);

        // Set box banners - use dynamic ads or empty array for placeholders
        setBanners(convertedBoxBanners);
        
      } catch (error) {
        console.error("Failed to fetch banner ads:", error);
        // Set empty arrays to show placeholders on error
        setBanners([]);
        setSliderBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 grid-rows-2 gap-1 p-1">
        <div className="col-span-4 row-span-2 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
   <div>
     <section className="grid grid-cols-4 grid-rows-2 gap-1 p-1 ">

{/* 🎞️ Left Carousel: mobile-only */}
<div className="col-span-4 row-span-2 block lg:hidden">
  {sliderBanners.length > 0 ? (
    <Carousel autoSlide autoSlideInterval={3000} slides={sliderBanners} />
  ) : (
    <AdPlaceholder placement="slider" />
  )}
</div>

{/* 🖥️ Desktop layout: only shown on md and up */}
<div className="hidden lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-1 lg:h-[500px] w-full col-span-4 row-span-2">

  {/* Left side Carousel hidden on mobile */}
  <div className="col-span-2 row-span-2">
    {sliderBanners.length > 0 ? (
      <Carousel autoSlide autoSlideInterval={3000} slides={sliderBanners} />
    ) : (
      <AdPlaceholder placement="slider" />
    )}
  </div>

  {/* Top right banners */}
  <div className="col-span-1 row-span-1">
    {banners.length > 0 && banners[0] ? (
      <Adbanner banner={banners[0]} />
    ) : (
      <AdPlaceholder placement="box" />
    )}
  </div>
  <div className="col-span-1 row-span-1">
    {banners.length > 1 && banners[1] ? (
      <Adbanner banner={banners[1]} />
    ) : (
      <AdPlaceholder placement="box" />
    )}
  </div>

  {/* Bottom wide banner */}
  <div className="col-start-3 col-span-2 row-start-2 row-span-1">
    {banners.length > 2 && banners[2] ? (
      <Adbanner banner={banners[2]} />
    ) : (
      <AdPlaceholder placement="box" />
    )}
  </div>
</div>

</section>
   </div>
  );
}
