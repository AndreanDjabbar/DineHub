import React from "react";
import {
  FiDollarSign,
  FiMonitor,
  FiEdit,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import type { User } from "./types";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

interface StaffManagementProps {
  users: User[];
  newUser: any;
  setNewUser: (user: any) => void;
  handleAddUser: (e: React.FormEvent) => void;
  handleUserEditClick: (user: User) => void;
  handleDeleteUser: (id: string) => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({
  users,
  newUser,
  setNewUser,
  handleAddUser,
  handleUserEditClick,
  handleDeleteUser,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1 border-r border-gray-100 pr-8">
        <h3 className="text-lg font-bold mb-4">Add New Account</h3>
        <form onSubmit={handleAddUser} className="space-y-4">
          <TextInput
            label="Name"
            type="text"
            required
            placeholder="e.g. cashier_morning"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextInput
            label="Email"
            type="email"
            required
            placeholder="e.g. cashier@your-restaurant.com"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextInput
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="cashier">Cashier</option>
              <option value="kitchen">Kitchen</option>
            </select>
          </div>
          <Button type="submit">Create Account</Button>
        </form>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2">
        <h3 className="text-lg font-bold mb-4">Existing Accounts</h3>
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${user.role === "CASHIER" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}
                >
                  {user.role === "CASHIER" ? <FiDollarSign /> : <FiMonitor />}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                    {user.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUserEditClick(user)}
                  className="text-blue-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-12 rounded-xl border border-dashed border-gray-300">
              <FiUsers className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">
                No users found. Start by adding one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
