import React from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";
import type { User } from "./types";
import { TextInput } from "~/components";

interface EditUserModalProps {
  isOpen: boolean;
  editingUser: User | null;
  setEditingUser: (user: User) => void;
  onClose: () => void;
  onUpdate: (e: React.FormEvent) => void;
  updateUserErrors?: {
    name?: string;
    email?: string;
  };
  setUpdateUserErrors?: (errors: { name?: string; email?: string }) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  editingUser,
  setEditingUser,
  onClose,
  onUpdate,
  updateUserErrors,
  setUpdateUserErrors,
}) => {
  if (!isOpen || !editingUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Edit Staff Member</h3>
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
            <TextInput
              type="text"
              label="Name"
              required
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />
            {updateUserErrors?.name && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <FiAlertCircle size={14} />
                <span>{updateUserErrors.name}</span>
              </div>
            )}
          </div>

          <div>
            <TextInput
              type="email"
              label="Email"
              required
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />
            {updateUserErrors?.email && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <FiAlertCircle size={14} />
                <span>{updateUserErrors.email}</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
