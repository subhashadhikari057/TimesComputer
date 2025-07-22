import React, { useEffect, useState } from 'react'
import ProductCard from './productcard';
import { Product } from "../../../types/product";
import { getAllProducts } from '@/api/product';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ShimmerCard } from "@/components/common/shimmerEffect";

interface RecommendedProps {
    category?: string | { name: string } | any,
    currentSlug?: string
}

export default function RecommendedProducts({ currentSlug, category }: RecommendedProps) {
    const [recommended, setRecommended] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [api, setApi] = useState<any>();

    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                setLoading(true);
                const data = await getAllProducts();
                const allProducts = Array.isArray(data) ? data : [];

                // Filter out current product and only published products
                let filtered = allProducts.filter((p: Product) => 
                    p.slug !== currentSlug && p.isPublished
                );

                // Get category name properly
                const categoryName = typeof category === 'string' 
                    ? category 
                    : (category as any)?.name || category;

                let sameCategoryProducts: Product[] = [];
                let otherProducts: Product[] = [];

                if (categoryName) {
                    // Separate products by category
                    filtered.forEach((p: Product) => {
                        const productCategory = typeof p.category === 'string' 
                            ? p.category 
                            : (p.category as any)?.name;
                        
                        if (typeof productCategory === 'string' && typeof categoryName === 'string') {
                            if (productCategory.toLowerCase() === categoryName.toLowerCase()) {
                                sameCategoryProducts.push(p);
                            } else {
                                otherProducts.push(p);
                            }
                        } else if (productCategory === categoryName) {
                            sameCategoryProducts.push(p);
                        } else {
                            otherProducts.push(p);
                        }
                    });
                } else {
                    otherProducts = filtered;
                }

                // Sort other products by views for fallback
                otherProducts.sort((a: Product, b: Product) => {
                    const viewsA = (a as any).views || (a as any).viewCount || 0;
                    const viewsB = (b as any).views || (b as any).viewCount || 0;
                    return viewsB - viewsA;
                });

                // Combine: prioritize same category, then popular products
                const recommendedProducts = [
                    ...sameCategoryProducts.slice(0, 6),
                    ...otherProducts.slice(0, Math.max(0, 8 - sameCategoryProducts.length))
                ].slice(0, 8);

                setRecommended(recommendedProducts);
            } catch (err) {
                console.error("Failed to fetch recommended products", err);
                setRecommended([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedProducts();
    }, [category, currentSlug]);

    if (loading) {
        return (
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Recommended Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ShimmerCard key={index} className="h-64 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!recommended.length) {
        return null;
    }

    // Get category name for display
    const categoryName = typeof category === 'string' 
        ? category 
        : (category as any)?.name || category;

    const sectionTitle = categoryName 
        ? `More in ${categoryName}` 
        : "Recommended Products";

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

            {/* Desktop/Tablet Carousel */}
            <div className="hidden sm:block">
                <Carousel
                    setApi={setApi}
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
                        Found {recommended.filter(p => {
                            const productCategory = typeof p.category === 'string' 
                                ? p.category 
                                : (p.category as any)?.name;
                            return productCategory?.toLowerCase() === categoryName.toLowerCase();
                        }).length} products in <span className="font-semibold text-gray-900">{categoryName}</span> category
                    </p>
                </div>
            )}
        </div>
    );
}
