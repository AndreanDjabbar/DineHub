import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiCheckCircle, FiClock, FiLogOut, FiCheckSquare, FiSquare } from "react-icons/fi";
import api from "~/lib/axios";
import useUserStore from "~/stores/user.store";

const KitchenDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock Orders (Expanded structure for item status)
  const [orders, setOrders] = useState([
    {
      id: "K-01",
      table: "Table 5",
      timeAgo: "12 mins",
      status: "Preparing",
      // Added 'done' boolean to items
      items: [
        { id: 1, name: "Spicy Noodle Chicken", qty: 2, notes: "Extra Spicy, No Onions", done: false },
        { id: 2, name: "Ice Tea", qty: 2, notes: "", done: false },
      ]
    },
    {
      id: "K-02",
      table: "Table 3",
      timeAgo: "5 mins",
      status: "Pending",
      items: [
        { id: 3, name: "Chicken Wrap", qty: 1, notes: "Cut in half", done: false },
      ]
    },
  ]);

  // 1. Toggle Individual Item
  const toggleItem = (orderId: string, itemId: number) => {
    setOrders(prevOrders => prevOrders.map(order => {
        if (order.id !== orderId) return order;

        // Toggle the specific item
        const updatedItems = order.items.map(item => 
            item.id === itemId ? { ...item, done: !item.done } : item
        );

        return { ...order, items: updatedItems };
    }));
  };

  // 2. Mark Whole Order Done (Removes from screen)
  const handleMarkOrderDone = (id: string) => {
    // In real app: API call to update Order Status to 'READY'
    setOrders(orders.filter(o => o.id !== id));
  };

  const handleLogout = async () => {
    try{
      await api.post("/auth/logout");
      useUserStore.getState().clearUserData();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    } 
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">Kitchen Display</h1>
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-white">
            <FiLogOut />
        </button>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders.map((order) => {
            // Check if all items are marked done
            const allItemsDone = order.items.every(i => i.done);

            return (
              <div key={order.id} className={`rounded-xl overflow-hidden shadow-lg flex flex-col transition-all duration-300 ${
                  allItemsDone ? "bg-green-50 ring-2 ring-green-500" : "bg-white"
              }`}>
                {/* Ticket Header */}
                <div className={`p-4 flex justify-between items-center ${
                    order.status === 'Preparing' ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  <div className="text-gray-900">
                    <h3 className="font-extrabold text-xl">{order.table}</h3>
                    <span className="text-xs text-gray-500">#{order.id}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600 font-bold bg-white px-2 py-1 rounded-md text-sm shadow-sm">
                    <FiClock /> {order.timeAgo}
                  </div>
                </div>

                {/* Ticket Items (Clickable) */}
                <div className="p-2 grow space-y-1">
                  {order.items.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => toggleItem(order.id, item.id)}
                        className={`p-3 rounded-lg cursor-pointer transition select-none flex items-start gap-3 group ${
                            item.done ? "bg-gray-100 opacity-50" : "hover:bg-gray-50"
                        }`}
                    >
                        {/* Checkbox Visual */}
                        <div className={`mt-1 ${item.done ? "text-green-600" : "text-gray-300"}`}>
                            {item.done ? <FiCheckSquare className="w-6 h-6"/> : <FiSquare className="w-6 h-6" />}
                        </div>

                        <div className="grow">
                            <div className="flex justify-between items-start">
                                <span className={`font-bold text-lg ${item.done ? "text-gray-500 line-through" : "text-gray-900"}`}>
                                    {item.qty}x
                                </span>
                                <span className={`font-bold text-lg grow ml-3 ${item.done ? "text-gray-500 line-through" : "text-gray-800"}`}>
                                    {item.name}
                                </span>
                            </div>
                            {item.notes && (
                                <p className={`text-sm italic ml-8 mt-1 p-1 rounded ${
                                    item.done ? "text-gray-400" : "text-red-600 bg-red-50"
                                }`}>
                                {item.notes}
                                </p>
                            )}
                        </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={() => handleMarkOrderDone(order.id)}
                    className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.98] ${
                        allItemsDone 
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 animate-pulse" 
                        : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                    }`}
                  >
                    <FiCheckCircle /> 
                    {allItemsDone ? "Order Ready" : "Mark Ready"}
                  </button>
                </div>
              </div>
            );
        })}
        
        {orders.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center h-96 text-gray-500">
                <FiCheckCircle className="w-16 h-16 mb-4 text-gray-700" />
                <p className="text-xl">All orders cleared!</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default KitchenDashboard;