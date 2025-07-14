import React from 'react'
import BannerSection from '@/components/banner/bannerSection'
import { FeaturedProductsSection } from '@/components/products/productsection'
import Blog from '@/components/blog/blog';
const HomePage = () => {
  return (
   <div className="max-w-[1920px] mx-auto">
    <BannerSection />
    <FeaturedProductsSection />
    <Blog/>
    
   </div>
  )
};
export default HomePage;