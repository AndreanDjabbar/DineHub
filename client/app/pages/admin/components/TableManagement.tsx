import React from 'react';
import { FiLayers, FiEdit, FiTrash2 } from 'react-icons/fi';
import type { Table } from './types';

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
  handleDeleteTable
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* Form Section */}
       <div className="lg:col-span-1 border-r border-gray-100 pr-8">
        <h3 className="text-lg font-bold mb-4">Add / Edit Table</h3>
        <form onSubmit={handleAddTable} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Table Name/No.</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Table 10"
              value={newTable.name}
              onChange={(e) => setNewTable({...newTable, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Seats)</label>
            <input 
              type="number" 
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={newTable.capacity}
              onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value)})}
            />
          </div> 
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition">
            Save Table
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2">
        <h3 className="text-lg font-bold mb-4">Restaurant Layout</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div key={table.id} className="relative p-4 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-red-200 transition group">
              <div className="text-gray-300">
                 <FiLayers size={24} />
              </div>
              <h4 className="font-bold text-gray-900">{table.name}</h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{table.capacity} Seats</span>
              
              <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleTableEditClick(table)}
                  className="text-gray-300 hover:text-blue-600 transition"
                >
                  <FiEdit/>
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
      </div>
    </div>
  );
};

export default TableManagement;
