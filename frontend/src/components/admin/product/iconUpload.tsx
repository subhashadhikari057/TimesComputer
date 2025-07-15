"use client";

import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface IconUploadProps {
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

export default function IconUpload({
  images,
  imagePreviews,
  onImageUpload,
  onRemoveImage,
  maxImages = 1,
  maxSizeText = "up to 1MB each",
  acceptedFormats = "SVG",
  uploadText = "Click to upload Icon",
  className = "",
}: IconUploadProps) {
  const inputId = `icon-upload-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={className}>
      {imagePreviews.length > 0 ? (
        /* Image Preview - Show only when image is uploaded */
        <div className="relative group">
          <div className="w-full h-20 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src={imagePreviews[0]}
              alt="Icon Preview"
              className="max-w-full max-h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemoveImage(0)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        /* Upload Area - Show only when no image is uploaded */
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept=".svg,image/svg+xml"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              
              // Check if any file is not SVG
              const invalidFiles = files.filter(file => file.type !== 'image/svg+xml');
              if (invalidFiles.length > 0) {
                toast.error('Only SVG files are allowed');
                e.target.value = ''; // Clear the input
                return;
              }
              
              onImageUpload(e);
            }}
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
      )}

      {/* Image Count */}
      <div className="text-xs text-gray-500 text-center mt-2">
        {images.length} of {maxImages} {images.length === 1 ? 'Icon' : 'Icons'} uploaded
      </div>
    </div>
  );
}