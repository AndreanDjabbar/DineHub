import React, { useState, useEffect } from "react";
import { FiX, FiTrash2, FiAlertCircle } from "react-icons/fi";
import type { MenuCategory, MenuItem, AddOn, AddOnOption } from "./types";
import { Button, TextInput, NumInput, ImageInput } from "~/components";

interface EditMenuItemModalProps {
  isOpen: boolean;
  editingMenuItem: MenuItem | null;
  setEditingMenuItem: (item: MenuItem) => void;
  onClose: () => void;
  onUpdate: (e: React.FormEvent) => void;
  categories: MenuCategory[];
}

const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
  isOpen,
  editingMenuItem,
  setEditingMenuItem,
  onClose,
  onUpdate,
  categories,
}) => {
  const [newAddOn, setNewAddOn] = useState<AddOn>({
    name: "",
    minSelect: 0,
    maxSelect: 1,
    options: [],
  });
  const [newAddOnOption, setNewAddOnOption] = useState<AddOnOption>({
    name: "",
    price: 0,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    category?: string;
    image?: string;
  }>({});

  // Reset errors when modal opens with new item
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen || !editingMenuItem) return null;

  const handleAddAddOnToItem = () => {
    if (!newAddOn.name) return;
    setEditingMenuItem({
      ...editingMenuItem,
      addOns: [...(editingMenuItem.addOns || []), { ...newAddOn }],
    });
    setNewAddOn({ name: "", minSelect: 0, maxSelect: 1, options: [] });
  };

  const handleAddOptionToAddOn = () => {
    if (!newAddOnOption.name) return;
    setNewAddOn({
      ...newAddOn,
      options: [...newAddOn.options, { ...newAddOnOption }],
    });
    setNewAddOnOption({ name: "", price: 0 });
  };

  const handleRemoveAddOn = (index: number) => {
    setEditingMenuItem({
      ...editingMenuItem,
      addOns: (editingMenuItem.addOns || []).filter((_, i) => i !== index),
    });
  };

  const handleRemoveAddOnOption = (optionIndex: number) => {
    setNewAddOn({
      ...newAddOn,
      options: newAddOn.options.filter((_, i) => i !== optionIndex),
    });
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!editingMenuItem.name.trim()) {
      newErrors.name = "Item name is required";
    }
    if (!editingMenuItem.price || editingMenuItem.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!editingMenuItem.categoryId) {
      newErrors.category = "Please select a category";
    }
    if (!editingMenuItem.image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onUpdate(e);
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-900">Edit Menu Item</h3>
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
              Item Name
            </label>
            <TextInput
              type="text"
              placeholder="e.g. Fried Rice"
              value={editingMenuItem.name}
              onChange={(e) => {
                setEditingMenuItem({
                  ...editingMenuItem,
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
            <NumInput
              label="Price"
              min="0"
              value={editingMenuItem.price}
              onChange={(e) => {
                setEditingMenuItem({
                  ...editingMenuItem,
                  price: parseInt(e.target.value),
                });
                if (errors.price) setErrors({ ...errors, price: undefined });
              }}
            />
            {errors.price && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <FiAlertCircle size={14} />
                <span>{errors.price}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white hover:cursor-pointer"
              value={editingMenuItem.categoryId}
              onChange={(e) => {
                setEditingMenuItem({
                  ...editingMenuItem,
                  categoryId: e.target.value,
                });
                if (errors.category)
                  setErrors({ ...errors, category: undefined });
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <FiAlertCircle size={14} />
                <span>{errors.category}</span>
              </div>
            )}
          </div>

          <div>
            <ImageInput
              label="Item Image"
              required
              value={editingMenuItem.image || null}
              onChange={(imageUrl) => {
                setEditingMenuItem({
                  ...editingMenuItem,
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

          {/* Add-Ons Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-bold text-sm mb-3 text-gray-800">
              Add-ons (Optional)
            </h4>

            {/* List of added add-ons */}
            {editingMenuItem.addOns && editingMenuItem.addOns.length > 0 && (
              <div className="mb-6 space-y-3">
                {editingMenuItem.addOns.map((addon, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-gray-800">
                          {addon.name}
                        </span>
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          Min: {addon.minSelect}, Max: {addon.maxSelect}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddOn(idx)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {addon.options.map((opt, optIdx) => (
                        <span
                          key={optIdx}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100"
                        >
                          {opt.name} (+{opt.price})
                        </span>
                      ))}
                      {addon.options.length === 0 && (
                        <span className="text-xs text-gray-400 italic">
                          No options added
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add new add-on form */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                New Add-on Group
              </h5>
              <div className="space-y-3">
                <TextInput
                  type="text"
                  placeholder="Group Name (e.g. Spiciness Level)"
                  value={newAddOn.name}
                  onChange={(e) =>
                    setNewAddOn({ ...newAddOn, name: e.target.value })
                  }
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <NumInput
                      label="Min Select"
                      min="0"
                      className="text-sm"
                      value={newAddOn.minSelect}
                      onChange={(e) =>
                        setNewAddOn({
                          ...newAddOn,
                          minSelect: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <NumInput
                      label="Max Select"
                      min="1"
                      className="text-sm"
                      value={newAddOn.maxSelect || ""}
                      onChange={(e) =>
                        setNewAddOn({
                          ...newAddOn,
                          maxSelect: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                {/* Add options to add-on */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Options
                  </label>

                  {newAddOn.options.length > 0 && (
                    <div className="flex flex-col gap-2 mb-3">
                      {newAddOn.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-100"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{opt.name}</span>
                            <span className="text-red-400">|</span>
                            <span>+{opt.price}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAddOnOption(idx)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <TextInput
                      type="text"
                      placeholder="Option Name (e.g. Mild)"
                      className="flex-1 min-w-[120px]"
                      value={newAddOnOption.name}
                      onChange={(e) =>
                        setNewAddOnOption({
                          ...newAddOnOption,
                          name: e.target.value,
                        })
                      }
                    />
                    <NumInput
                      placeholder="Price"
                      className="w-24"
                      min="0"
                      value={
                        newAddOnOption.price === 0 ? "" : newAddOnOption.price
                      }
                      onChange={(e) =>
                        setNewAddOnOption({
                          ...newAddOnOption,
                          price:
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value),
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddOptionToAddOn();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddOptionToAddOn}
                      className="justify-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-gray-900 transition hover:cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddAddOnToItem}
                  disabled={!newAddOn.name || newAddOn.options.length === 0}
                  className={`w-full py-2 rounded-lg text-sm font-bold transition ${
                    !newAddOn.name || newAddOn.options.length === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-100 hover:cursor-pointer text-red-600 hover:bg-red-200"
                  }`}
                >
                  Save Add-on Group
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
