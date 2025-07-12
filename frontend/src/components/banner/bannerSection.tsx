import React from "react";
import Carousel from "./bannerSlider";
import Adbanner from "./Adbanner";
import { Banner } from "../../../types/banner";

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
    <section className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-1 py-1 px-1">
  {/* Carousel - Full width on mobile/tablet, 2x2 span on desktop */}
  <div className="lg:row-span-2 lg:col-span-2 aspect-[16/9] lg:aspect-auto">
    <Carousel
      autoSlide={true}
      autoSlideInterval={3000}
      slides={sliderBanners}
    />
  </div>

  {/* Static Banners - Hidden on mobile/tablet, shown on desktop */}
  <div className="hidden lg:block lg:col-span-1 aspect-[4/3]">
    <Adbanner banner={banners[0]} />
  </div>
  <div className="hidden lg:block lg:col-span-1 aspect-[4/3]">
    <Adbanner banner={banners[1]} />
  </div>
  <div className="hidden lg:block lg:col-span-2 aspect-[16/5]">
    <Adbanner banner={banners[2]} />
  </div>
</section>
  );
}


// BannerSection.tsx (no "use client")

// import Carousel from "./bannerSlider";
// import Adbanner from "./Adbanner";
// import { Banner } from "../../../types/banner";

// async function getStaticBanners(): Promise<Banner[]> {
//   const res = await fetch("https://your-api.com/static-banners", {
//     next: { revalidate: 60 }, // or `cache: "no-store"` for SSR
//   });
//   return res.json();
// }

// async function getSliderBanners(): Promise<Banner[]> {
//   const res = await fetch("https://your-api.com/slider-banners", {
//     next: { revalidate: 60 },
//   });
//   return res.json();
// }

// export default async function BannerSection() {
//   const staticBanners = await getStaticBanners();
//   const sliderBanners = await getSliderBanners();

//   return (
//     <section className="grid grid-cols-4 grid-rows-2 gap-1 py-1 px-1 h-[500px]">
//       <div className="row-span-2 col-span-2">
//         <Carousel
//           autoSlide={true}
//           autoSlideInterval={3000}
//           slides={sliderBanners}
//         />
//       </div>
//       {staticBanners.slice(0, 2).map((banner) => (
//         <div className="col-span-1" key={banner.id}>
//           <Adbanner banner={banner} />
//         </div>
//       ))}
//       {staticBanners[2] && (
//         <div className="col-span-2" key={staticBanners[2].id}>
//           <Adbanner banner={staticBanners[2]} />
//         </div>
//       )}
//     </section>
//   );
// }
