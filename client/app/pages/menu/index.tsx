import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiUser,
  FiShoppingBag,
  FiChevronRight,
} from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BottomNavigation, QuantityPicker } from "~/components";
import { useNavigate, useSearchParams } from "react-router";
import api from "~/lib/axios";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  categoryId: string;
  isAvailable: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  image: string;
  items: MenuItem[];
}

interface TableInfo {
  id: string;
  name: string;
  capacity: number;
  restaurant_id: string;
  restaurantName: string;
  restaurantAddress: string;
}

const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table");

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [cart, setCart] = useState<{ [itemId: string]: number }>(() => {
    // Load cart from localStorage on mount (only in browser)
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("dinehub-cart");
      return savedCart ? JSON.parse(savedCart) : {};
    }
    return {};
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  // Fetch table and restaurant info
  useEffect(() => {
    const fetchTableInfo = async () => {
      if (!tableId) {
        setError("No table ID provided. Please scan a valid QR code.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/restaurant/table/${tableId}`);
        const data = response.data;
        setTableInfo(data.data);
      } catch (err: any) {
        setError(
          err.data?.message || "Failed to load table information",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTableInfo();
  }, [tableId]);

  // Fetch menu categories and items
  useEffect(() => {
    const fetchMenu = async () => {
      if (!tableInfo?.restaurant_id) return;

      try {
        const response = await api.get(
          `/menu/categories/${tableInfo.restaurant_id}`,
        );

        const data = response.data;
        setCategories(data.data.categories || []);
      } catch (err: any) {
        console.error("Error fetching menu:", err);
      }
    };

    fetchMenu();
  }, [tableInfo?.restaurant_id]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dinehub-cart", JSON.stringify(cart));
    // Also save table info for cart page
    if (tableInfo) {
      localStorage.setItem("dinehub-table-info", JSON.stringify(tableInfo));
    }
  }, [cart, tableInfo]);

  const handleAddToCart = (itemId: string) => {
    setCart((prevCart) => {
      const newCart = {
        ...prevCart,
        [itemId]: (prevCart[itemId] || 0) + 1,
      };
      return newCart;
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    // Toggle category selection - click again to deselect
    setSelectedCategoryId(
      selectedCategoryId === categoryId ? null : categoryId,
    );
    // Clear search when selecting a category
    setSearchQuery("");
  };

  // Calculate cart totals
  const allMenuItems = categories.flatMap((cat) => cat.items);
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalAmount = Object.entries(cart).reduce((sum, [itemId, qty]) => {
    const item = allMenuItems.find((i) => i.id === itemId);
    return sum + (item?.price || 0) * qty;
  }, 0);

  // Filter categories and items based on search query and selected category
  const filteredCategories = categories
    .map((category) => {
      const filteredItems = category.items.filter((item) => {
        const matchesSearch = searchQuery
          ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesCategory = selectedCategoryId
          ? item.categoryId === selectedCategoryId
          : true;

        return matchesSearch && matchesCategory;
      });

      return {
        ...category,
        items: filteredItems,
      };
    })
    .filter((category) => category.items.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error || !tableInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div className="text-red-600 mb-4">
            <FaMapMarkerAlt className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Load Menu
          </h2>
          <p className="text-gray-600">{error || "Table not found"}</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
      {/* --- Header Section --- */}
      <div className="sticky top-0 z-10 bg-white px-4 pt-4 pb-2 shadow-sm">
        {/* Top Bar: Restaurant Info & Table */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="w-4 h-4 text-red-600 fill-red-600" />
            <div>
              <span className="font-semibold text-xl block">
                {tableInfo.restaurantName}
              </span>
              <span className="text-xs text-gray-500">{tableInfo.name}</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search menu"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-full py-1.5 pl-12 pr-4 text-gray-700 outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>
      </div>
      {/* --- Categories Section --- */}
      {categories.length > 0 && (
        <div className="px-4 mt-4">
          <div className="flex justify-start gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer hover:opacity-80 transition"
              >
                {/* Category Circle */}
                <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-14 h-14 object-cover rounded-full border border-gray-200 mr-4"
                    />
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  {cat.name}
                </span>
                <div
                  className={`h-0.5 w-8 rounded-full transition-colors ${
                    selectedCategoryId === cat.id
                      ? "bg-red-600"
                      : "bg-transparent"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* --- Products Grid --- */}
      <main className="px-4 mt-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery
                ? "No items found matching your search"
                : "No menu items available"}
            </p>
          </div>
        ) : (
          <div className="space-y-8 mb-20">
            {filteredCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                {/* Category Header */}
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {category.name}
                  <span className="text-sm font-normal text-gray-500">
                    ({category.items.length})
                  </span>
                </h2>

                {/* Category Items Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                  {category.items.map((item) => (
                    <div key={item.id} className="group flex flex-col">
                      {/* Product Image Container */}
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 mb-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                            <span className="text-gray-400 text-4xl font-bold">
                              {item.name.charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Add Button / Counter Overlay */}
                        {item.isAvailable ? (
                          cart[item.id] ? (
                            <div className="absolute bottom-2 right-2">
                              <QuantityPicker
                                quantity={cart[item.id]}
                                onIncrement={() => handleAddToCart(item.id)}
                                onDecrement={() =>
                                  handleRemoveFromCart(item.id)
                                }
                              />
                            </div>
                          ) : (
                            <button
                              className="absolute bottom-2 right-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition active:scale-80"
                              onClick={() => handleAddToCart(item.id)}
                            >
                              <div className="w-8 h-8 rounded-full border border-red-500 flex items-center justify-center">
                                <FiPlus
                                  className="w-4 h-4 text-red-600"
                                  strokeWidth={3}
                                />
                              </div>
                            </button>
                          )
                        ) : (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              Unavailable
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-col grow">
                        <h3 className="font-bold text-gray-900 leading-tight mb-1 text-[15px]">
                          {item.name}
                        </h3>
                        <span className="font-bold text-[15px]">
                          {formatRupiah(item.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {/* --- Floating Cart Pop-up --- */}
      {totalItems > 0 && (
        <div className="fixed bottom-[85px] left-4 right-4 z-20 animate-slide-up">
          <button
            className="w-full bg-white text-gray-900 rounded-2xl shadow-xl shadow-black/5 flex items-stretch overflow-hidden hover:bg-gray-50 transition active:scale-[0.98]"
            onClick={() => {
              // Save categories to localStorage so cart page can access menu items
              localStorage.setItem(
                "dinehub-menu-categories",
                JSON.stringify(categories),
              );
              navigate("/cart");
            }}
          >
            {/* Left: Red Square (1:1 Ratio) */}
            <div className="bg-red-600 w-[70px] aspect-square flex items-center justify-center shrink-0">
              <FiShoppingBag className="w-6 h-6 text-white" />
            </div>

            {/* Right: Content Info */}
            <div className="grow flex items-center justify-between px-4 py-3">
              <div className="flex flex-col items-start">
                <span className="font-bold text-base">{totalItems} Items</span>
                <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]">
                  {tableInfo.restaurantName}
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
      <BottomNavigation />
    </div>
  );
};

export default Menu;
