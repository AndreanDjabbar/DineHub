import React from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";
import type { Table } from "./types";
import { Button } from "~/components";

interface EditTableModalProps {
  isOpen: boolean;
  editingTable: Table | null;
  setEditingTable: (table: Table) => void;
  onClose: () => void;
  onUpdate: (e: React.FormEvent) => void;
  updateTableErrors?: {
    capacity?: string;
  };
  setUpdateTableErrors?: (errors: { capacity?: string }) => void;
}

const EditTableModal: React.FC<EditTableModalProps> = ({
  isOpen,
  editingTable,
  setEditingTable,
  onClose,
  onUpdate,
  updateTableErrors,
  setUpdateTableErrors,
}) => {
  if (!isOpen || !editingTable) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Edit Table</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onUpdate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <span>{editingTable.name}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={editingTable.capacity}
              onChange={(e) =>
                setEditingTable({
                  ...editingTable,
                  capacity: parseInt(e.target.value),
                })
              }
            />
            {updateTableErrors?.capacity && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <FiAlertCircle size={14} />
                <span>{updateTableErrors.capacity}</span>
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

export default EditTableModal;
