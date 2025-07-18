import React from 'react';
import BannerSection from '@/components/banner/multiplebanner/bannerSection';
import { FeaturedProductsSection } from '@/components/products/productsection';
import TopCategories from '@/components/categories/categorysection';
import { UpperSingleBannerSection, LowerSingleBannerSection } from '@/components/banner/singlebanner/SingleBannerSection';
import { PopularProductsSection } from '@/components/products/popularproduct';
import BrandScroller from '@/components/home/BrandScroller';
import Blog from '@/components/blog/blogHome';

const HomePage = () => {
  return (
    <div className="max-w-[1920px] mx-auto">
      <BannerSection />
     <div id="category">
     <FeaturedProductsSection />
     <TopCategories/>
     </div>
      
      <UpperSingleBannerSection />
      <PopularProductsSection />
      <div id="brand">
      <LowerSingleBannerSection />
        <BrandScroller/>
      </div>
      <Blog />
    </div>
  );
};

export default HomePage;
