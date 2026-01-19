import React, { useRef, useState } from "react";
import { FiUpload, FiX, FiImage, FiFile } from "react-icons/fi";

interface UploadImageProps {
  label?: string;
  value: string | null;
  onChange: (imageUrl: string | null) => void;
  className?: string;
  required?: boolean;
}

const UploadImage: React.FC<UploadImageProps> = ({
  label,
  value,
  onChange,
  className = "",
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName("");
    setFileSize("");
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg transition-all ${
          isDragging
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-red-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          required={required && !preview}
        />

        {preview ? (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0">
                <FiFile size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500">{fileSize}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={handleClick}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition"
                title="Change image"
              >
                <FiUpload size={16} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition"
                title="Remove image"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-gray-50"
          >
            <FiImage className="w-8 h-8 text-gray-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadImage;
