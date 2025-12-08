import React from "react";
import { FiSearch, FiPlus, FiUser, FiShoppingBag, FiChevronRight } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import CustomerNavbar from "../components/CustomerNavbar";
import { useNavigate } from "react-router";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  type: "noodle" | "salad" | "wrap" | "plate";
}

interface Category {
  id: number;
  name: string;
  image: string;
}

interface Restaurant {
  id: number;
  name: string;
  location: string;
}

const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const categories: Category[] = [
  {
    id: 1,
    name: "Entrees",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 2,
    name: "Grab & Go",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 3,
    name: "Drinks",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 4,
    name: "Snacks",
    image:
      "https://plus.unsplash.com/premium_photo-1687014520257-3b09f6668092?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    name: "Extras",
    image:
      "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?auto=format&fit=crop&w=100&q=80",
  },
];

const products: Product[] = [
  {
    id: 1,
    name: "Spicy noodle chicken",
    price: 50000,
    type: "noodle",
    image:
      "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Delightful Caesar Salad",
    price: 20000,
    type: "salad",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Delightful Bound Salad",
    price: 25000,
    type: "salad",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Chicken Wrap",
    price: 30000,
    type: "wrap",
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    name: "Beef Rice Bowl",
    price: 45000,
    type: "plate",
    image:
      "https://images.unsplash.com/photo-1688431508895-4c2cab13b181?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 6,
    name: "Broccoli Beef",
    price: 30000,
    type: "plate",
    image:
      "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=400&q=80",
  },
];

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const restaurant: Restaurant = {
    id: 1,
    name: "Fried Chicken Restaurant",
    location: "123 Main St, Cityville",
  };
  const [cart, setCart ] = React.useState<Product[]>([]);
  const handleAddToCart = (product: Product) => {
    setCart([...cart, product]);
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-white pb-24 font-sans text-gray-900">
      {/* --- Header Section --- */}
      <div className="sticky top-0 z-10 bg-white px-4 pt-4 pb-2">
        {/* Top Bar: Location & Bag */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 cursor-pointer">
            <FaMapMarkerAlt className="w-4 h-4 text-red-600 fill-red-600" />
            <span className="font-semibold text-2xl">
              {restaurant.name}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search menu"
            className="w-full bg-gray-100 rounded-full py-1.5 pl-12 pr-4 text-gray-700 outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>
      </div>
      {/* --- Categories Section --- */}
      <div className="px-4 mt-4">
        <div className="flex justify-between md:justify-start md:gap-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer hover:opacity-80 transition"
            >
              {/* Category Image Wrapper */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shadow-sm">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* --- Products Grid --- */}
      <main className="px-4 mt-6">
        {/* Responsive Grid: 2 cols on mobile, 3 on md, 4 on lg */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col">
              {/* Product Image Container */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Add Button Overlay */}
                <button 
                className="absolute bottom-2 right-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition active:scale-80"
                onClick={() => handleAddToCart(product)}>
                  <div className="w-6 h-6 rounded-full border border-red-500 flex items-center justify-center">
                    <FiPlus className="w-4 h-4 text-red-600" strokeWidth={3} />
                  </div>
                </button>
              </div>

              {/* Product Details */}
              <div className="flex flex-col grow">
                <h3 className="font-bold text-gray-900 leading-tight mb-1 text-[15px]">
                  {product.name}
                </h3>
                <span className="font-bold text-[15px]">
                  {formatRupiah(product.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* --- Floating Cart Pop-up --- */}
      {cart.length > 0 && (
        <div className="fixed bottom-[85px] left-4 right-4 z-20 animate-slide-up">
          <button
            className="w-full bg-white text-gray-900 rounded-2xl shadow-xl shadow-black/5 flex items-stretch overflow-hidden hover:bg-gray-50 transition active:scale-[0.98]"
            onClick={() => navigate('/cart')}
          >
            {/* Left: Red Square (1:1 Ratio) */}
            <div className="bg-red-600 w-[70px] aspect-square flex items-center justify-center shrink-0">
              <FiShoppingBag className="w-6 h-6 text-white" />
            </div>

            {/* Right: Content Info */}
            <div className="grow flex items-center justify-between px-4 py-3">
              <div className="flex flex-col items-start">
                <span className="font-bold text-base">
                  {cart.length} Items
                </span>
                <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]">
                  {restaurant.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-red-600">
                  {formatRupiah(totalAmount)}
                </span>
                <FiChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </button>
        </div>
      )}
      <CustomerNavbar />{" "}
    </div>
  );
};

export default Menu;
