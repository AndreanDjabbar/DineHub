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
import { BottomNavigation, TextInput, BackButton, Button } from "~/components";
import api from "~/lib/axios";

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
      const response = await api.post(
        "http://localhost:4000/dinehub/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      const data = response.data;
      const token = data.data?.token;
        setIsLoading(false);
        navigate(`/verify-otp?email=${formData.email}&token=${token}`);
    } catch (err: any) {
      setError(err?.data.message || "Signup failed");
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
            <TextInput
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              icon={FiUser}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
          <div className="relative">
            <TextInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              icon={FiMail}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">
            Password
          </label>
          <div className="relative">
            <TextInput
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              icon={FiLock}
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
            <TextInput
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              icon={FiLock}
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
        <Button type="submit">Sign Up</Button>
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
      <BottomNavigation />
    </div>
  );
};

export default Signup;
