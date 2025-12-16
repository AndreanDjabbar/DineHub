import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers, FiLogOut, 
  FiUserPlus, FiLayers, FiTrash2, FiMonitor, FiEdit, FiX
} from "react-icons/fi";  

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface Table {
  id: number;
  name: string;
  capacity: number;
}

const AdminDashboard: React.FC = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'staff' | 'tables'>('staff');
  const user = userString ? JSON.parse(userString) : null;
  const restaurantId = user?.restaurantId;

  // --- MOCK STATE (Replace with API data) ---
  const [users, setUsers] = useState<User[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  // --- FORM STATES ---
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'cashier' });
  const [newTable, setNewTable] = useState({ name: '', capacity: 2 });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);  

  const [editingTable, setEditingTable] = useState<Table | null>(null);

  if(!token || !userString){
    window.location.href = "/login";
  }

  useEffect(() => {
    const fetchStaff = async () => {
      console.log("Fetching staff...");
      console.log("Restaurant ID:", restaurantId);  
      console.log("Token:", token);
      if(!restaurantId) {
        console.error("No restaurant ID found for user");
        return;
      };
      try {
        const [cashierRes, kitchenRes] = await Promise.all([
          fetch(`http://localhost:4000/dinehub/api/user/cashier/${restaurantId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4000/dinehub/api/user/kitchen/${restaurantId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          }),
        ]);
        if(!cashierRes.ok || !kitchenRes.ok){
          console.error("Failed to fetch staff data");
          return;
        }
        const cashierData = await cashierRes.json();  
        const kitchenData = await kitchenRes.json();
        const cashiers = cashierData.data || [];
        const kitchenStaff = kitchenData.data || [];
        
        const allStaff = [...cashiers, ...kitchenStaff];
        console.log("All Staff: ", allStaff); 
        setUsers(allStaff);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
      };
      fetchStaff();
  }, [restaurantId, token]);

  useEffect(() => {
    const fetchTables = async () => {
      console.log("Fetching tables...");
      try {
        const response = await fetch(`http://localhost:4000/dinehub/api/restaurant/tables/${restaurantId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if(!response.ok){
          console.error("Failed to fetch tables data");
          return;
        }
        const data = await response.json();
        const tables = data.data || [];
        console.log("All Tables: ", tables); 
        setTables(tables);
      } catch (error) {
        console.error("Error fetching tables data:", error);
      }
      };
      fetchTables();
  }, [restaurantId, token]);

  // --- HANDLERS ---
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if(token){
      try{
        await fetch("http://localhost:4000/dinehub/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
      } catch (error) { console.error("Logout error:", error); }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!restaurantId){
      console.error("No restaurant ID found for user");
      return;
    }
    const payload = {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role.toUpperCase(),
      restaurantId: restaurantId
    }
    try{
      const response = await fetch("http://localhost:4000/dinehub/api/user/create-staff", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if(!response.ok){
        throw new Error(data.message || "Failed to create staff");
      }

      const createdUser = data.data;

      setUsers([
        ...users, 
        { 
        id: createdUser.id, 
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role, 
        } 
      ]);

      setNewUser({ name: '', email: '', password: '', role: 'cashier'}); // Reset form
      alert("Staff created successfully");

    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUserEditClick = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setIsEditModalOpen(true);
  };

  const handleTableEditClick = (tableToEdit: Table) => {
    setEditingTable(tableToEdit);
    setIsEditModalOpen(true);
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!editingUser) return;

    try{
      const response = await fetch(`http://localhost:4000/dinehub/api/user/update-staff/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        }),
      });

      const data = await response.json();
      if(!response.ok){
        throw new Error(data.message || "Failed to update staff");
      }

      const updatedUser = data.data;

      setUsers(users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));

      setEditingUser(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    } 
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    console.log("Deleting user with ID:", id);

    if(!restaurantId){
      console.error("No restaurant ID found for user");
      return;
    }
    fetch(`http://localhost:4000/dinehub/api/user/delete-staff/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/dinehub/api/restaurant/tables ", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newTable.name,
          capacity: newTable.capacity,
          restaurantId: restaurantId
        }),
      });

      const data = await response.json();
      console.log("Data:", data);
      if(!response.ok){
        throw new Error(data.message || "Failed to create table");
      }
      const createdTable = data.data;

      setTables([
        ...tables,
        {
          id: createdTable.id,
          name: createdTable.name,
          capacity: createdTable.capacity,
        }
      ]);
      setNewTable({ name: '', capacity: 2 }); // Reset form
      alert("Table added successfully");
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };

  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!editingTable) return;

    try{
      const response = await fetch(`http://localhost:4000/dinehub/api/restaurant/tables/${editingTable.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: editingTable.name,
          capacity: editingTable.capacity,
        }),
      });

      const data = await response.json();
      if(!response.ok){
        throw new Error(data.message || "Failed to update table");
      }

      const updatedTable = data.data;

      setTables(tables.map(t => t.id === updatedTable.id ? { ...t, ...updatedTable } : t));

      setEditingTable(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating table:", error);
    } 
  };

  const handleDeleteTable = (id: number) => {
    setTables(tables.filter(t => t.id !== id));
    console.log("Deleting table with ID:", id);

    if(!restaurantId){
      console.error("No restaurant ID found for user");
      return;
    }
    fetch(`http://localhost:4000/dinehub/api/restaurant/tables/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
  };

  // Mock Stats (Calculated dynamically based on state for realism)
  const stats = [
    { label: "Total Revenue", value: "Rp 12.500.000", icon: <FiDollarSign />, color: "bg-green-100 text-green-600" },
    { label: "Staff Count", value: users.length.toString(), icon: <FiUsers />, color: "bg-blue-100 text-blue-600" },
    { label: "Total Tables", value: tables.length.toString(), icon: <FiLayers />, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-red-600">DineHub Admin</h1>
        <span>{user.email}</span>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition">
          <FiLogOut /> Logout
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

        {/* Stats Grid */}
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

        {/* Management Area - Tabbed Interface */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('staff')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'staff' ? 'bg-red-50 text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <FiUserPlus /> Staff Management
            </button>
            <button 
              onClick={() => setActiveTab('tables')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'tables' ? 'bg-red-50 text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <FiLayers /> Table Management
            </button>
          </div>

          <div className="p-8">
            {/* === STAFF MANAGEMENT TAB === */}
            {activeTab === 'staff' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1 border-r border-gray-100 pr-8">
                  <h3 className="text-lg font-bold mb-4">Add New Account</h3>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="e.g. cashier_morning"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="e.g. cashier@your-restaurant.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input 
                        type="password" 
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="••••••••"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      >
                        <option value="cashier">Cashier</option>
                        <option value="kitchen">Kitchen</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition">
                      Create Account
                    </button>
                  </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-bold mb-4">Existing Accounts</h3>
                  <div className="grid gap-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${user.role === 'CASHIER' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                            {user.role === 'CASHIER' ? <FiDollarSign /> : <FiMonitor />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">{user.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUserEditClick(user)}
                            className="text-blue-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition"
                          >
                            <FiEdit/>
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
                    {users.length === 0 && <p className="text-gray-400 italic">No users found.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* === TABLE MANAGEMENT TAB === */}
            {activeTab === 'tables' && (
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
            )}

            {isEditModalOpen && editingUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                  {/* Modal Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Edit Staff Member</h3>
                    <button 
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  {/* Modal Form */}
                  <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
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
            )}

            {isEditModalOpen && editingTable && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                  {/* Modal Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Edit Table</h3>
                    <button 
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  {/* Modal Form */}
                  <form onSubmit={handleUpdateTable} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={editingTable.name}
                        onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                     <input 
                        type="number"
                        required
                        // These 3 classes at the end do the magic:
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={editingTable.capacity}
                        onChange={(e) => setEditingTable({ ...editingTable, capacity: parseInt(e.target.value) })}
                     />
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;