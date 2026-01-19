import React from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

interface QuantityPickerProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantityPicker: React.FC<QuantityPickerProps> = ({
  quantity,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white border border-red-600 shadow-md px-2 py-1">
      <button
        onClick={onDecrement}
        className="w-6 h-6 flex items-center justify-center rounded-full transition hover:bg-gray-100 active:scale-90"
      >
        <span className="text-red-600 font-bold text-lg">−</span>
      </button>
      <span className="font-bold text-gray-900 text-center text-sm min-w-5">
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        className="w-6 h-6 flex items-center justify-center rounded-full transition hover:bg-gray-100 active:scale-90"
      >
        <FiPlus className="w-4 h-4 text-red-600" strokeWidth={3} />
      </button>
    </div>
  );
};

export default QuantityPicker;
