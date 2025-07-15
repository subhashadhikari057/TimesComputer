import { Product } from "../../types/product";

const productImages = [
  "/products/Frame 68.png",
  "/products/Frame 134.png",
  "/products/Frame 135.png",
  "/products/Frame 136.png"
];

export async function getProductsByCategory(
  category: string,
  sort: string = "featured",
  page: number = 1,
  limit: number = 15
): Promise<Product[]> {
  // Simulated full product list with enhanced data
  const allProducts = Array.from({ length: 30 }).map((_, i) => {
    const basePrice = 100 + (i % 10) * 15;
    const hasDiscount = i % 4 === 0; // Every 4th product has a discount
    const discountPercent = hasDiscount ? 0.1 + (i % 3) * 0.05 : 0; // 10-20% discount
    const price = hasDiscount ? Math.round(basePrice * (1 - discountPercent)) : basePrice;
    
    return {
      id: i + 1,
      title: `${category} Product ${i + 1}`,
      price: price.toString(),  // You can keep as string if you want
      currency: 'Rs',
      image: productImages[i % productImages.length], // Cycle through available product images
      rating: 3 + (i % 3), // Rating between 3-5
      reviews: 10 + (i % 50), // Review count between 10-59
      category: category,   // use passed category param here
      tag: hasDiscount ? 'Sale' : undefined
    };
  });

  // Sort logic
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
      // Sort by rating then reviews
      sortedProducts.sort((a, b) => {
        if (a.rating !== b.rating) {
          return b.rating - a.rating; 
        }
        return b.reviews - a.reviews;
      });
      break;
  }

  // Pagination
  const start = (page - 1) * limit;
  const paginated = sortedProducts.slice(start, start + limit);

  return paginated;
}
