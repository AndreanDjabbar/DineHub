import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import {
  FiArrowLeft,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
} from "react-icons/fi";
import CustomerNavbar from "../components/CustomerNavbar";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/dinehub/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Response Data: ", data);
        const token = data.data?.token;
        setIsLoading(false);
        navigate(`/verify-otp?email=${formData.email}&token=${token}`);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 px-6 py-6 flex flex-col">

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Create Account
        </h1>
        <p className="text-gray-500">Sign up to get started!</p>
      </div>

      <form className="flex-col flex gap-5" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FiUser className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition"
            />
          </div>
        </div>

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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FiLock className="w-5 h-5" />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-12 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              {showConfirm ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="hover:cursor-pointer w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg active:scale-[0.98] mt-4"
        >
          Sign Up
        </button>
      </form>

      {/* --- Footer: Login Link --- */}
      <div className="grow flex justify-center pb-4 mt-6">
        <p className="text-sm font-medium text-gray-500">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-red-600 font-bold hover:underline"
          >
            Login
          </NavLink>
        </p>
      </div>
      <CustomerNavbar/>
    </div>
  );
};

export default Signup;
