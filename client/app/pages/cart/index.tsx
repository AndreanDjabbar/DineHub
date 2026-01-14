import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiX, FiMapPin, FiMinus, FiPlus } from "react-icons/fi";
import BackButton from "../components/BackButton";
import Button from "../components/Button";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  options: string[];
  notes?: string;
}

const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "A'la Carte Ayam",
      price: 24091,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=200&q=80",
      options: ["Paha Ayam", "Tanpa Sambal + Lalapan"],
      notes: "Make it extra crispy please",
    },
    {
      id: 2,
      name: "Spicy Noodle Chicken",
      price: 50000,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=200&q=80",
      options: ["Level 3 Spicy", "Extra Egg (+5.000)"],
    },
    {
      id: 3,
      name: "Chicken Wrap",
      price: 35000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=200&q=80",
      options: ["No Onions", "Extra Cheese (+5.000)"],
    },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-32">
      {/* --- Header --- */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center justify-between shadow-sm">
        <BackButton />
        <h1 className="text-xl font-bold text-gray-900">Cart</h1>
        <div className="w-8" />
      </div>

      {/* --- Cart Items --- */}
      <div className="px-4 mt-6 flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            {/* Image */}
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="grow">
              <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
              {item.options && item.options.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.options.map((option, index) => (
                    <span
                      key={index}
                      className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              )}
              <p className=" font-bold text-sm mt-1">
                {formatRupiah(item.price)}
              </p>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 border border-gray-200 rounded-full px-2 py-1">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="hover:cursor-pointer w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-600"
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold w-2 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="hover:cursor-pointer w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-600"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Summary Section --- */}
      <div className="px-8 mt-8 space-y-3 border border-gray-300 py-4 rounded-2xl mb-10 mx-4">
        <h3 className="font-bold text-lg mb-4 text-center">Summary</h3>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold">{formatRupiah(subtotal)}</span>
        </div>

        <hr className="border-t border-gray-300 my-4" />

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tax (11%)</span>
          <span className="font-semibold">{formatRupiah(tax)}</span>
        </div>

        <hr className="border-t border-gray-300 my-4" />

        <div className="flex justify-between text-sm">
          <span className="font-bold">Total</span>
          <span className="font-semibold">{formatRupiah(total)}</span>
        </div>
      </div>

      {/* --- Sticky Bottom Checkout --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 font-medium">Total</span>
          <span className="text-xl font-bold">{formatRupiah(total)}</span>
        </div>
        <Button>Checkout</Button>
      </div>
    </div>
  );
};

export default CartPage;
