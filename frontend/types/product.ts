export interface Product {
    category?: string;
    tag?: string;
    tags?: string[];
    id?: number;
    images?: string[];
    rating?: number;
    reviews?: number;
    title?: string;
    price?: number;
    currency?: string;
    brand?: string;
    name?: string;
    slug?: string;
    stock?: number;
    description?: string;
    isPublished?: boolean;
    brochure?: string;
    specs?: { [key: string]: string };
    views?: number;
    featureTags?: string[];
    marketingTags?: string[];
    colors?: Color[];
    popular?: boolean;
}

type Color =
    {
        productId: number, colorId: number, color: {
            id: number,
            name: string,
            hexCode: string,
        }

    }



// types/product.ts
export interface Product {
    category?: string;
    tags?: string[];
    description?: string;
    rating?: number;
    image?: string;
    // Add other product properties as needed
}

