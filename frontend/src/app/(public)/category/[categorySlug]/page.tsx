import { getProductsByCategory } from '@/lib/category';
import SortSelect from '@/components/sortselect';
import ProductCard from '@/components/products/productcard';

interface CategoryPageProps {
  params: { categorySlug: string };
  searchParams: { sort?: string; page?: string };
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Await the params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const category = resolvedParams.categorySlug;
  const sort = resolvedSearchParams.sort || 'featured';
  const page = parseInt(resolvedSearchParams.page || '1');

  const products = await getProductsByCategory(category, sort, page);
  const categoryName = capitalize(category.replace(/-/g, ' '));

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
            <h1 className="text-2xl font-bold pl-4">{categoryName}</h1>
            <SortSelect />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  currency: product.currency,
                  image: product.image,
                  rating: product.rating,
                  reviews: product.reviews,
                  tag: product.tag,
                  category: product.category,
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
