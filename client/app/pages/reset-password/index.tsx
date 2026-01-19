import React, { useState } from "react";
import { useNavigate, NavLink, useSearchParams } from "react-router";
import { FiArrowLeft, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import BackButton from "../components/BackButton";
import Button from "../components/Button";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token || !email) {
      setError("Invalid password reset link.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:4000/dinehub/api/auth/forgot-password/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Reset password failed:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 px-6 py-6 flex flex-col">
      {/* --- Title Section --- */}
      <div className="mt-5 mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Reset Password
        </h1>
        <p className="text-gray-500">Enter your new password below.</p>
      </div>

      {/* --- Form Section --- */}
      <form className="flex-col flex gap-5" onSubmit={handleSubmit}>
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
              name="newPassword"
              value={formData.newPassword}
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
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
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
        <Button type="submit">Reset Password</Button>
      </form>
    </div>
  );
};

export default ResetPassword;
