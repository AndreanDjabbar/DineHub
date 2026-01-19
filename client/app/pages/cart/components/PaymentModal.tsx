import React, { useState, useEffect } from "react";
import {
  FaCreditCard,
  FaChevronRight,
  FaExclamationCircle,
  FaSpinner,
  FaLock,
  FaTimes,
} from "react-icons/fa";
import { Button } from "~/components";
import BCAImage from "~/assets/image/bca.png";
import GoPayImage from "~/assets/image/gopay.png";
import QRISImage from "~/assets/image/qris.png";

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

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
}: PaymentModalProps) {
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

  const paymentMethods: PaymentMethod[] = [
    {
      id: "bca_va",
      name: "BCA Virtual Account",
      iconPath: BCAImage,
      description: "Transfer via BCA Virtual Account",
    },
    {
      id: "gopay",
      name: "GoPay",
      iconPath: GoPayImage,
      description: "Pay with GoPay e-wallet",
    },
    {
      id: "qris",
      name: "QRIS",
      iconPath: QRISImage,
      description: "Scan QR code to pay",
    },
  ];

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPaymentDetails(null);
      setCustomerData({ name: "", email: "", phone: "" });
      setError("");
      setIsProcessing(false);
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 items-center justify-center p-4 overflow-hidden flex flex-col">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Close Button */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {paymentDetails ? "Payment Details" : "Payment"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:cursor-pointer"
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {paymentDetails ? (
            // Payment Success/Pending Screen
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCreditCard className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Payment Pending
                </h3>
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
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  Choose Payment Method
                </h3>
                <p className="text-gray-600">Total: {formatRupiah(amount)}</p>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  PAYMENT METHODS
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => {
                    return (
                      <button
                        key={method.id}
                        className={`group flex items-center justify-between p-4 rounded-xl border-2 transition-all border-gray-200  hover:border-red-500 hover:bg-red-50 hover:cursor-pointer`}
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
                <h4 className="text-sm font-semibold text-gray-700">
                  CUSTOMER DETAILS
                </h4>

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
    </>
  );
}
