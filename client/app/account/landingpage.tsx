import React from "react";
import { useNavigate } from "react-router";
import { LuChefHat } from "react-icons/lu"; // Using ChefHat as a logo placeholder
import { FaFire } from "react-icons/fa"; // Or a fire icon for the logo
import CustomerNavbar from "~/components/CustomerNavbar";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col font-sans text-gray-900">
      {/* Top Left Plate */}
      <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-white opacity-90">
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
          className="w-full h-full object-cover"
          alt="Food"
        />
      </div>

      {/* Top Right Plate */}
      <div className="absolute top-12 -right-20 w-56 h-56 rounded-full overflow-hidden shadow-lg border-4 border-white opacity-90">
        <img
          src="https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=400&q=80"
          className="w-full h-full object-cover"
          alt="Food"
        />
      </div>

      {/* Middle Right Plate */}
      <div className="absolute top-1/3 -right-16 w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white opacity-90">
        <img
          src="https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=400&q=80"
          className="w-full h-full object-cover"
          alt="Food"
        />
      </div>

      {/* --- Main Content --- */}
      <div className="grow flex flex-col items-center justify-center px-6 z-10 mt-20">
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="bg-red-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-red-200 shadow-lg mb-4">
              <img src="DineHub.webp" alt="" />
            </div>
          </div>
          <p className="text-gray-500 font-sm text-center leading-relaxed">
            Log In to receive exclusive rewards!
            <br />
          </p>
        </div>

        {/* Buttons Area */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          <button className="hover:cursor-pointer w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition shadow-md shadow-red-100 active:scale-[0.98]">
            Log In
          </button>

          <button className="hover:cursor-pointer w-full bg-white border border-red-100 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-50 transition active:scale-[0.98]">
            Sign Up
          </button>
        </div>
      </div>
      <CustomerNavbar />
    </div>
  );
};

export default LandingPage;
