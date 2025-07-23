import React, { useEffect, useState } from 'react'
import ProductCard from './productcard';
import { Product } from "../../../types/product";
import { getAllProducts } from '@/api/product';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ShimmerCard } from "@/components/common/shimmerEffect";

interface CategoryObject {
    name: string;
}

interface RecommendedProps {
    category?: string | CategoryObject,
    currentSlug?: string
}

interface ProductWithViews extends Product {
    views?: number;
    viewCount?: number;
}

// Type predicate function
function isCategoryObject(value: unknown): value is CategoryObject {
    return typeof value === 'object' && value !== null && 'name' in value;
}

export default function RecommendedProducts({ currentSlug, category }: RecommendedProps) {
    const [recommended, setRecommended] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                setLoading(true);
                const data = await getAllProducts();
                const allProducts = Array.isArray(data) ? data : [];

                // Filter out current product and only published products
                const filtered = allProducts.filter((p: Product) => 
                    p.slug !== currentSlug && p.isPublished
                );

                // Get category name properly
                const categoryName = typeof category === 'string' 
                    ? category 
                    : isCategoryObject(category) ? (category as CategoryObject).name : undefined;

                const sameCategoryProducts: Product[] = [];

                if (categoryName) {
                    // ONLY filter by same category - no fallback to other categories
                    filtered.forEach((p: Product) => {
                        const productCategory = typeof p.category === 'string' 
                            ? p.category 
                            : isCategoryObject(p.category) ? (p.category as CategoryObject).name : undefined;
                        
                        if (typeof productCategory === 'string' && typeof categoryName === 'string') {
                            if (productCategory.toLowerCase() === categoryName.toLowerCase()) {
                                sameCategoryProducts.push(p);
                            }
                        } else if (productCategory === categoryName) {
                            sameCategoryProducts.push(p);
                        }
                    });
                }

                console.log(`🔍 Found ${sameCategoryProducts.length} products in "${categoryName}" category`);
                
                // Sort same category products by views (most viewed first)
                sameCategoryProducts.sort((a: Product, b: Product) => {
                    const productA = a as ProductWithViews;
                    const productB = b as ProductWithViews;
                    const viewsA = productA.views || productA.viewCount || 0;
                    const viewsB = productB.views || productB.viewCount || 0;
                    return viewsB - viewsA;
                });

                // ONLY show same category products (limit to 8)
                setRecommended(sameCategoryProducts.slice(0, 8));
            } catch (error) {
                console.error("Failed to fetch recommended products", error);
                setRecommended([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedProducts();
    }, [category, currentSlug]);

    // Get category name for display
    const categoryName = typeof category === 'string' 
        ? category 
        : isCategoryObject(category) ? (category as CategoryObject).name : undefined;

    const sectionTitle = categoryName 
        ? `More in ${categoryName}` 
        : "Recommended Products";

    if (loading) {
        return (
            <div className="mt-16 bg-gray-50 rounded-2xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">{sectionTitle}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ShimmerCard key={index} className="h-64 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16 bg-gray-50 rounded-2xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
                {recommended.length > (isMobile ? 2 : 4) && (
                    <div className="hidden sm:flex items-center gap-2">
                        <CarouselPrevious className="relative h-8 w-8 border-gray-300" />
                        <CarouselNext className="relative h-8 w-8 border-gray-300" />
                    </div>
                )}
            </div>

            {/* Show content based on products availability */}
            {recommended.length === 0 ? (
                // No products in this category
                <div className="text-center py-12">
                    <div className="mb-4">
                        <svg 
                            className="mx-auto h-16 w-16 text-gray-400" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1L5 5l4 4m0 0l4-4M9 9l4-4"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No products in this category
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {categoryName 
                            ? `We don't have any other products in the "${categoryName}" category at the moment.`
                            : "We don't have any products to recommend at the moment."
                        }
                    </p>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 max-w-md mx-auto">
                        <p className="text-sm text-gray-500">
                            Check back later or explore our other categories for similar products.
                        </p>
                    </div>
                </div>
            ) : (
                // Show products from same category
                <>
                    {/* Desktop/Tablet Carousel */}
                    <div className="hidden sm:block">
                        <Carousel
                            opts={{
                                align: "start",
                                slidesToScroll: isMobile ? 1 : 2,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {recommended.map((product) => (
                                    <CarouselItem
                                        key={product.id}
                                        className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                                    >
                                        <ProductCard product={product} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>

                    {/* Mobile Grid */}
                    <div className="sm:hidden grid grid-cols-2 gap-4">
                        {recommended.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} compact />
                        ))}
                    </div>

                    {/* Show More Button for Mobile */}
                    {recommended.length > 4 && (
                        <div className="sm:hidden mt-6 text-center">
                            <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                View All {categoryName} Products
                            </button>
                        </div>
                    )}

                    {/* Category Info */}
                    {categoryName && (
                        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 text-center">
                                Found <span className="font-semibold text-gray-900">{recommended.length}</span> products in <span className="font-semibold text-gray-900">{categoryName}</span> category
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
