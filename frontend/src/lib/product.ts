import { Product } from "../../types/product";
import { brandsConfig, BrandConfig } from "./getproducts";

interface FilterOptions {
  priceRange?: { min: number; max: number };
  categories?: string[];
  [key: string]: any;
}

export async function getProductsByBrand(
  brand: string,
  sort: string = "featured",
  page: number = 1,
  filters: FilterOptions = {},
  limit: number = 15
): Promise<Product[]> {
  // Find the brand configuration
  const brandConfig = brandsConfig.find(b => b.name.toLowerCase() === brand.toLowerCase());
  if (!brandConfig) return [];

  // Generate products based on brand configuration
  const allProducts: Product[] = [];
  let id = 1;

  Object.entries(brandConfig.categories).forEach(([category, categoryConfig]) => {
    // Skip if categories filter is applied and this category is not included
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(category)) {
      return;
    }

    categoryConfig.models.forEach(model => {
      // Generate 2-3 variants for each model
      const variants = Math.floor(Math.random() * 2) + 2; // 2-3 variants
      
      for (let i = 0; i < variants; i++) {
        const { min, max } = categoryConfig.priceRange;
        // Generate price within the brand-category specific range
        const basePrice = Math.floor(min + Math.random() * (max - min));
        const hasDiscount = Math.random() < 0.25; // 25% chance of discount
        const discountPercent = hasDiscount ? 0.1 + Math.random() * 0.15 : 0; // 10-25% discount
        const price = hasDiscount ? Math.round(basePrice * (1 - discountPercent)) : basePrice;

        // Skip if price is outside the filtered range
        if (filters.priceRange) {
          if (price < filters.priceRange.min || price > filters.priceRange.max) {
            return;
          }
        }

        // Generate specs-based variant name
        const specs = i === 0 ? "Base" : i === 1 ? "Advanced" : "Premium";
        
        // Apply additional filters
        let passesFilters = true;
        Object.entries(filters).forEach(([key, values]) => {
          if (key !== 'priceRange' && key !== 'categories' && Array.isArray(values) && values.length > 0) {
            // Add filter logic based on the specific filter key
            switch(key) {
              case 'processor':
                if (!values.some(v => model.toLowerCase().includes(v.toLowerCase()))) {
                  passesFilters = false;
                }
                break;
              case 'memory':
              case 'storage':
              case 'graphics':
                // These would be handled if we had the actual specs
                break;
            }
          }
        });

        if (!passesFilters) return;

        allProducts.push({
          id: id++,
          title: `${brandConfig.name} ${model} ${specs}`,
          price: price.toString(),
          currency: "Rs",
          image: "/products/Frame 68.png",
          rating: Math.floor(3.5 + Math.random() * 1.5 * 10) / 10, // Rating between 3.5-5.0
          reviews: Math.floor(10 + Math.random() * 90), // Reviews between 10-99
          category: category,
          brand: brandConfig.name,
          tag: hasDiscount ? "Sale" : undefined,
        });
      }
    });
  });

  // Sorting logic
  let sortedProducts = [...allProducts];
  switch (sort) {
    case "price-low-high":
      sortedProducts.sort((a, b) => parseInt(a.price) - parseInt(b.price));
      break;
    case "price-high-low":
      sortedProducts.sort((a, b) => parseInt(b.price) - parseInt(a.price));
      break;
    case "product-name-a-z":
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "product-name-z-a":
      sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "featured":
    default:
      sortedProducts.sort((a, b) => {
        if (a.rating !== b.rating) {
          return b.rating - a.rating; // Higher rating first
        }
        return b.reviews - a.reviews; // More reviews first
      });
      break;
  }

  // Pagination logic
  const start = (page - 1) * limit;
  const paginated = sortedProducts.slice(start, start + limit);

  return paginated;
}