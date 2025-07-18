import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface DropdownProps {
    options: { label: string; value: string }[];
    placeholder: string;
    value?: string;
    onChange: (value: string | undefined) => void;
    /**
     * If true, selecting the currently selected option again will clear the selection (pass undefined to onChange).
     */
    allowDeselect?: boolean;
}

import React from 'react'

export default function Dropdown({
    options,
    placeholder,
    value,
    onChange,
    allowDeselect = false,
}: DropdownProps) {
  // Find the selected option to display its label
  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <Select
      value={value || ""}
      onValueChange={(val) => {
        if (val === "__clear") {
          onChange(undefined);
          return;
        }
        onChange(val as string);
      }}
    >
    <SelectTrigger className="w-[180px] bg-background !text-primary font-semibold uppercase">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="bg-background text-primary font-medium">
      <SelectGroup>
        {allowDeselect && (
          <SelectItem value="__clear">Clear Selection</SelectItem>
        )}
        {options.map((opt)=>(
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
  )
}
