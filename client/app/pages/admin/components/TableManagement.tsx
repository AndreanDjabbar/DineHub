import React from "react";
import { FiLayers, FiEdit, FiTrash2 } from "react-icons/fi";
import type { Table } from "./types";
import Button from "../../components/Button";
import NumInput from "~/pages/components/NumInput";

interface TableManagementProps {
  tables: Table[];
  newTable: any;
  setNewTable: (table: any) => void;
  handleAddTable: (e: React.FormEvent) => void;
  handleTableEditClick: (table: Table) => void;
  handleDeleteTable: (id: number) => void;
}

const TableManagement: React.FC<TableManagementProps> = ({
  tables,
  newTable,
  setNewTable,
  handleAddTable,
  handleTableEditClick,
  handleDeleteTable,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1 border-r border-gray-100 pr-8">
        <h3 className="text-lg font-bold mb-4">Add a Table</h3>
        <form onSubmit={handleAddTable} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (Seats)
            </label>
            <NumInput
              required
              min="1"
              value={newTable.capacity}
              onChange={(e) =>
                setNewTable({ ...newTable, capacity: parseInt(e.target.value) })
              }
            />
          </div>
          <Button type="submit">Add Table</Button>
        </form>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2">
        <h3 className="text-lg font-bold mb-4">Tables</h3>
        {tables.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-gray-300">
            <FiLayers className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500">
              No tables found. Start by adding one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className="relative p-4 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-red-200 transition group"
              >
                <div className="text-gray-300">
                  <FiLayers size={24} />
                </div>
                <h4 className="font-bold text-gray-900">{table.name}</h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                  {table.capacity} Seats
                </span>

                <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleTableEditClick(table)}
                    className="text-gray-300 hover:text-blue-600 transition"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTable(table.id)}
                    className="text-gray-300 hover:text-red-600 transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableManagement;
