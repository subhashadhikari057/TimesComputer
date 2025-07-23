// types/filters.ts
export interface Filters {
    priceRange?: [number, number];
    category?: string[];
    brand?: string[];
    [key: string]: string[] | [number, number] | undefined;
  }