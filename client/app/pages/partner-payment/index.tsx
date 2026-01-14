import React, { useState, useEffect } from "react";
import {
  FaCreditCard,
  FaChevronRight,
  FaExclamationCircle,
  FaSpinner,
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";
import Button from "../components/Button";

// Midtrans Snap types
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: SnapPayOptions) => void;
    };
  }
}

interface SnapPayOptions {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
}

interface SnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
}

// Component types
type PaymentMethodId =
  | "bca_va"
  | "mandiri_va"
  | "bni_va"
  | "bri_va"
  | "permata_va"
  | "gopay"
  | "shopeepay"
  | "qris";

interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  iconPath: string;
  description: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface PaymentDetails {
  method: string;
  vaNumber: string | null;
  amount: string;
  orderId: string;
}

interface OrderData {
  payment_type: PaymentMethodId;
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

export default function PaymentPage() {
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );

  const amount = 500000;

  const paymentMethods: PaymentMethod[] = [
    {
      id: "bca_va",
      name: "BCA Virtual Account",
      iconPath: "/bca.png",
      description: "Transfer via BCA Virtual Account",
    },
    {
      id: "gopay",
      name: "GoPay",
      iconPath: "/gopay.png",
      description: "Pay with GoPay e-wallet",
    },
    {
      id: "qris",
      name: "QRIS",
      iconPath: "/qris.png",
      description: "Scan QR code to pay",
    },
  ];

  // Load Midtrans Snap script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "YOUR_CLIENT_KEY_HERE");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
    setError("");
  };

  const validateForm = (): boolean => {
    if (!customerData.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!customerData.email.trim() || !customerData.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (!customerData.phone.trim() || customerData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async (): Promise<void> => {
    setError("");

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const orderId = "ORDER-" + Date.now();

      // Manual payment / offline / admin-verified flow
      setTimeout(() => {
        setPaymentDetails({
          method: "Manual Payment",
          vaNumber: null,
          amount: formatRupiah(amount),
          orderId,
        });

        setIsProcessing(false);
      }, 1500);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  const resetPayment = (): void => {
    setPaymentDetails(null);
    setCustomerData({ name: "", email: "", phone: "" });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {paymentDetails ? (
            // Payment Success/Pending Screen
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCreditCard className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Payment Pending
                </h2>
                <p className="text-gray-600">Please complete your payment</p>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Payment Method
                    </span>
                    <span className="font-semibold text-gray-800">
                      {paymentDetails.method}
                    </span>
                  </div>

                  {paymentDetails.vaNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Virtual Account
                      </span>
                      <span className="font-mono font-bold text-lg text-red-600">
                        {paymentDetails.vaNumber}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="font-bold text-xl text-gray-800">
                      {paymentDetails.amount}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order ID</span>
                    <span className="font-mono text-sm text-gray-800">
                      {paymentDetails.orderId}
                    </span>
                  </div>
                </div>
              </div>

              {paymentDetails.vaNumber && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Instructions:</strong> Transfer the exact amount to
                    the virtual account number above. Payment will be confirmed
                    automatically.
                  </p>
                </div>
              )}

              <Button onClick={resetPayment}>Make Another Payment</Button>
            </div>
          ) : (
            // Payment Method Selection Screen
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="bg-red-600 p-3 rounded-full inline-block mb-4">
                  <FaCreditCard className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Choose Payment Method
                </h2>
                <p className="text-gray-600">Total: {formatRupiah(amount)}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  PAYMENT METHODS
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => {
                    return (
                      <button
                        key={method.id}
                        className={`group flex items-center justify-between p-4 rounded-xl border-2 transition-all border-gray-200  hover:border-red-500 hover:bg-red-50`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg flex items-center justify-center">
                            <img
                              src={method.iconPath}
                              alt={method.name}
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-800">
                              {method.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {method.description}
                            </div>
                          </div>
                        </div>
                        <FaChevronRight className="w-5 h-5 text-gray-400 transition-colors group-hover:text-red-600" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700">
                  CUSTOMER DETAILS
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerData.phone}
                    onChange={handleInputChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <FaExclamationCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                <FaLock className="w-4 h-4" />
                <span>Secured by Midtrans</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
