import React from "react";
import type { IconType } from "react-icons";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  icon?: IconType;
  iconClassName?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  icon: Icon,
  iconClassName = "text-red-600",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClassName = "bg-red-600 hover:bg-red-700",
  cancelButtonClassName = "bg-gray-300 hover:bg-gray-400 text-gray-800",
}) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200); // Match the animation duration
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with fade animation */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Popup Container with scale and fade animation */}
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md z-10 transition-all duration-200 ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Icon */}
        {Icon && (
          <div className="flex justify-center mb-4">
            <Icon className={`text-5xl ${iconClassName}`} />
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-2">{title}</h2>

        {/* Message */}
        <p className="text-gray-700 text-center mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className={`flex-1 py-3 rounded-lg font-bold transition ${cancelButtonClassName}`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-3 rounded-lg font-bold text-white transition ${confirmButtonClassName}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
