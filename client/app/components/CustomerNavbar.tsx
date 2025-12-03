import React from "react";
import { NavLink } from "react-router"; // Import NavLink
import { FiUser } from "react-icons/fi";
import { MdReceipt } from "react-icons/md";
import { LuChefHat } from "react-icons/lu";

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-safe z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        <NavItem
          to="/menu"
          icon={<LuChefHat className="w-6 h-6" />}
          label="Menus"
        />

        <NavItem
          to="/cart"
          icon={<MdReceipt className="w-6 h-6" />}
          label="Cart"
        />

        <NavItem
          to="/account"
          icon={<FiUser className="w-6 h-6" />}
          label="Account"
        />
      </div>
    </div>
  );
};

// Helper Component using NavLink
const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  to: string;
}> = ({ icon, label, to }) => (
  <NavLink
    to={to}
    // NavLink provides `isActive` automatically
    className={({ isActive }) =>
      `hover:cursor-pointer flex flex-col items-center gap-1 transition-colors duration-200 ${
        isActive ? "text-red-600" : "text-gray-400 hover:text-gray-600"
      }`
    }
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </NavLink>
);

export default BottomNavigation;
