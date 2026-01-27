import React, { useRef, useState, useEffect } from "react";
import { FiUpload, FiX, FiImage, FiFile } from "react-icons/fi";

interface ImageInputProps {
  label?: string;
  value: string | null;
  onChange: (imageUrl: string | null) => void;
  className?: string;
  required?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the click on the parent
    setPreview(null);
    setFileName("");
    setFileSize("");
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    setPreview(value);
    if (!value) {
      setFileName("");
      setFileSize("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [value]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) processFile(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden
          ${isDragging ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-red-400 hover:bg-gray-50"}
          ${preview ? "border-solid border-gray-200" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          /* --- STABLE IMAGE PREVIEW --- */
          <div className="relative w-full h-full flex flex-col">
            {/* The Image Container */}
            <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">
                  Click to Change
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white border-t border-gray-100">
              <div className="bg-red-50 text-red-500 p-2 rounded-lg">
                <FiFile size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {fileName || "Uploaded Image"}
                </p>
                <p className="text-xs text-gray-400">
                  {fileSize || "Memory file"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className=" p-1.5 bg-red-500 hover:bg-red-600 hover:text-white text-white rounded-lg shadow-sm transition-colors z-10 hover:cursor-pointer"
              >
                <FiX size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center p-6 text-center">
            <div className="mb-3 p-4 bg-gray-100 rounded-full text-gray-400 group-hover:text-red-400 group-hover:bg-red-50 transition-colors">
              <FiImage size={32} />
            </div>
            <div className="space-y-1">
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

export default ImageInput;
