import React from "react";
import { useNavigate } from "react-router";
import { LuChefHat } from "react-icons/lu"; // Using ChefHat as a logo placeholder
import { FaFire } from "react-icons/fa"; // Or a fire icon for the logo
import { BottomNavigation, Button } from "~/components";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans text-gray-900 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,1)),url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
      {/* --- Main Content --- */}
      <div className="grow flex flex-col items-center justify-center px-6 z-10">
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="bg-red-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-red-700 shadow-sm mb-4">
              <img src="DineHub.webp" alt="" />
            </div>
          </div>
          <p className="text-white font-sm text-center leading-relaxed">
            Log In to receive exclusive rewards!
            <br />
          </p>
        </div>

        {/* Buttons Area */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          <Button onClick={() => navigate("/login")}>Log In</Button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default LandingPage;
