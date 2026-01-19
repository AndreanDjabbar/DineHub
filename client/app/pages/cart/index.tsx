import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FiX, FiMapPin } from "react-icons/fi";
import { BackButton, Button, QuantityPicker } from "~/components";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  categoryId: string;
  isAvailable: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
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
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableInfo, setTableInfo] = useState<any>(null);

  // Load cart data from localStorage
  useEffect(() => {
    const loadCartData = () => {
      try {
        // Get cart quantities
        const savedCart = localStorage.getItem("dinehub-cart");
        const cartData: { [itemId: string]: number } = savedCart
          ? JSON.parse(savedCart)
          : {};

        // Get menu categories to get full item details
        const savedCategories = localStorage.getItem("dinehub-menu-categories");
        const categories = savedCategories ? JSON.parse(savedCategories) : [];

        // Get table info
        const savedTableInfo = localStorage.getItem("dinehub-table-info");
        if (savedTableInfo) {
          setTableInfo(JSON.parse(savedTableInfo));
        }

        // Build cart items array
        const allMenuItems: MenuItem[] = categories.flatMap(
          (cat: any) => cat.items
        );
        const cartItems: CartItem[] = Object.entries(cartData)
          .map(([itemId, quantity]) => {
            const menuItem = allMenuItems.find((item) => item.id === itemId);
            if (menuItem) {
              return {
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: quantity,
                image: menuItem.image,
              };
            }
            return null;
          })
          .filter((item): item is CartItem => item !== null);

        setItems(cartItems);
      } catch (error) {
        console.error("Error loading cart data:", error);
      }
    };

    loadCartData();
  }, []);

  const updateQuantity = (id: string, change: number) => {
    setItems((prevItems) => {
      const updatedItems = prevItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      // Update localStorage
      const cartData: { [itemId: string]: number } = {};
      updatedItems.forEach((item) => {
        cartData[item.id] = item.quantity;
      });
      localStorage.setItem("dinehub-cart", JSON.stringify(cartData));

      return updatedItems;
    });
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
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Your cart is empty</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-red-600 font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              {/* Image */}
              <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-xl font-bold">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="grow">
                <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                <p className=" font-bold text-sm mt-1">
                  {formatRupiah(item.price)}
                </p>
              </div>

              {/* Quantity Stepper */}
              <QuantityPicker
                quantity={item.quantity}
                onIncrement={() => updateQuantity(item.id, 1)}
                onDecrement={() => updateQuantity(item.id, -1)}
              />
            </div>
          ))
        )}
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
