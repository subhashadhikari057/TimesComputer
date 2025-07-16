import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface DropdownProps {
    options : {label:string , value:string}[]
    placeholder:string
    value?:string
    onChange:(value:string) => void
}

import React from 'react'

export default function dropdown({
    options,
    placeholder,
    value,
    onChange
}: DropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-[180px] bg-background !text-primary font-semibold uppercase">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="bg-background text-primary font-medium">
      <SelectGroup>
        {options.map((opt)=>(
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
  )
}
