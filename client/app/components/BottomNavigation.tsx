import React from "react";
import { NavLink, useSearchParams } from "react-router";
import { FiUser } from "react-icons/fi";
import { MdReceipt } from "react-icons/md";
import { LuChefHat, LuHandshake } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useUserStore, type UserStore } from "~/stores";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let tableId = searchParams.get("table");
  
  if (!tableId && typeof window !== "undefined") {
    try {
      const savedTableInfo = localStorage.getItem("dinehub-table-info");
      if (savedTableInfo) {
        const parsed = JSON.parse(savedTableInfo);
        if (parsed && parsed.id) {
          tableId = parsed.id;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  const userData = useUserStore((state: UserStore) => state.userData);
  const isLoggedIn = userData !== null;

  const handleAccountClick = (e: React.MouseEvent) => {
    if (!userData) {
      e.preventDefault();
      navigate(tableId ? `/dinehub?table=${tableId}` : "/dinehub");
    }
  };

  const menuUrl = tableId ? `/menu?table=${tableId}` : "/menu";
  const ordersUrl = tableId ? `/orders?table=${tableId}` : "/orders";
  const accountUrl = tableId ? `/account?table=${tableId}` : "/account";

  const bottomNavigationItems = [
      { to: menuUrl, icon: <LuChefHat className="w-6 h-6" />, label: "Menus" },
      { 
        to: ordersUrl, 
        icon: <MdReceipt className="w-6 h-6" />, 
        label: "Orders",
        protected: true, 
      },
      { 
        to: accountUrl, 
        icon: <FiUser className="w-6 h-6" />, 
        label: "Account",
        onClick: !isLoggedIn ? handleAccountClick : undefined, 
      },
    ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-safe z-50">
      <div className="flex justify-evenly gap-20 items-center max-w-lg mx-auto">
        {bottomNavigationItems.filter((item) => !item.protected || isLoggedIn).map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            protected={item.protected}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  onClick?: (e: React.MouseEvent) => void;
  protected?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, onClick, protected: isProtected }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `hover:cursor-pointer flex flex-col items-center gap-1 transition-colors duration-200 ${
          isActive ? "text-red-600" : "text-gray-400 hover:text-gray-600"
        } ${isProtected ? "text-gray-400" : ""}`
      }
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

export default BottomNavigation;
