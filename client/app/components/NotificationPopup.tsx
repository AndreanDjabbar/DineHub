import React from "react";
import type { IconType } from "react-icons";

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  icon?: IconType;
  iconClassName?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  title = "Notification",
  message,
  icon: Icon,
  iconClassName = "text-blue-600",
  autoClose = false,
  autoCloseDelay = 3000,
}) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);

      // Auto-close functionality
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoClose, autoCloseDelay]);

  if (!isOpen && !isAnimating) return null;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200); // Match the animation duration
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
        className={`relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md z-10 transition-all duration-200 cursor-pointer ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={handleClose}
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
        <p className="text-gray-700 text-center mb-4">{message}</p>
      </div>
    </div>
  );
};

export default NotificationPopup;
