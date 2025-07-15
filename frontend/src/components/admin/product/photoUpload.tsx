"use client";

import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface PhotoUploadProps {
  images: File[];
  imagePreviews: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
  maxSizeText?: string;
  acceptedFormats?: string;
  uploadText?: string;
  className?: string;
}

export default function PhotoUpload({
  images,
  imagePreviews,
  onImageUpload,
  onRemoveImage,
  maxImages = 10,
  maxSizeText = "up to 10MB each",
  acceptedFormats = "PNG, JPG, GIF",
  uploadText = "Click to upload images",
  className = "",
}: PhotoUploadProps) {
  const inputId = `photo-upload-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-700">
            {uploadText}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {acceptedFormats} {maxSizeText}
          </span>
        </label>
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      <div className="text-xs text-gray-500 text-center">
        {images.length} of {maxImages} {images.length === 1 ? 'image' : 'images'} uploaded
      </div>
    </div>
  );
}