import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface PriceFilterSliderProps {
  min: number
  max: number
  currency?: string
  initialMin: number
  initialMax: number
  onPriceChange: (min: number, max: number) => void
  onApply: () => void
}

export function PriceFilterSlider({
  min: minLimit,
  max: maxLimit,
  currency = "NPR",
  initialMin,
  initialMax,
  onPriceChange,
  onApply,
}: PriceFilterSliderProps) {
  const [values, setValues] = useState([initialMin, initialMax])
  const [minInput, setMinInput] = useState(initialMin.toString())
  const [maxInput, setMaxInput] = useState(initialMax.toString())

  // Format number to currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN').format(value)
  }

  // Handle slider change
  const handleSliderChange = (newValues: number[]) => {
    setValues(newValues)
    setMinInput(formatCurrency(newValues[0]))
    setMaxInput(formatCurrency(newValues[1]))
    onPriceChange(newValues[0], newValues[1])
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    const numValue = parseInt(value || '0')
    
    if (type === 'min') {
      setMinInput(value)
      if (numValue >= minLimit && numValue <= values[1]) {
        setValues([numValue, values[1]])
      }
    } else {
      setMaxInput(value)
      if (numValue <= maxLimit && numValue >= values[0]) {
        setValues([values[0], numValue])
      }
    }
  }

  // Handle input blur to validate and format
  const handleInputBlur = (type: 'min' | 'max') => {
    if (type === 'min') {
      const numValue = Math.max(minLimit, Math.min(parseInt(minInput) || minLimit, values[1]))
      setMinInput(formatCurrency(numValue))
      setValues([numValue, values[1]])
    } else {
      const numValue = Math.min(maxLimit, Math.max(parseInt(maxInput) || maxLimit, values[0]))
      setMaxInput(formatCurrency(numValue))
      setValues([values[0], numValue])
    }
  }

  return (
    <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg border border-gray-200">
      <div className="space-y-4">
        {/* Input Fields */}
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1">
            <Label htmlFor="min-price" className="text-xs text-gray-500">
              Min price
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {currency}
              </span>
              <Input
                id="min-price"
                value={minInput}
                onChange={(e) => handleInputChange(e, 'min')}
                onBlur={() => handleInputBlur('min')}
                className="pl-10"
              />
            </div>
          </div>
          
          <span className="text-gray-500 font-medium pt-5">to</span>
          
          <div className="flex-1 space-y-1">
            <Label htmlFor="max-price" className="text-xs text-gray-500">
              Max price
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {currency}
              </span>
              <Input
                id="max-price"
                value={maxInput}
                onChange={(e) => handleInputChange(e, 'max')}
                onBlur={() => handleInputBlur('max')}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        {/* Slider */}
        <div className="space-y-2">
          <Slider
            min={minLimit}
            max={maxLimit}
            value={values}
            onValueChange={handleSliderChange}
            minStepsBetweenThumbs={200}
            step={100}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatCurrency(minLimit)}</span>
            <span>{formatCurrency(maxLimit)}</span>
          </div>
        </div>
        
        {/* Apply Button */}
        <Button
          onClick={onApply}
          className="w-full"
        >
          Apply
        </Button>
      </div>
    </div>
  )
}