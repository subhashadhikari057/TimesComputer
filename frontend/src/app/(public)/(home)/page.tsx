import React from 'react'
import BannerSection from '@/components/banner/bannerSection'
import { FeaturedProductsSection } from '@/components/products/productsection'
const HomePage = () => {
  return (
   <div className="max-w-[1920px] mx-auto">
    <BannerSection />
    <FeaturedProductsSection />
   </div>
  )
};
export default HomePage;