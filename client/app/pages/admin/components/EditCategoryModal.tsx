import React, { useState, useEffect } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";
import type { MenuCategory } from "./types";
import { Button, TextInput, ImageInput } from "~/components";

interface EditCategoryModalProps {
  isOpen: boolean;
  editingCategory: MenuCategory | null;
  setEditingCategory: (category: MenuCategory) => void;
  onClose: () => void;
  onUpdate: (e: React.FormEvent) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  editingCategory,
  setEditingCategory,
  onClose,
  onUpdate,
}) => {
  const [errors, setErrors] = useState<{
    name?: string;
    image?: string;
  }>({});

  // Reset errors when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen || !editingCategory) return null;

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!editingCategory.name.trim()) {
      newErrors.name = "Category name is required";
    }
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onUpdate(e);
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Edit Category</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={validateAndSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <TextInput
              type="text"
              placeholder="e.g. Main Course"
              value={editingCategory.name}
              onChange={(e) => {
                setEditingCategory({
                  ...editingCategory,
                  name: e.target.value,
                });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
            />
            {errors.name && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <FiAlertCircle size={14} />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          <div>
            <ImageInput
              label="Category Image"
              value={editingCategory.image || null}
              onChange={(imageUrl) => {
                setEditingCategory({
                  ...editingCategory,
                  image: imageUrl || "",
                });
                if (errors.image) setErrors({ ...errors, image: undefined });
              }}
            />
            {errors.image && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <FiAlertCircle size={14} />
                <span>{errors.image}</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
