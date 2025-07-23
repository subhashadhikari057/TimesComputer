"use client";

import React, { useState, useEffect } from 'react';
import { Banner } from '../../../../types/banner';
import SingleAdbanner from '../singlebanner/Singleadbanner';
import AdPlaceholder from '../AdPlaceholder';
import { getAllAds } from "@/api/ads";
import { getImageUrl } from "@/lib/imageUtils";

function UpperSingleBannerSection() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await getAllAds();
        const adsData = response.data || [];
        
        // Find the upper banner specifically
        const upperBannerAd = adsData.find((ad: { placement: string; isActive: boolean; id: number; images: string[]; title?: string; link?: string }) => ad.placement === 'upper-banner' && ad.isActive);
        
        if (upperBannerAd && upperBannerAd.images[0]) {
          setBanner({
            id: upperBannerAd.id.toString(),
            imageUrl: getImageUrl(upperBannerAd.images[0]),
            alt: upperBannerAd.title || "Upper Banner",
            link: upperBannerAd.link || "/",
          });
        } else {
          // No banner available - will show placeholder
          setBanner(null);
        }
      } catch (error) {
        console.error("Failed to fetch upper banner:", error);
        // Error - will show placeholder
        setBanner(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:py-8">
        <div className="w-full h-40 md:h-56 lg:h-72 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:py-8">
      <div className="w-full h-40 md:h-56 lg:h-72">
        {banner ? (
          <SingleAdbanner banner={banner} placement="upper-banner" />
        ) : (
          <AdPlaceholder placement="upper-banner" />
        )}
      </div>
    </div>
  );
}

function LowerSingleBannerSection() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await getAllAds();
        const adsData = response.data || [];
        
        // Find the lower banner specifically
        const lowerBannerAd = adsData.find((ad: { placement: string; isActive: boolean; id: number; images: string[]; title?: string; link?: string }) => ad.placement === 'lower-banner' && ad.isActive);
        
        if (lowerBannerAd && lowerBannerAd.images[0]) {
          setBanner({
            id: lowerBannerAd.id.toString(),
            imageUrl: getImageUrl(lowerBannerAd.images[0]),
            alt: lowerBannerAd.title || "Lower Banner",
            link: lowerBannerAd.link || "/",
          });
        } else {
          // No banner available - will show placeholder
          setBanner(null);
        }
      } catch (error) {
        console.error("Failed to fetch lower banner:", error);
        // Error - will show placeholder
        setBanner(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:py-8">
        <div className="w-full h-40 md:h-56 lg:h-72 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:py-8">
      <div className="w-full h-40 md:h-56 lg:h-72">
        {banner ? (
          <SingleAdbanner banner={banner} placement="lower-banner" />
        ) : (
          <AdPlaceholder placement="lower-banner" />
        )}
      </div>
    </div>
  );
}

export { UpperSingleBannerSection, LowerSingleBannerSection };
