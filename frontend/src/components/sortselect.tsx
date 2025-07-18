'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Dropdown from './form/form-elements/dropdown';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price (Low-High)', value: 'price-low-high' },
  { label: 'Price (High-Low)', value: 'price-high-low' },
  { label: 'Product Name (A-Z)', value: 'product-name-a-z' },
  { label: 'Product Name (Z-A)', value: 'product-name-z-a' },
];

interface SortSelectProps {
  sort?: string;
}

export default function SortSelect({ sort: initialSort }: SortSelectProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Determine the current sort value from the URL or initial props
  const sort = searchParams.get('sort') || initialSort || undefined;

  const handleSortChange = (value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove the sort parameter
    if (value === undefined) {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }

    // Always reset to page 1 when changing sort
    params.set('page', '1');

    // Update the route with the new parameters
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Dropdown
      options={sortOptions}
      placeholder="Sort by"
      value={sort}
      onChange={handleSortChange}
      allowDeselect={true}
    />
  );
}
