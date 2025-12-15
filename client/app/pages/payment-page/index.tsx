import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FiLock, FiCreditCard, FiCalendar, FiUser, FiCheckCircle } from "react-icons/fi";

const MOCK_ORDER = {
  id: "order_123abc",
  planName: "DineHub Pro Plan",
  billingCycle: "Monthly Subscription",
  currency: "IDR",
  amount: 500000,
  tax: 0,
  total: 500000,
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [order, setOrder] = useState<typeof MOCK_ORDER | null>(null);

  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    holderName: "",
  });

  // Simulate fetching order data on mount
  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setOrder(MOCK_ORDER);
    }, 500);
  }, []);

  // --- Helpers ---
  const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.length > 1 ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "number") formattedValue = formatCardNumber(value);
    if (name === "expiry") formattedValue = formatExpiry(value);

    setCardData({ ...cardData, [name]: formattedValue });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setLoading(true);
    console.log(`Processing Payment of ${formatRupiah(order.total)} for:`, cardData.holderName);

    // Simulate Payment Processing Delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 animate-fade-in">
        <div className="text-center">
          <FiCheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-900">Payment Successful!</h2>
          <p className="text-gray-500 mt-2 text-lg">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  // Loading State for the Order Data
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <p className="text-gray-400 font-medium">Loading Order Details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Dynamic Order Summary */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Complete Activation</h1>
            <p className="text-gray-500 mt-2">
              You are one step away from launching your restaurant.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Summary</h3>
            
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
              <div>
                {/* 1. Dynamic Plan Name */}
                <p className="font-bold text-gray-900 text-lg">{order.planName}</p>
                {/* 2. Dynamic Billing Cycle */}
                <p className="text-sm text-gray-500">{order.billingCycle}</p>
              </div>
              {/* 3. Dynamic Base Price */}
              <p className="font-bold text-gray-900">{formatRupiah(order.amount)}</p>
            </div>

            <div className="flex justify-between items-center text-xl font-extrabold text-gray-900">
              <span>Total</span>
              {/* 4. Dynamic Total */}
              <span>{formatRupiah(order.total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiLock className="text-green-500" />
            <span>Payments are secure and encrypted via Midtrans.</span>
          </div>
        </div>

        {/* Right: Custom Card Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>

          <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">Payment Details</h2>

          <form onSubmit={handlePayment} className="space-y-6 relative z-10">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
              <div className="relative">
                <input
                  name="number"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-12 text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition placeholder:text-gray-300"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={cardData.number}
                  onChange={handleChange}
                  required
                />
                <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date</label>
                <div className="relative">
                  <input
                    name="expiry"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-12 text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition placeholder:text-gray-300"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardData.expiry}
                    onChange={handleChange}
                    required
                  />
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">CVC / CVV</label>
                <div className="relative">
                  <input
                    name="cvc"
                    type="password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-12 text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition placeholder:text-gray-300"
                    placeholder="123"
                    maxLength={3}
                    value={cardData.cvc}
                    onChange={handleChange}
                    required
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Cardholder Name</label>
              <div className="relative">
                <input
                  name="holderName"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-12 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition uppercase placeholder:text-gray-300"
                  placeholder="YOUR NAME"
                  value={cardData.holderName}
                  onChange={handleChange}
                  required
                />
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition shadow-lg shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  {/* 5. Dynamic Button Text */}
                  <span>Pay {formatRupiah(order.total)}</span>
                  <FiCheckCircle />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;