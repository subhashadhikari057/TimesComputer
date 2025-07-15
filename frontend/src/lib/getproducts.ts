import { Product } from "../../types/product";

export interface BrandConfig {
  name: string;
  categories: {
    [key: string]: {
      priceRange: { min: number; max: number };
      models: string[];
    };
  };
}

export interface FilterOptions {
  priceRange?: { min: number; max: number };
  brands?: string[];
  categories?: string[];
  processor?: string[];
  memory?: string[];
  storage?: string[];
  graphics?: string[];
  os?: string[];
  [key: string]: any;
}

export const brandsConfig: BrandConfig[] = [
  {
    name: "Apple",
    categories: {
      "macbook": {
        priceRange: { min: 150000, max: 500000 },
        models: ["MacBook Air M1", "MacBook Air M2", "MacBook Pro 13", "MacBook Pro 14", "MacBook Pro 16"]
      }
    }
  },
  {
    name: "Dell",
    categories: {
      "gaming-laptop": {
        priceRange: { min: 85000, max: 400000 },
        models: ["G15 Gaming", "Alienware m15", "Alienware x15", "G16 Gaming"]
      },
      "business-laptop": {
        priceRange: { min: 45000, max: 250000 },
        models: ["Latitude", "Precision", "Vostro", "XPS"]
      },
      "student-laptop": {
        priceRange: { min: 35000, max: 80000 },
        models: ["Inspiron 15", "Inspiron 14", "Inspiron 13"]
      }
    }
  },
  {
    name: "HP",
    categories: {
      "gaming-laptop": {
        priceRange: { min: 80000, max: 350000 },
        models: ["Victus", "Omen", "Pavilion Gaming"]
      },
      "business-laptop": {
        priceRange: { min: 42000, max: 200000 },
        models: ["EliteBook", "ProBook", "ZBook"]
      },
      "student-laptop": {
        priceRange: { min: 32000, max: 75000 },
        models: ["Pavilion", "HP 15", "HP 14"]
      }
    }
  },
  {
    name: "Asus",
    categories: {
      "gaming-laptop": {
        priceRange: { min: 75000, max: 450000 },
        models: ["ROG Strix", "TUF Gaming", "ROG Zephyrus", "ROG Flow"]
      },
      "business-laptop": {
        priceRange: { min: 40000, max: 180000 },
        models: ["ExpertBook", "ASUS Pro", "Zenbook"]
      },
      "student-laptop": {
        priceRange: { min: 30000, max: 70000 },
        models: ["VivoBook", "ASUS E410", "ASUS X515"]
      }
    }
  },
  {
    name: "Lenovo",
    categories: {
      "gaming-laptop": {
        priceRange: { min: 70000, max: 380000 },
        models: ["Legion", "IdeaPad Gaming", "Legion Slim"]
      },
      "business-laptop": {
        priceRange: { min: 45000, max: 220000 },
        models: ["ThinkPad", "ThinkBook", "Yoga"]
      },
      "student-laptop": {
        priceRange: { min: 28000, max: 65000 },
        models: ["IdeaPad", "IdeaPad Slim", "IdeaPad Flex"]
      }
    }
  },
  {
    name: "Acer",
    categories: {
      "gaming-laptop": {
        priceRange: { min: 65000, max: 300000 },
        models: ["Predator", "Nitro", "Aspire Gaming"]
      },
      "business-laptop": {
        priceRange: { min: 38000, max: 150000 },
        models: ["TravelMate", "Swift", "Spin"]
      },
      "student-laptop": {
        priceRange: { min: 25000, max: 60000 },
        models: ["Aspire", "Extensa", "Aspire 3"]
      }
    }
  }
];

export async function getAllProducts(
  sort: string = "featured",
  page: number = 1,
  limit: number = 15,
  filters: FilterOptions = {}
): Promise<Product[]> {
  // Generate products based on brand configurations
  const allProducts: Product[] = [];
  let id = 1;

  brandsConfig.forEach(brandConfig => {
    // Skip if brands filter is applied and this brand is not included
    if (filters.brands && filters.brands.length > 0 && !filters.brands.includes(brandConfig.name)) {
      return;
    }

    Object.entries(brandConfig.categories).forEach(([category, categoryConfig]) => {
      // Skip if categories filter is applied and this category is not included
      if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(category)) {
        return;
      }

      categoryConfig.models.forEach(model => {
        // Skip if processor filter is applied and model doesn't match
        if (filters.processor && filters.processor.length > 0) {
          if (!filters.processor.some(p => model.toLowerCase().includes(p.toLowerCase()))) {
            return;
          }
        }

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
          
          // Generate additional specs based on variant
          const memory = i === 0 ? "8 GB" : i === 1 ? "16 GB" : "32 GB";
          const storage = i === 0 ? "256 GB" : i === 1 ? "512 GB" : "1 TB";
          const graphics = i === 0 ? "Shared/Integrated" : i === 1 ? "4GB Dedicated" : "8GB Dedicated";

          // Skip if memory filter is applied and doesn't match
          if (filters.memory && filters.memory.length > 0 && !filters.memory.includes(memory)) {
            return;
          }

          // Skip if storage filter is applied and doesn't match
          if (filters.storage && filters.storage.length > 0 && !filters.storage.includes(storage)) {
            return;
          }

          // Skip if graphics filter is applied and doesn't match
          if (filters.graphics && filters.graphics.length > 0 && !filters.graphics.includes(graphics)) {
            return;
          }

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
  const paginatedProducts = sortedProducts.slice(start, start + limit);

  return paginatedProducts;
}
