import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { FiArrowLeft, FiMinus, FiPlus} from "react-icons/fi";
import BackButton from "../components/BackButton";

// --- Types for your future API ---
interface OptionItem {
  id: string;
  name: string;
  price: number;
  isSoldOut?: boolean;
}

interface OptionGroup {
  id: string;
  title: string;
  subtitle?: string; // e.g. "Must be selected max. 1"
  type: "single" | "multi"; // Radio vs Checkbox logic
  items: OptionItem[];
  required: boolean;
}

const MenuDetailsPage: React.FC = () => {
  const navigate = useNavigate();

  // --- Mock Data (Replace with API data later) ---
  const menuItem = {
    id: "item-123",
    name: "A'la Carte Ayam",
    description: "Ayam goreng spesial dengan bumbu rahasia keluarga.",
    basePrice: 20000,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop", 
    optionGroups: [
      {
        id: "part",
        title: "PILIHAN AYAM",
        subtitle: "Must be selected max. 1",
        type: "single",
        required: true,
        items: [
          { id: "paha", name: "Paha Ayam", price: 0 },
          { id: "dada", name: "Dada Ayam", price: 0 },
        ],
      },
      {
        id: "sambal",
        title: "VARIANT SAMBAL",
        subtitle: "Must be selected max. 1",
        type: "single", // Based on "max 1" text in your screenshot
        required: true,
        items: [
          { id: "bakka", name: "Bakka + Lalapan", price: 4091 },
          { id: "barra", name: "Barra + Lalapan", price: 6364 },
          { id: "gajja", name: "Gajja + Lalapan", price: 4091 },
          { id: "nosambal", name: "Tanpa Sambal + Lalapan", price: 0 },
        ],
      },
      {
        id: "addon",
        title: "ADD ON",
        subtitle: "Optional • max 1",
        type: "multi", // Using multi for flexibility, though text says max 1
        required: false,
        items: [
          { id: "kremes", name: "Kremes", price: 2727 },
          { id: "serundeng", name: "Serundeng", price: 3636, isSoldOut: true },
        ],
      },
    ] as OptionGroup[],
  };

  // --- State Management ---
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  
  // Store selected options: { groupId: [itemId, itemId] }
  const [selections, setSelections] = useState<Record<string, string[]>>({
    // Pre-select defaults if needed (e.g. "paha")
    part: ["paha"], 
  });

  // --- Handlers ---
  const handleOptionToggle = (group: OptionGroup, itemId: string) => {
    setSelections((prev) => {
      const currentSelection = prev[group.id] || [];
      const isSelected = currentSelection.includes(itemId);

      if (group.type === "single") {
        // Radio behavior: Replace entire array with new item
        return { ...prev, [group.id]: [itemId] };
      } else {
        // Checkbox behavior: Toggle item
        if (isSelected) {
          return { ...prev, [group.id]: currentSelection.filter((id) => id !== itemId) };
        } else {
          return { ...prev, [group.id]: [...currentSelection, itemId] };
        }
      }
    });
  };

  // --- Price Calculation ---
  const totalPrice = useMemo(() => {
    let total = menuItem.basePrice;

    menuItem.optionGroups.forEach((group) => {
      const groupSelections = selections[group.id] || [];
      groupSelections.forEach((selectedItemId) => {
        const item = group.items.find((i) => i.id === selectedItemId);
        if (item) {
          total += item.price;
        }
      });
    });

    return total * quantity;
  }, [selections, quantity, menuItem]);

  // Format Currency
  const formatIDR = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-32">
      {/* --- Header --- */}
      <div className="sticky top-0 z-20 bg-white px-4 py-4 flex items-center shadow-sm">
        <BackButton />
        <h1 className="text-xl text-center font-bold text-gray-900 px-4 grow">{menuItem.name}</h1>
      </div>

      {/* --- Hero Image --- */}
      <div className="w-full h-64 bg-gray-200">
        <img 
          src={menuItem.image} 
          alt={menuItem.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* --- Main Content --- */}
      <div className="bg-white -mt-6 rounded-t-3xl relative z-10 px-5 pt-6 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold mb-1">{menuItem.name}</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            {menuItem.description}
          </p>
          <p className="text-xl font-bold text-red-600">{formatIDR(menuItem.basePrice)}</p>
        </div>

        <div className="divide-y divide-gray-100">
          {menuItem.optionGroups.map((group) => (
            <div key={group.id} className="py-6">
              {/* Group Header */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">
                    {group.title}
                  </h3>
                  {/* Visual Checkmark if selection criteria met */}
                  {(selections[group.id]?.length > 0) && (
                    <div className="bg-green-100 text-green-600 rounded-full p-1">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
                {group.subtitle && (
                  <p className="text-red-500 text-xs font-medium">
                    {group.subtitle}
                  </p>
                )}
              </div>

              {/* Group Items */}
              <div className="space-y-4">
                {group.items.map((item) => {
                  const isSelected = selections[group.id]?.includes(item.id);
                  const isDisabled = item.isSoldOut;

                  return (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between group cursor-pointer ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="pr-4">
                        <span className="text-gray-700 font-medium text-sm block">
                          {item.name}
                        </span>
                        {item.price > 0 && (
                          <span className="text-gray-500 text-xs font-medium mt-0.5 block">
                            + {formatIDR(item.price)}
                          </span>
                        )}
                      </div>

                      {isDisabled ? (
                         <span className="text-red-500 text-xs font-bold">Sold out</span>
                      ) : (
                        <div className="relative flex items-center">
                          <input
                            type={group.type === "single" ? "radio" : "checkbox"}
                            name={group.id} // Grouping for radio behavior
                            checked={isSelected}
                            onChange={() => !isDisabled && handleOptionToggle(group, item.id)}
                            className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded bg-white checked:bg-red-600 checked:border-red-600 transition-all"
                            // If it's a "single" type, we mimic radio visually but use custom logic or strict radio inputs
                            // To match screenshot perfectly: square checkboxes are often used even for single select in food apps
                            style={{ borderRadius: group.type === "single" ? "6px" : "6px" }}
                          />
                          {/* Custom Checkmark Icon */}
                          <svg
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Notes Section */}
          <div className="py-6">
             <h3 className="font-bold text-gray-900 text-sm mb-3">Notes</h3>
             <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Example: Make my dish delicious!"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition resize-none h-24"
             />
          </div>
        </div>
      </div>

      {/* --- Footer Sticky Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-30 pb-8 md:pb-4">
        <div className="flex items-center gap-4 mb-4">
           <span className="text-sm font-medium text-gray-500">Total Order</span>
           <div className="ml-auto flex items-center gap-4 bg-gray-100 rounded-full px-2 py-1">
              <button 
                onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 active:scale-90 transition disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="font-bold text-gray-900 min-w-5 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 active:scale-90 transition"
              >
                <FiPlus className="w-4 h-4" />
              </button>
           </div>
        </div>

        <button 
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg active:scale-[0.98] flex justify-between px-6"
            onClick={() => console.log("Add to cart", { menuItemId: menuItem.id, selections, note, quantity })}
        >
          <span>Add Order</span>
          <span>{formatIDR(totalPrice)}</span>
        </button>
      </div>
    </div>
  );
};

export default MenuDetailsPage;