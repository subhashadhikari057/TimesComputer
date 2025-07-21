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
  required?: boolean;
  label?: string;
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
  required = false,
  label,
}: PhotoUploadProps) {
  const isMaxReached = images.length >= maxImages;
  const hasImages = imagePreviews.length > 0;
  const isSingleMode = maxImages === 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maxImages > 1) {
      const files = Array.from(e.target.files || []);
      if (images.length + files.length > maxImages) {
        toast.error(`You can only upload up to ${maxImages} images`);
        e.target.value = "";
        return;
      }
    }
    onImageUpload(e);
  };

  const inputId = `photo-upload-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Single image mode - show either preview or upload */}
      {isSingleMode && (
        <>
          {hasImages ? (
            <ImagePreview
              src={imagePreviews[0]}
              alt="Photo Preview"
              onRemove={() => onRemoveImage(0)}
              size="h-32"
            />
          ) : (
            <UploadArea
              inputId={inputId}
              onFileChange={handleFileChange}
              uploadText={uploadText}
              acceptedFormats={acceptedFormats}
              maxSizeText={maxSizeText}
              isDisabled={false}
              multiple={false}
              required={required}
            />
          )}
        </>
      )}

      {/* Multiple image mode - always show upload area */}
      {!isSingleMode && (
        <>
          <UploadArea
            inputId={inputId}
            onFileChange={handleFileChange}
            uploadText={
              isMaxReached ? `Maximum ${maxImages} images uploaded` : uploadText
            }
            acceptedFormats={acceptedFormats}
            maxSizeText={maxSizeText}
            isDisabled={isMaxReached}
            multiple={true}
            required={required}
          />

          {hasImages && (
            <ImageGrid previews={imagePreviews} onRemoveImage={onRemoveImage} />
          )}
        </>
      )}

      <ImageCounter current={imagePreviews.length} max={maxImages} />
    </div>
  );
}

function ImagePreview({
  src,
  alt,
  onRemove,
  size = "aspect-square",
}: {
  src: string;
  alt: string;
  onRemove: () => void;
  size?: string;
}) {
  return (
    <div className="relative group">
      <div
        className={`w-full ${size} bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden hover:border-gray-300 transition-colors`}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
        aria-label="Remove image"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

function UploadArea({
  inputId,
  onFileChange,
  uploadText,
  acceptedFormats,
  maxSizeText,
  isDisabled,
  multiple,
  required = false,
}: {
  inputId: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadText: string;
  acceptedFormats: string;
  maxSizeText: string;
  isDisabled: boolean;
  multiple: boolean;
  required?: boolean;
}) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
        isDisabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
          : "border-gray-300 hover:border-gray-400 cursor-pointer"
      }`}
    >
      <input
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        id={inputId}
        disabled={isDisabled}
        required={required}
      />
      <label
        htmlFor={inputId}
        className={`flex flex-col items-center justify-center ${
          isDisabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <Upload
          className={`w-8 h-8 mb-2 ${
            isDisabled ? "text-gray-300" : "text-gray-400"
          }`}
        />
        <span
          className={`text-xs font-medium ${
            isDisabled ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {uploadText}
        </span>
        <span
          className={`text-xs mt-1 ${
            isDisabled ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {acceptedFormats} {maxSizeText}
        </span>
      </label>
    </div>
  );
}

function ImageGrid({
  previews,
  onRemoveImage,
}: {
  previews: string[];
  onRemoveImage: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {previews.map((preview, index) => (
        <ImagePreview
          key={index}
          src={preview}
          alt={`Preview ${index + 1}`}
          onRemove={() => onRemoveImage(index)}
        />
      ))}
    </div>
  );
}

function ImageCounter({ current, max }: { current: number; max: number }) {
  const label = current === 1 ? "image" : "images";

  return (
    <div className="text-xs text-gray-500 text-center">
      {current} of {max} {label} uploaded
    </div>
  );
}
