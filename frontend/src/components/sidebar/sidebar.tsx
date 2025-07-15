'use client';

import React from 'react';
import PriceFilter from './priceFilter';

import { MdOutlineArrowDropDown } from "react-icons/md";

import { useState } from 'react';
const FilterSidebar: React.FC = () => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

const toggleSection = (label: string) => {
  setOpenSections((prev) => ({
    ...prev,
    [label]: !prev[label],
  }));
};

  return (
    <aside >
      <h2 className="text-xl font-semibold text-muted-forground my-2 mx-5">Filters</h2>
      <div className="w-full mx-4 max-w-xs p-4 border border-border rounded-xl">

         
      <PriceFilter/>

      {/* Filter Section Component */}
      {[
        {
          label: 'Type',
          options: ['Gaming', 'Notebook', 'Ultrabook', '2-in-1 Convertible', 'Standard'],
        },
        {
          label: 'Processor Brand',
          options: ['AMD', 'Intel'],
        },
        {
          label: 'CPU Generation',
          options: [
            '10th Gen',
            '11th Gen',
            '12th Gen',
            '13th Gen',
            'Ryzen 5000 series',
            'Ryzen 7000 series',
            '14th Gen',
            'Ryzen 8000 series',
          ],
        },
        {
          label: 'Processor Type',
          options: ['Ryzen 5', 'Ryzen 7', 'i5', 'i7'],
        },
         {
          label: 'Display',
          options: ['LCD', 'OLED', 'IPS Panel'],
        },
         {
          label: 'RAM',
          options: ['8GB', '16GB', '32GB'],
        },
         {
          label: 'SSD',
          options: ['256GB', '512GB', '1TB'],
        },
         {
          label: 'Graphics',
          options: ['Ryzen 5', 'Ryzen 7', 'i5', 'i7'],
        },
         {
          label: 'OS',
          options: ['Window 10 Home', 'Window 11 Pro', 'Window 11 Home'],
        },
         {
          label: 'Special Feature ',
          options: ['TouchScreen Display', 'Fingerprint Scanner'],
        },
         {
          label: 'Laptop Screen Size',
          options: ['13.3"', '14"', '15.6"', '16"'],
        },
         {
          label: 'Waranty',
          options: ['1 Year', '2 Year', '3 Year'],
        },
      ].map(({ label, options }) => (
  <div className="mb-6" key={label}>
    <h3
      className="text-lg mb-2 flex justify-between font-semibold items-center cursor-pointer"
      onClick={() => toggleSection(label)}
    >
      {label}
      <span className={`transition-transform ${openSections[label] ? 'rotate-180' : ''}`}>
        <MdOutlineArrowDropDown size={30}/>
      </span>
    </h3>

    {openSections[label] && (
      <div className="space-y-2">
        {options.map((option) => (
          <label className="flex items-center space-x-2 text-gray-700 text-sm" key={option}>
            <input type="radio"  name={label} className="form-checkbox" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    )}
  </div>
))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
