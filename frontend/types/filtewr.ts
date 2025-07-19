// types/filters.ts
export interface Filters {
    priceRange?: [number, number];
    categories?: string[];
    brands?: string[];
    [key: string]: string[] | [number, number] | undefined;
  }