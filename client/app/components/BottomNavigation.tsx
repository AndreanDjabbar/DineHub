import React from "react";
import { NavLink, useSearchParams } from "react-router";
import { FiUser } from "react-icons/fi";
import { MdReceipt } from "react-icons/md";
import { LuChefHat, LuHandshake } from "react-icons/lu";
import { useNavigate } from "react-router";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table");

  const handleAccountClick = (e: React.MouseEvent) => {
    const token = localStorage.getItem("token");

    if (!token) {
      e.preventDefault();
      navigate("/");
    }
  };

  // Build URLs with table ID if it exists
  const menuUrl = tableId ? `/menu?table=${tableId}` : "/menu";
  const ordersUrl = tableId ? `/orders?table=${tableId}` : "/orders";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-safe z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        <NavItem
          to={menuUrl}
          icon={<LuChefHat className="w-6 h-6" />}
          label="Menus"
        />

        <NavItem
          to={ordersUrl}
          icon={<MdReceipt className="w-6 h-6" />}
          label="Orders"
        />

        <NavItem
          to="/account"
          icon={<FiUser className="w-6 h-6" />}
          label="Account"
          onClick={handleAccountClick}
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  onClick?: (e: React.MouseEvent) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `hover:cursor-pointer flex flex-col items-center gap-1 transition-colors duration-200 ${
          isActive ? "text-red-600" : "text-gray-400 hover:text-gray-600"
        }`
      }
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

export default BottomNavigation;
