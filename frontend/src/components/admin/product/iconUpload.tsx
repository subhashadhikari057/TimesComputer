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
  label?: string;
  required?: boolean;
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
  label,
  required = false,
}: IconUploadProps) {
  const hasImages = imagePreviews.length > 0;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const invalidFiles = files.filter(file => file.type !== 'image/svg+xml');
    if (invalidFiles.length > 0) {
      toast.error('Only SVG files are allowed');
      e.target.value = '';
      return;
    }
    
    onImageUpload(e);
  };

  const inputId = `icon-upload-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {hasImages ? (
        <ImagePreview 
          src={imagePreviews[0]} 
          onRemove={() => onRemoveImage(0)} 
        />
      ) : (
        <UploadArea
          inputId={inputId}
          onFileChange={handleFileChange}
          uploadText={uploadText}
          acceptedFormats={acceptedFormats}
          maxSizeText={maxSizeText}
          required={required}
        />
      )}

      <UploadCounter 
        current={images.length} 
        max={maxImages} 
      />
    </div>
  );
}

function ImagePreview({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="relative group">
      <div className="w-full h-20 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={src}
          alt="Icon Preview"
          className="max-w-full max-h-full object-cover"
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
        aria-label="Remove icon"
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
  required = false,
}: {
  inputId: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadText: string;
  acceptedFormats: string;
  maxSizeText: string;
  required?: boolean;
}) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
      <input
        type="file"
        required={required}
        accept=".svg,image/svg+xml"
        onChange={onFileChange}
        className="hidden"
        id={inputId}
      />
      <label
        htmlFor={inputId}
        className="cursor-pointer flex flex-col items-center justify-center"
      >
        <Upload className="w-8 h-8 text-gray-400 mb-2" />
        <span className="text-xs font-medium text-gray-700">
          {uploadText}
        </span>
        <span className="text-xs text-gray-500 mt-1">
          {acceptedFormats} {maxSizeText}
        </span>
      </label>
    </div>
  );
}

function UploadCounter({ current, max }: { current: number; max: number }) {
  const label = current === 1 ? 'Icon' : 'Icons';
  
  return (
    <div className="text-xs text-gray-500 text-center mt-4">
      {current} of {max} {label} uploaded
    </div>
  );
}