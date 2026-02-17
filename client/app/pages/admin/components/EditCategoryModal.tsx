import React, { useState, useEffect } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";
import type { MenuCategory } from "./types";
import { Button, TextInput, ImageInput } from "~/components";

interface EditCategoryModalProps {
  isOpen: boolean;
  editingCategory: MenuCategory | null;
  updateCategoryValidationErrors?: Record<string, string>;
  setEditingCategory: (category: MenuCategory) => void;
  onClose: () => void;
  onUpdate: (e: React.FormEvent) => void;
  isEditCategoryLoading?: boolean;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  updateCategoryValidationErrors,
  editingCategory,
  setEditingCategory,
  onClose,
  onUpdate, 
  isEditCategoryLoading,
}) => {
  if (!isOpen || !editingCategory) return null;

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onUpdate(e);
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
            <TextInput
              type="text"
              label="Category Name"
              required
              error={updateCategoryValidationErrors?.name || ""}
              placeholder="e.g. Main Course"
              value={editingCategory.name}
              onChange={(e) => {
                setEditingCategory({
                  ...editingCategory,
                  name: e.target.value,
                });
              }}
            />
          </div>

          <div>
            <ImageInput
              label="Category Image"
              error={updateCategoryValidationErrors?.image || ""}
              value={editingCategory.image || null}
              onChange={(imageUrl) => {
                setEditingCategory({
                  ...editingCategory,
                  image: imageUrl || "",
                });
              }}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
            type="submit"
            text="Save Changes"
            isLoading={isEditCategoryLoading}
            isLoadingText="Saving..."
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
