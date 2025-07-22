'use client';

interface SkeletonLoaderProps {
  type: 'card' | 'filter-sidebar' | 'brand' | 'category-pill'| 'product-card';    
  count?: number;
  compact?: boolean;
  dynamicHeight?: boolean;
  className?: string;
}

export default function SkeletonLoader({
  type,
  count = 1,
  compact = false,
  dynamicHeight = false,
  className = '',
}: SkeletonLoaderProps) {

    const renderProductDetails = () => (
  <div className="animate-pulse max-w-7xl mx-auto mt-2 p-6 bg-white">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Thumbnail column */}
      <div className="lg:col-span-1 order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg" />
        ))}
      </div>

      {/* Main image */}
      <div className="lg:col-span-6 order-1 lg:order-2">
        <div className="bg-gray-100 rounded-lg h-96 w-full" />
      </div>

      {/* Details section */}
      <div className="lg:col-span-5 order-3 space-y-6">
        <div className="space-y-3">
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="flex gap-3 mt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full border border-gray-300 bg-gray-300" />
            ))}
          </div>
          <div className="h-10 bg-gray-300 rounded w-full mt-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Key Features */}
        <div>
          <div className="h-5 bg-gray-300 rounded w-1/3 mb-4" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-24 h-4 bg-gray-200 rounded" />
                <div className="flex-1 h-4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Tabs */}
    <div className="mt-12 flex space-x-8">
      <div className="h-6 w-24 bg-gray-300 rounded" />
      <div className="h-6 w-24 bg-gray-200 rounded" />
    </div>

    {/* Table content */}
    <div className="mt-6 bg-white border border-gray-200 rounded-lg">
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="w-1/4 h-4 bg-gray-200 rounded" />
            <div className="flex-1 h-4 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);


    const renderCategoryPill = () => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gray-100 animate-pulse w-40 h-14">
    {/* Icon placeholder */}
    <div className="w-10 h-10 rounded-md bg-gray-300" />
    
    {/* Text placeholder */}
    <div className="flex-1 h-4 bg-gray-300 rounded w-16" />
  </div>
);


  const renderCard = () => (
    <div
      className={`w-full ${compact ? 'max-w-full' : 'max-w-[90%] sm:max-w-[250px]'} mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse`}
    >
      {/* Image Skeleton */}
      {dynamicHeight ? (
        <div className="relative w-full aspect-[4/3] bg-gray-200" />
      ) : (
        <div className={`${compact ? 'h-32' : 'h-40 sm:h-44'} w-full bg-gray-200`} />
      )}

      {/* Info Section */}
      <div className={`flex flex-col gap-2 ${compact ? 'p-2' : 'p-3 sm:p-4'}`}>
        <div className={`h-4 bg-gray-300 rounded ${compact ? 'w-3/4' : 'w-4/5'}`} />
        <div className={`h-4 bg-gray-300 rounded ${compact ? 'w-1/2' : 'w-2/3'}`} />
        <div className="flex items-center justify-between mt-2">
          <div className={`h-4 bg-gray-300 rounded ${compact ? 'w-1/3' : 'w-1/4'}`} />
          <div className={`h-4 bg-gray-200 rounded ${compact ? 'w-1/4' : 'w-1/6'}`} />
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="animate-pulse bg-white rounded-xl p-4 space-y-6">
      <div className="h-6 bg-gray-300 rounded w-1/3" />

      {/* Price inputs */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-10 bg-gray-300 rounded w-full" />
        <div className="h-10 bg-gray-300 rounded w-full" />
        <div className="h-2 bg-gray-200 rounded w-full" />
      </div>

      {/* Brand */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>

      <div className="h-10 bg-gray-400 rounded w-full mt-4" />
    </div>
  );

  const renderBrand = () => (
  <div className="w-40 h-24 sm:w-48 sm:h-28 bg-white border border-gray-200 rounded-2xl shadow-sm animate-pulse flex items-center justify-center">
    <div className="w-20 h-12 bg-gray-300 rounded" />
  </div>
);


  const renderByType = () => {
    switch (type) {
      case 'card':
        return renderCard();
      case 'filter-sidebar':
        return renderSidebar();
      case 'brand':
        return renderBrand();
      case 'category-pill':
        return renderCategoryPill();
      case 'product-card':
        return renderProductDetails();
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={className}>
          {renderByType()}
        </div>
      ))}
    </>
  );
}
