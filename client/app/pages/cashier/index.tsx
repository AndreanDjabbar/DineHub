import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FiGrid, FiLogOut, FiCreditCard, FiPrinter } from "react-icons/fi";

interface User {
  id: number;
  name: string;
  role: string;
  restaurantId: number;
}

interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'unpaid';
  capacity: number;
}

const CashierDashboard: React.FC = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");  
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const user = userString ? JSON.parse(userString) : null;
  const restaurantId = user?.restaurantId;
  const [tables, setTables] = useState<Table[]>([])

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    console.log("Fetching tables...");

    try{
        const response = await fetch(`http://localhost:4000/dinehub/api/restaurant/tables/${restaurantId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if(!response.ok){
          console.error("Failed to fetch tables data");
          return;
        }
        const data = await response.json();
        const tables = data.data || [];
        console.log("All Tables: ", tables); 
        setTables(tables);
    }
    catch(error){
      console.error("Error fetching tables:", error);
    }
};

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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Cashier Station</h1>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 font-medium text-sm flex gap-2 items-center">
             <FiLogOut /> Logout
        </button>
      </header>

      <div className="flex grow overflow-hidden">
        {/* Left: Table Grid */}
        <div className="grow p-6 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Floor Plan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tables.map((table) => (
                    <button
                        key={table.id}
                        onClick={() => setSelectedTable(table)}
                        className={`h-32 rounded-xl border-2 flex flex-col items-center justify-center relative transition-all active:scale-[0.98] shadow-sm ${
                            selectedTable === table ? 'ring-2 ring-red-600 ring-offset-2' : ''
                        } ${
                            table.status === 'available' ? 'bg-white border-gray-200 text-gray-400 hover:border-gray-300' :
                            table.status === 'occupied' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                            'bg-red-50 border-red-200 text-red-600' // Unpaid
                        }`}
                    >
                        <span className="text-2xl font-bold">{table.name}</span>
                        <span className="text-xs uppercase font-bold mt-1 tracking-wider">{table.status}</span>
                        
                            <div className="absolute bottom-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm border border-gray-100 text-gray-900">
                                Rp 100.000
                            </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Right: Bill Detail Panel */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl">
            {selectedTable ? (
                <>
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-2xl font-bold">{selectedTable.name}</h2>
                        <span className="text-sm text-gray-400">Transaction #SSBIG176502</span>
                    </div>
                    
                    {/* Order Items Mock */}
                    <div className="grow overflow-y-auto p-6 space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex justify-between items-start text-sm">
                                <div>
                                    <p className="font-bold text-gray-800">1x Spicy Noodle</p>
                                    <p className="text-gray-400 text-xs">No Onions</p>
                                </div>
                                <span className="font-medium">Rp 50.000</span>
                            </div>
                        ))}
                         <div className="border-t border-dashed border-gray-200 my-4"></div>
                         <div className="flex justify-between text-sm">
                             <span className="text-gray-500">Subtotal</span>
                             <span>Rp 150.000</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-gray-500">Tax (11%)</span>
                             <span>Rp 16.500</span>
                         </div>
                    </div>

                    {/* Total & Action */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-bold">Total</span>
                            <span className="text-2xl font-extrabold text-red-600">Rp 166.500</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                             <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50">
                                <FiPrinter /> Print
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 shadow-lg shadow-red-100">
                                <FiCreditCard /> Pay
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <FiGrid className="w-12 h-12 mb-2 opacity-20" />
                    <p>Select a table to view bill</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;