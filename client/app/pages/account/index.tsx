import React from "react";
import { useState } from "react";
// Import icons
import {
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";
import { MdReceipt } from "react-icons/md";
import CustomerNavbar from "../components/CustomerNavbar";
import LandingPage from "./landingpage";

const ProfilePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Mock User Data
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "",
  };

  if (!isLoggedIn) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-24">
      {/* --- Header --- */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center justify-center border-b border-gray-50">
        <h1 className="text-lg font-bold">Account</h1>
      </div>

      {/* --- Profile Info Card --- */}
      <div className="px-4 mt-6">
        <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-6">
          <FiUser className="w-16 h-16" />

          {/* Name & Email */}
          <h2 className="text-xl font-bold mb-1">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      {/* --- Options Menu --- */}
      <div className="px-4 mt-8">
        <h3 className="font-bold text-lg mb-4">General</h3>
        <div className="flex flex-col divide-y divide-gray-100 border-t border-b border-gray-100">
          {/* <ProfileOption
            icon={<MdReceipt className="w-5 h-5" />}
            label="My Orders"
            to="/orders" 
          /> */}
          <ProfileOption
            icon={<FiSettings className="w-5 h-5" />}
            label="Settings"
          />
        </div>

        <h3 className="font-bold text-lg mb-4 mt-8">Other</h3>
        <div className="flex flex-col divide-y divide-gray-100 border-t border-b border-gray-100">
          <ProfileOption
            icon={<FiHelpCircle className="w-5 h-5" />}
            label="Help & Support"
          />
          {/* Log Out Button (Styled differently) */}
          <button className="hover:cursor-pointer hover:bg-gray-50 transition flex items-center justify-between py-4 w-full group">
            <div className="flex items-center gap-4">
              <div className="text-red-600 bg-red-50 p-2 rounded-full group-hover:bg-red-100 transition">
                <FiLogOut className="w-5 h-5" />
              </div>
              <span className="font-medium text-red-600">Log Out</span>
            </div>
          </button>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <CustomerNavbar />
    </div>
  );
};

interface ProfileOptionProps {
  icon: React.ReactNode;
  label: string;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, label }) => {
  return (
    <button className="hover:cursor-pointer flex items-center justify-between py-4 w-full group hover:bg-gray-50 transition px-2 -mx-2 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-gray-500 bg-gray-100 p-2 rounded-full group-hover:text-gray-700 transition">
          {icon}
        </div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <FiChevronRight className="text-gray-400 w-5 h-5 group-hover:text-gray-600 transition" />
    </button>
  );
};

export default ProfilePage;
