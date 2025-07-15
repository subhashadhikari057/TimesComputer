import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DropdownProps {
  options: {label: string, value: string}[]
  placeholder: string
  value?: string
  onChange: (value: string | undefined) => void
  allowDeselect?: boolean
}

export default function Dropdown({
  options,
  placeholder,
  value,
  onChange,
  allowDeselect = true
}: DropdownProps) {
  const handleValueChange = (val: string) => {
    // Special handling for clear selection
    if (val === "__CLEAR__") {
      onChange(undefined)
      return
    }
    
    // Toggle selection if clicking the same item
    if (allowDeselect && val === value) {
      onChange(undefined)
    } else {
      onChange(val)
    }
  }

  // Find the selected option label
  const selectedOption = options.find(opt => opt.value === value)
  const displayValue = selectedOption ? selectedOption.label : placeholder

  return (
    <Select 
      value={value} 
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[180px] bg-background !text-primary font-semibold uppercase">
        <SelectValue placeholder={placeholder}>
          {displayValue}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" className="bg-background text-primary font-medium">
        <SelectGroup>
          {/* Always show the placeholder at the top */}
          <SelectItem 
            value="__PLACEHOLDER__" 
            className="text-muted-foreground italic font-medium"
            disabled
          >
            {placeholder}
          </SelectItem>
          
          {allowDeselect && value && (
            <SelectItem 
              value="__CLEAR__" 
              className="text-muted-foreground italic"
            >
              Clear selection
            </SelectItem>
          )}
          
          {options.map((opt) => (
            <SelectItem 
              key={opt.value} 
              value={opt.value}
              className={value === opt.value ? "bg-accent" : ""}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}