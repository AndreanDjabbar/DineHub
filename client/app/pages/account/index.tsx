import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FiSettings,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { BottomNavigation, ProfileBadge } from "~/components";
import useUserStore from "~/stores/user.store";
import { useRequest } from "~/hooks";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const clearUserData = useUserStore(state => state.clearUserData);
  const {
    makeRequest: logout,
    isError: isLogoutError,
    isSuccess: isLogoutSuccess,
    error: logoutError,
  } = useRequest();

  const handleLogout = async () => {
    logout({
      method: "POST",
      url: "/auth/logout",
    })
  };

  useEffect(() => {
    if (isLogoutSuccess) {
      clearUserData();
      navigate("/login");
    }
  }, [isLogoutSuccess]);

  useEffect(() => {
    if (isLogoutError) {
      console.error("Failed to logout:", logoutError);
    }
  }, [isLogoutError]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      {/* --- Header --- */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center justify-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Account</h1>
      </div>

      <ProfileBadge/>

      {/* --- Options Menu --- */}
      <div className="px-4 mt-8">
        <h3 className="font-bold text-lg mb-4">General</h3>
        <div className="flex flex-col divide-y divide-gray-100 border-t border-b border-gray-100">
          {/* <ProfileOption
            icon={<MdReceipt className="w-5 h-5" />}
            label="My Orders"
            to="/orders" 
          /> */}
          <button
            onClick={() => navigate("/settings")}
          >
            <ProfileOption
            icon={<FiSettings className="w-5 h-5" />}
            label="Settings"
          />
          </button>
          
        </div>

        <h3 className="font-bold text-lg mb-4 mt-8">Other</h3>
        <div className="flex flex-col divide-y divide-gray-100 border-t border-b border-gray-100">
          {/* Log Out Button (Styled differently) */}
          <button 
            onClick={handleLogout} className="hover:cursor-pointer hover:bg-gray-50 transition flex items-center justify-between py-4 w-full group">
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
      <BottomNavigation />
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
