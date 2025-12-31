import React from 'react';
import { FiDollarSign, FiUsers, FiLayers } from 'react-icons/fi';
import type { User, Table } from './types';

interface StatsGridProps {
  users: User[];
  tables: Table[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ users, tables }) => {
  const stats = [
    { label: "Total Revenue", value: "Rp 12.500.000", icon: <FiDollarSign />, color: "bg-green-100 text-green-600" },
    { label: "Staff Count", value: users.length.toString(), icon: <FiUsers />, color: "bg-blue-100 text-blue-600" },
    { label: "Total Tables", value: tables.length.toString(), icon: <FiLayers />, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className={`p-4 rounded-xl ${stat.color}`}>{stat.icon}</div>
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <h3 className="text-xl font-bold">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
