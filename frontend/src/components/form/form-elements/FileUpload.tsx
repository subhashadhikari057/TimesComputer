import React from "react";
import { Upload, X, Image } from "lucide-react";

interface FileUploadProps {
  label: string;
  files: File[];
  previews: string[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  helpText?: string;
  maxFiles?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  files,
  previews,
  onFileChange,
  onRemoveFile,
  accept = "image/*",
  multiple = true,
  className = "",
  helpText,
  maxFiles = 10,
}) => {
  const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          id={inputId}
          multiple={multiple}
          accept={accept}
          onChange={onFileChange}
          className="hidden"
          disabled={files.length >= maxFiles}
        />

        <label
          htmlFor={inputId}
          className={`cursor-pointer ${
            files.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {files.length >= maxFiles
                  ? "Maximum files reached"
                  : "Click to upload files"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP up to 10MB each
              </p>
            </div>
          </div>
        </label>
      </div>

      {helpText && <p className="mt-2 text-sm text-gray-500">{helpText}</p>}

      {/* File Preview Grid */}
      {previews.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images ({files.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* File Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="truncate">{files[index]?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <div className="mt-4 text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No images uploaded yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Upload your first image to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
