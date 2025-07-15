import { getProductsByBrand } from '@/lib/product';
import SortSelect from '@/components/sortselect';
import ProductCard from '@/components/products/productcard';

const sortOptions = [
  { id: 1, label: "Price (Low-High)", value: "price-low-high" },
  { id: 2, label: "Price (High-Low)", value: "price-high-low" },
  { id: 3, label: "Name (A-Z)", value: "product-name-a-z" },
  { id: 4, label: "Name (Z-A)", value: "product-name-z-a" },
  { id: 5, label: "Featured", value: "featured" }
];

interface BrandPageProps {
  params: { brandSlug: string };
  searchParams: { sort?: string; page?: string };
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  // Await the dynamic parameters
  const [brandSlug, sortParam, pageParam] = await Promise.all([
    params.brandSlug,
    searchParams.sort,
    searchParams.page
  ]);

  const brand = brandSlug;
  const sort = sortParam || 'Sort by';
  const page = parseInt(pageParam || '1');

  const products = await getProductsByBrand(brand, sort, page);
  const brandName = capitalize(brand);
  
  // Get only first 6 products for mobile view
  const mobileProducts = products.slice(0, 9);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar placeholder */}
        <aside className="w-full md:w-1/4 border rounded-lg p-4"> 
          <h2 className="text-lg font-semibold mb-2">Filters</h2>
          <p className="text-sm text-gray-500">Coming soon...</p>
        </aside>

        {/* Main content */}
        <main className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold pl-5 capitalize">{brandName}</h1>
            <SortSelect sort={sort} />
          </div>

          {/* Mobile view - 2x3 grid (6 products) */}
          <div className="md:hidden grid grid-cols-3 gap-3">
            {mobileProducts.map((product) => (
              <div key={product.id} className="aspect-square">
                <ProductCard
                  product={{
                    id: product.id,
                    title: product.title,
                    price: product.price.toString(),
                    currency: 'Rs',
                    image: product.image,
                    rating: product.rating ?? 4,
                    reviews: product.reviews ?? 0,
                    tag: product.tag ?? '',
                    category: product.category ?? '',
                  }}
                  compact={true} // Add this prop to your ProductCard for mobile
                />
              </div>
            ))}
          </div>

          {/* Desktop view - normal grid */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price.toString(),
                  currency: 'Rs',
                  image: product.image,
                  rating: product.rating ?? 4,
                  reviews: product.reviews ?? 0,
                  tag: product.tag ?? '',
                  category: product.category ?? '',
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            <a
              href={`?sort=${sort}&page=${Math.max(page - 1, 1)}`}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Prev
            </a>
            <span className="px-4 py-2 border rounded bg-black text-white">
              {page}
            </span>
            <a
              href={`?sort=${sort}&page=${page + 1}`}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Next
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}