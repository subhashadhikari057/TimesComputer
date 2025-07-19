export interface Product {
    category?: string,
    tag?: string ,
    id?: number,
    images?: string[],
    rating?: number,
    reviews?: number,
    title?: string,
    price?: number,
    currency?: string,
    brand?: string,
    name?:string,
    slug?:string,
    stock?:number,
    description?:string,
    isPublished?:boolean,
    brochure?:string,
    specs?: { [key: string]: string },
    views?:number,
    featureTags?:string[],
    marketingTags?:string[],
    colors?:string[],
    popular?:boolean
};

// types/product.ts
export interface Product {
    category?: string;
    tags?: string[];
    description?: string;
    rating?: number;
    image?: string;
    // Add other product properties as needed
  }

  