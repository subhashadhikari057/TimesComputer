import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image";
interface DropdownOption {
  label: string;
  value: string;
  icon?: string; // Optional icon (image URL only)
}

interface DropdownProps {
  options: DropdownOption[];
  placeholder: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  /**
   * If true, selecting the currently selected option again will clear the selection (pass undefined to onChange).
   */
  allowDeselect?: boolean;
  enableIcon?: boolean;
}

function renderIcon(iconUrl?: string, className = "h-4 w-4 mr-2") {
  if (!iconUrl) return null;
  
  // Render as image only
  return (
    <Image 
      src={iconUrl} 
      alt="Category icon" 
      width={20}
      height={20}
      className={className}
      style={{ filter: 'brightness(0) saturate(100%) invert(20%) sepia(18%) saturate(1952%) hue-rotate(200deg) brightness(95%) contrast(95%)' }}
    />
  );
}

export default function Dropdown({
  options,
  placeholder,
  value,
  onChange,
  allowDeselect = true,
  enableIcon = false,
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
          <SelectTrigger
              className="min-w-[120px] w-auto max-w-[300px] bg-background !text-primary font-medium text-xs xs:text-xs sm:!text-sm uppercase"
              size="sm"
          >
              <SelectValue 
                  placeholder={placeholder} 
                  className="text-xs xs:text-xs sm:!text-sm truncate"
              >
                  {selectedOption && (
                      <span className="flex items-center text-xs xs:text-xs sm:!text-sm">
                          {enableIcon && renderIcon(selectedOption.icon)}
                          <span className="truncate">{selectedOption.label}</span>
                      </span>
                  )}
              </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-background text-primary font-medium !text-sm">
              <SelectGroup>
                  {allowDeselect && (
                      <SelectItem value="__clear" className="!text-sm">
                          Clear Selection
                      </SelectItem>
                  )}
                  {options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="!text-sm">
                          <span className="flex items-center">
                              {enableIcon && renderIcon(opt.icon)}
                              <span>{opt.label}</span>
                          </span>
                      </SelectItem>
                  ))}
              </SelectGroup>
          </SelectContent>
      </Select>
  )
}