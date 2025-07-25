export interface MarketingTag {
  id: number;
  name: string;
}

export interface FeatureTag {
  id: number;
  name: string;
}

export interface Color {
  productId: number;
  colorId: number;
  color: {
    id: number;
    name: string;
    hexCode: string;
  };
}

export interface Product {
  category?: string | { name: string };
  tag?: string;
  tags?: string[];
  id?: number;
  images?: string[];
  rating?: number;
  reviews?: number;
  title?: string;
  price?: number;
  currency?: string;
  brand?: string | { name: string };
  name?: string;
  slug?: string;
  stock?: number;
  description?: string;
  isPublished?: boolean;
  brochure?: string;
  specs?: { [key: string]: string };
  views?: number;
  featureTags?: Array<{ tag: FeatureTag }>;
  marketingTags?: Array<{ tag: MarketingTag }>;
  colors?: Color[];
  popular?: boolean;
}

