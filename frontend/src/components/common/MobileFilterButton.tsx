'use client';

import { SlidersHorizontal } from 'lucide-react';

interface MobileFilterButtonProps {
  activeFiltersCount: number;
  onClick: () => void;
}

export default function MobileFilterButton({ activeFiltersCount, onClick }: MobileFilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed bottom-4 left-4 z-50 bg-black text-white rounded-full px-6 py-3 shadow-lg flex items-center space-x-2"
    >
      <SlidersHorizontal className="w-5 h-5" />
      <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
    </button>
  );
} 