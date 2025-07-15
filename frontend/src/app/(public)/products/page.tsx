import { getAllProducts } from '@/lib/getproducts';
import SortSelect from '@/components/sortselect';
import ProductCard from '@/components/products/productcard';

interface AllProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AllProductsPage({ searchParams }: AllProductsPageProps) {
  // Safely handle searchParams
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'featured';
  const pageParam = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = parseInt(pageParam, 10);

  const products = await getAllProducts(sort, page);

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
            <h1 className="text-2xl font-bold pl-5">All Products</h1>
            <SortSelect />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price.toString(),
                  currency: product.currency || 'Rs',
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
            <span className="px-4 py-2 border rounded bg-black text-white">{page}</span>
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
