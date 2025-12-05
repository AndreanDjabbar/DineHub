import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { FiArrowLeft, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import BackButton from "../components/BackButton";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
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
        "http://localhost:4000/dinehub/api/auth/forgot-password/email-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Success response Data: ", data);
        navigate("/login");
      } else {
       setError(data.message || "Failed to send reset email.");
      }
    } catch (error) {
      console.error("Password change failed failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 px-6 py-6 flex flex-col">
      {/* --- Header: Back Button --- */}
      <BackButton />

      {/* --- Title Section --- */}
      <div className="mt-5 mb-8">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900">
          Forgot Password
        </h1>
        <p className="text-gray-500 font-medium">
          Enter your email to receive a password reset code.
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

        {/* Submit Button */}
        <button
          type="submit"
          className="hover:cursor-pointer w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-100 active:scale-[0.98] mt-4"
        >
          Send Code
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
