import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  FiArrowLeft,
  FiLock,
  FiBell,
  FiMoon,
  FiGlobe,
  FiChevronRight,
  FiShield,
  FiTrash2,
} from "react-icons/fi";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock State for Toggles
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-10">
      {/* --- Header (Drill-down style) --- */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center border-b border-gray-50">
        <button
          onClick={() => navigate(-1)} // Go back to Profile
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold ml-2">Settings</h1>
      </div>

      <div className="px-4 mt-6 space-y-8">
        {/* --- Section: Account --- */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
            Account
          </h3>
          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-200">
            <SettingsItem
              icon={<FiLock />}
              label="Change Password"
              onClick={() => console.log("Navigate to Change Password")}
            />
          </div>
        </section>


        {/* --- Section: Danger Zone --- */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
            Danger Zone
          </h3>
          <div className="bg-red-50 rounded-2xl overflow-hidden border border-red-100">
            <button 
                onClick={() => alert("Are you sure?")}
                className="w-full flex items-center justify-between p-4 hover:bg-red-100 transition"
            >
              <div className="flex items-center gap-4">
                <div className="text-red-600 bg-white p-2 rounded-full">
                  <FiTrash2 className="w-5 h-5" />
                </div>
                <span className="font-bold text-red-600">Delete Account</span>
              </div>
            </button>
          </div>
        </section>
      </div>
      
      {/* Version Number */}
      <div className="mt-12 text-center">
        <p className="text-xs text-gray-400 font-medium">DineHub App v1.0</p>
      </div>
    </div>
  );
};

// --- Sub-Component: Clickable Item (Like a Link) ---
interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, value, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition active:bg-gray-200"
    >
      <div className="flex items-center gap-4">
        <div className="text-gray-500 text-xl">{icon}</div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-gray-500">{value}</span>}
        <FiChevronRight className="text-gray-400 w-5 h-5" />
      </div>
    </button>
  );
};

// --- Sub-Component: Toggle Switch ---
interface SettingsToggleProps {
  icon: React.ReactNode;
  label: string;
  isOn: boolean;
  onToggle: () => void;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ icon, label, isOn, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className="text-gray-500 text-xl">{icon}</div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      
      {/* Custom IOS Style Toggle */}
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${
          isOn ? "bg-red-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
            isOn ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default SettingsPage;