import React, { useState } from "react";
import {
  FiLayers,
  FiEdit,
  FiTrash2,
  FiMousePointer,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import type { Table } from "./types";
import { NumInput, Button, ConfirmationPopup, TextInput } from "~/components";
import NotificationPopup from "~/components/NotificationPopup";
import TableQR from "./TableQr";
import { BsInfoCircle } from "react-icons/bs";

interface TableManagementProps {
  tables: Table[];
  newTable: any;
  setNewTable: (table: any) => void;
  handleAddTable: (e: React.FormEvent) => void;
  handleTableEditClick: (table: Table) => void;
  handleDeleteTable: (id: number) => void;
  activeTable: Table | null;
  onTableSelect: (table: Table) => void;
  addTableErrors?: {
    capacity?: string;
  };
  setAddTableErrors?: (errors: { capacity?: string }) => void;
}

const TableManagement: React.FC<TableManagementProps> = ({
  tables,
  newTable,
  setNewTable,
  handleAddTable,
  handleTableEditClick,
  handleDeleteTable,
  activeTable,
  onTableSelect,
  addTableErrors,
  setAddTableErrors,
}) => {
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null);
  const [isSuccessNotificationOpen, setIsSuccessNotificationOpen] =
    useState(false);
  const [deletedTableName, setDeletedTableName] = useState<string>("");

  const handleDeleteClick = (table: Table) => {
    setTableToDelete(table);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = () => {
    if (tableToDelete) {
      setDeletedTableName(tableToDelete.name);
      handleDeleteTable(tableToDelete.id);
      setIsSuccessNotificationOpen(true);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* --- Left Column: Form & QR Preview --- */}
      <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-8 flex flex-col gap-6 sticky top-24 h-fit">
        {/* Section A: Add Form */}
        <div>
          <h3 className="text-lg font-bold mb-4">Add a Table</h3>
          <form onSubmit={handleAddTable} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Table Name
              </label>
              <TextInput 
              value={newTable.name} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewTable({
                  ...newTable,
                  name: e.target.value,
                });

                if (addTableErrors?.capacity && setAddTableErrors) {
                  setAddTableErrors({
                    ...addTableErrors,
                    capacity: undefined,
                  });
                }
              }}              />
              {addTableErrors?.capacity && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <FiAlertCircle size={14} />
                  <span>{addTableErrors.capacity}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (Seats)
              </label>
              <NumInput
                required
                min="1"
                value={newTable.capacity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewTable({
                    ...newTable,
                    capacity: parseInt(e.target.value),
                  });

                  if (addTableErrors?.capacity && setAddTableErrors) {
                    setAddTableErrors({
                      ...addTableErrors,
                      capacity: undefined,
                    });
                  }
                }}
              />
              {addTableErrors?.capacity && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <FiAlertCircle size={14} />
                  <span>{addTableErrors.capacity}</span>
                </div>
              )}
            </div>
            <Button type="submit">Add Table</Button>
          </form>
        </div>

        {/* Section B: QR Display (Dynamic) */}
        {/* Shows QR for EITHER the newly created table OR the clicked table */}
        {activeTable && (
          <TableQR
            key={activeTable.id} // Key forces re-render when ID changes
            tableId={activeTable.id}
            tableName={activeTable.name}
          />
        )}
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
          <div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 mb-4 text-center text-gray-400 flex flex-col items-center">
              <BsInfoCircle className="mb-2 text-2xl" />
              <p className="text-sm">
                Select a table from the list table below
                <br />
                to view its QR Code
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`relative p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition cursor-pointer group
                    ${
                      activeTable?.id === table.id
                        ? "border-red-600 bg-red-50 ring-2 ring-red-100 shadow-sm" // <--- Active Style (Red Border)
                        : "border-gray-200 hover:border-red-300 hover:shadow-md bg-white" // <--- Inactive Style
                    }
                  `}
                  onClick={() => onTableSelect(table)}
                >
                  <div className="text-gray-300">
                    <FiLayers size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900">{table.name}</h4>
                  <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded-md border border-gray-100">
                    {table.capacity} Seats
                  </span>

                  <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleTableEditClick(table)}
                      className="text-gray-400 hover:text-blue-600 transition hover:cursor-pointer"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(table)}
                      className="text-gray-400 hover:text-red-600 transition hover:cursor-pointer"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Table"
        message={`Are you sure you want to delete ${tableToDelete?.name}? This action cannot be undone.`}
        icon={FiTrash2}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Success Notification */}
      <NotificationPopup
        isOpen={isSuccessNotificationOpen}
        onClose={() => setIsSuccessNotificationOpen(false)}
        title="Table Deleted"
        message={`${deletedTableName} has been successfully deleted.`}
        icon={FiCheckCircle}
        iconClassName="text-green-600"
        autoClose={true}
        autoCloseDelay={3000}
      />
    </div>
  );
};

export default TableManagement;
