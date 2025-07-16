import { use } from 'react';
// import { getAllProducts } from '@/lib/getproducts';
// import SortSelect from '@/components/sortselect';
// import ProductCard from '@/components/products/productcard';
// import FilterSidebar from '@/components/sidebar/sidebar';
import ProductsClientPage from './products-client';

interface AllProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}


export default function AllProductsPage({ searchParams }: AllProductsPageProps) {
  // Properly unwrap searchParams
  const unwrappedParams = use(Promise.resolve(searchParams));
  
  // Safely handle searchParams
  const sort = typeof unwrappedParams.sort === 'string' ? unwrappedParams.sort : undefined;
  const pageParam = typeof unwrappedParams.page === 'string' ? unwrappedParams.page : '1';
  const page = parseInt(pageParam, 10);

  // Pass the unwrapped params to the client component
  return <ProductsClientPage initialSort={sort} initialPage={page} searchParams={unwrappedParams} />;
}
 