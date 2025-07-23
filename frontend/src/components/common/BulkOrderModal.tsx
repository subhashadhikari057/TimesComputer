"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '../../../types/product';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSubmit: (quantity: number, selectedColor: string | null) => void;
}

export default function BulkOrderModal({ isOpen, onClose, product, onSubmit }: BulkOrderModalProps) {
  const [quantity, setQuantity] = useState<number>(10);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10000) {
      setQuantity(value);
    }
  };

  const handleSubmit = async () => {
    if (quantity < 1) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(quantity, selectedColor);
      onClose();
    } catch (error) {
      console.error('Failed to submit bulk order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Bulk Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Product Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-blue-600 font-semibold">
              Rs {product.price?.toLocaleString('en-IN') || 'N/A'} per unit
            </p>
          </div>

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quantity (minimum 1 unit)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="10000"
              />
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity >= 10000}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick quantity buttons */}
            <div className="flex gap-2 mt-3">
              {[10, 25, 50, 100].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    quantity === qty 
                      ? 'bg-blue-100 border-blue-300 text-blue-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
            
            {/* Total Price */}
            {product.price && (
              <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Estimated Total: </span>
                  Rs {(product.price * quantity).toLocaleString('en-IN')}
                </p>
              </div>
            )}
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Color (Optional)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {product.colors.map((colorItem, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(
                      selectedColor === colorItem.color.name ? null : colorItem.color.name
                    )}
                    className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                      selectedColor === colorItem.color.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: colorItem.color.hexCode }}
                    />
                    <span className="text-xs mt-1 text-center text-gray-700 truncate w-full">
                      {colorItem.color.name}
                    </span>
                  </button>
                ))}
                
                {/* No Color Preference Option */}
                <button
                  onClick={() => setSelectedColor(null)}
                  className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                    selectedColor === null
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">?</span>
                  </div>
                  <span className="text-xs mt-1 text-center text-gray-700">
                    Any Color
                  </span>
                </button>
              </div>
              
              {selectedColor && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: <span className="font-medium">{selectedColor}</span>
                </p>
              )}
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <span className="font-medium">Note:</span> You&apos;ll be redirected to WhatsApp to discuss pricing, delivery, and finalize your bulk order with our sales team.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            disabled={isSubmitting || quantity < 1}
          >
            {isSubmitting ? 'Processing...' : 'Contact via WhatsApp'}
          </Button>
        </div>
      </div>
    </div>
  );
} 