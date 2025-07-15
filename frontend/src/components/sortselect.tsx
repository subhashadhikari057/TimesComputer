'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Dropdown from './home/dropdown'

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price (Low-High)", value: "price-low-high" },
  { label: "Price (High-Low)", value: "price-high-low" },
  { label: "Product Name (A-Z)", value: "product-name-a-z" },
  { label: "Product Name (Z-A)", value: "product-name-z-a" }
]

interface SortSelectProps {
  sort?: string;
}

export default function SortSelect({ sort: initialSort }: SortSelectProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const sort = searchParams.get('sort') || initialSort || 'featured' // Always default to featured

  const handleSortChange = (value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Always ensure a sort value is set, defaulting to featured
    params.set('sort', value || 'featured')
    params.set('page', '1') // Reset to first page when changing sort
    
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Dropdown
      options={sortOptions}
      placeholder="Sort by"
      value={sort}
      onChange={handleSortChange}
      allowDeselect={false} // Prevent deselection
    />
  )
}