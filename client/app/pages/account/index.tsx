import React, { use } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// Import icons
import {
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";
import CustomerNavbar from "../components/CustomerNavbar";

interface User {
  id: string;
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>({ id: "", name: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if(!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/dinehub/api/auth/profile", {
          method: "GET",  
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("User Profile Data: ", data);
          setUser({ id: data.data.id, name: data.data.name, email: data.data.email });
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if(token){
      try{
        await fetch("http://localhost:4000/dinehub/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      } catch (error) {
        console.error("Failed to logout:", error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

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
