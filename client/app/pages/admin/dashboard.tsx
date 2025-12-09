import React from "react";
import { useNavigate } from "react-router";
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers, FiLogOut } from "react-icons/fi";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock Data
  const stats = [
    { label: "Total Revenue", value: "Rp 12.500.000", icon: <FiDollarSign />, color: "bg-green-100 text-green-600" },
    { label: "Total Orders", value: "154", icon: <FiShoppingBag />, color: "bg-blue-100 text-blue-600" },
    { label: "Active Tables", value: "12/20", icon: <FiUsers />, color: "bg-orange-100 text-orange-600" },
    { label: "Growth", value: "+18%", icon: <FiTrendingUp />, color: "bg-purple-100 text-purple-600" },
  ];

  const recentOrders = [
    { id: "ORD-001", table: "Table 5", amount: 150000, status: "Paid", time: "10:30 AM" },
    { id: "ORD-002", table: "Table 8", amount: 245000, status: "Pending", time: "10:45 AM" },
    { id: "ORD-003", table: "Table 2", amount: 75000, status: "Paid", time: "11:00 AM" },
  ];

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if(token){
      try{
        await fetch("http://localhost:4000/dinehub/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      } catch (error) {
        console.error("Failed to logout:", error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar / Topbar Simplification */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-red-600">DineHub Admin</h1>
        <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition"
        >
            <FiLogOut /> Logout
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <h3 className="text-xl font-bold">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-100">
                  <th className="py-3 font-medium">Order ID</th>
                  <th className="py-3 font-medium">Table</th>
                  <th className="py-3 font-medium">Amount</th>
                  <th className="py-3 font-medium">Time</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="py-4 text-sm text-gray-500">{order.table}</td>
                    <td className="py-4 text-sm font-bold">Rp {order.amount.toLocaleString('id-ID')}</td>
                    <td className="py-4 text-sm text-gray-400">{order.time}</td>
                    <td className="py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        order.status === "Paid" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;