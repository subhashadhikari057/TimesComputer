import React from 'react'
import BannerSection from '@/components/banner/bannerSection'
import { FeaturedProductsSection } from '@/components/products/productsection'
import BrandScroller from '@/components/home/BrandScroller';

const HomePage = () => {
  return (
    <div className="max-w-[1920px] mx-auto">
      <BannerSection />
      <FeaturedProductsSection />
      <BrandScroller />
    </div>
  )
};
export default HomePage;