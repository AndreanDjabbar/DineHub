import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import BottomNavigation from "../components/CustomerNavbar";
import { BiLoader } from "react-icons/bi";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/dinehub/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Login successful!, Data: ", data);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        const role = data.data.user.role;
        if(role === "ADMIN") {
          navigate("/admin/dashboard");
          return;
        }else if(role === "CASHIER") {
          navigate("/cashier");
          return;
        }else if(role === "KITCHEN") {
          navigate("/kitchen");
          return;
        }else if(role === "Developer") {
          navigate("/developer");
          return;
        }else{
          navigate("/menu");
        }
      } else {
        console.log("Response Data: ", data);
        if(data.message.includes("Email not verified")) {
          alert("Please verify your email before logging in.");
          navigate("/verify-otp", {
            state: { email: formData.email, token: data.data.token },
          });
        }else{
          alert(data.message);
          setError(data.message);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 px-6 py-6 flex flex-col">
      {/* --- Title Section --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900">
          Let's Sign You In
        </h1>
        <p className="text-gray-500 font-medium">
          Welcome back, you've been missed!
        </p>
      </div>

      {/* --- Form Section --- */}
      <form className="flex-col flex gap-5" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FiMail className="w-5 h-5" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FiLock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-12 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition"
            />
            {/* Eye Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              {showPassword ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button 
          onClick={() => navigate("/forgot-password")}
          type="button"
          className="hover:cursor-pointer text-sm font-bold text-gray-900 hover:text-red-600 transition">
            Forgot Password?
          </button>
        </div>

        {error ? (
          <div className="text-red-600 text-sm font-medium">{error}</div>
        ) : null}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="hover:cursor-pointer w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-100 active:scale-[0.98] mt-4"
        >
          {isLoading ? (
            <div className="text-bold flex items-center justify-center gap-2">
              <BiLoader size={30} className="animate-spin"/>
              Signing In...
            </div>            
          ) : "Sign In"}
        </button>
      </form>

      {/* --- Footer: Sign Up Link --- */}
      <div className="grow flex justify-center pb-4 mt-6">
        <p className="text-sm font-medium text-gray-500">
          Don't have an account?{" "}
          <NavLink
            to="/signup"
            className="hover:cursor-pointer text-red-600 font-bold hover:underline"
          >
            Sign Up
          </NavLink>
        </p>
      </div>

      <BottomNavigation/>
    </div>
  );
};

export default Login;
