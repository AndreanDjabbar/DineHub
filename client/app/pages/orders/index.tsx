import React from "react";
import { FiRefreshCw, FiHash, FiUsers, FiClock } from "react-icons/fi";
import CustomerNavbar from "../components/CustomerNavbar";

const OrderPage: React.FC = () => {
  // Mock Data (Replace with API fetch later)
  const orderDetails = {
    tableNumber: 38,
    transactionId: "SSBIG176502603412",
    pax: 5,
    status: "Preparing", // Overall status
    totalAmount: 294000,
    items: [
      {
        id: 1,
        name: "A'la Carte Ayam",
        qty: 1,
        price: 24091,
        notes: "Tanpa Sambal + Lalapan, Paha Ayam",
        status: "Preparing",
      },
      {
        id: 2,
        name: "Es Teh Tawar Jumbo",
        qty: 3,
        price: 27273,
        notes: "",
        status: "Served",
      },
      {
        id: 3,
        name: "Cah Kangkung Bakar",
        qty: 2,
        price: 39090,
        notes: "",
        status: "Preparing",
      },
      {
        id: 4,
        name: "Nasi Pulen",
        qty: 4,
        price: 36364,
        notes: "",
        status: "Preparing",
      },
      {
        id: 5,
        name: "Bakwan Jagung (2 Pcs)",
        qty: 1,
        price: 15000,
        notes: "",
        status: "Preparing",
      },
    ],
  };

  // Helper to format currency (IDR)
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      {/* --- Header --- */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-bold text-gray-800">Order Summary</h1>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:rotate-180 duration-500">
          <FiRefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* --- Info Card (Table & Pax) --- */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          {/* Table Number Badge */}
          <div className="bg-red-50 text-red-700 font-bold text-lg py-3 rounded-xl text-center mb-4 border border-orange-100">
            Table: {orderDetails.tableNumber}
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="space-y-1">
              <p className="text-gray-400 flex items-center gap-1">
                <FiHash className="w-4 h-4" /> Transaction Number
              </p>
              <p className="font-bold text-gray-700 truncate w-40">
                {orderDetails.transactionId}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-gray-400 flex items-center justify-end gap-1">
                <FiUsers className="w-4 h-4" /> Pax
              </p>
              <p className="font-bold text-gray-700">{orderDetails.pax}</p>
            </div>
          </div>
        </div>

        {/* --- Order List --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-700 text-sm">
              Order Items ({orderDetails.items.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-50">
            {orderDetails.items.map((item) => (
              <div key={item.id} className="p-4 flex gap-4">
                {/* Qty Badge */}
                <div className="shrink-0">
                  <div className="bg-red-50 text-red-600 font-bold text-xs px-2 py-1 rounded-md border border-orange-100">
                    {item.qty}x
                  </div>
                </div>

                {/* Item Details */}
                <div className="grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-800 text-base">
                      {item.name}
                    </h3>
                    <span className="font-bold text-gray-700 text-sm">
                      {formatIDR(item.price)}
                    </span>
                  </div>

                  {/* Notes (if any) */}
                  {item.notes && (
                    <p className="text-gray-400 text-xs mb-2 leading-relaxed">
                      {item.notes}
                    </p>
                  )}

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5">
                    {item.status === "Preparing" ? (
                      <span className="text-blue-500 text-xs font-bold flex items-center gap-1 animate-pulse">
                        <FiClock className="w-3 h-3" /> Preparing
                      </span>
                    ) : (
                      <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                         Served
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Bottom Total Section --- */}
      <div className="fixed bottom-[70px] left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              Total Payment
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {formatIDR(orderDetails.totalAmount)}
            </h2>
          </div>
          {/* Pay Button was here, removed as requested */}
        </div>
      </div>

      <CustomerNavbar />
    </div>
  );
};

export default OrderPage;