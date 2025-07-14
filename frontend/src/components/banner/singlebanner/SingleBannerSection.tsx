import React from 'react'
import { Banner } from '../../../../types/banner';

import SingleAdbanner from '../singlebanner/Singleadbanner';

const banners: Banner[] = [
    {
      id: "1",
      imageUrl: "/banners/Frame 172.svg",
      alt: "banner2",
      link: "/banner2",
    },
    {
      id: "2",
      imageUrl: "/banners/Frame 174.svg",
      alt: "banner2",
      link: "/banner2",
    },
  ];

function UpperSingleBannerSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:py-8">
    <div className="w-full h-40 md:h-56 lg:h-72"> {/* 👈 Add this wrapper */}
      <SingleAdbanner banner={banners[0]} />
    </div>
  </div>
  )
}

 function LowerSingleBannerSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:py-8">
    <div className="w-full h-40 md:h-56 lg:h-72"> {/* 👈 Add this wrapper */}
      <SingleAdbanner banner={banners[1]} />
    </div>
  </div>
  )
}

export { UpperSingleBannerSection, LowerSingleBannerSection };
