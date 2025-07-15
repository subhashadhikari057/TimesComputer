"use client";

import { Upload, X } from "lucide-react";
import { toast } from "sonner";

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
      {/* Single Image Upload (maxImages = 1) */}
      {maxImages === 1 && (
        <>
          {imagePreviews.length > 0 ? (
            /* Image Preview - Show only when image is uploaded */
            <div className="relative group">
              <div className="w-full h-32 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={imagePreviews[0]}
                  alt="Photo Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveImage(0)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Upload Area - Show only when no image is uploaded */
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
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
          )}
        </>
      )}

      {/* Multiple Image Upload (maxImages > 1) */}
      {maxImages > 1 && (
        <>
          

          {/* Upload Area */}
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            images.length >= maxImages 
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-gray-400 cursor-pointer'
          }`}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (images.length + files.length > maxImages) {
                  toast.error(`You can only upload up to ${maxImages} images`);
                  e.target.value = ''; // Clear the input
                  return;
                }
                onImageUpload(e);
              }}
              className="hidden"
              id={inputId}
              disabled={images.length >= maxImages}
            />
            <label
              htmlFor={inputId}
              className={`flex flex-col items-center justify-center ${
                images.length >= maxImages 
                  ? 'cursor-not-allowed' 
                  : 'cursor-pointer'
              }`}
            >
              <Upload className={`w-8 h-8 mb-2 ${
                images.length >= maxImages 
                  ? 'text-gray-300' 
                  : 'text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                images.length >= maxImages 
                  ? 'text-gray-400' 
                  : 'text-gray-700'
              }`}>
                {images.length >= maxImages 
                  ? `Maximum ${maxImages} images uploaded` 
                  : uploadText
                }
              </span>
              <span className={`text-xs mt-1 ${
                images.length >= maxImages 
                  ? 'text-gray-300' 
                  : 'text-gray-500'
              }`}>
                {acceptedFormats} {maxSizeText}
              </span>
            </label>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Image Count */}
      <div className="text-xs text-gray-500 text-center">
        {images.length} of {maxImages} {images.length === 1 ? 'image' : 'images'} uploaded
      </div>
    </div>
  );
}