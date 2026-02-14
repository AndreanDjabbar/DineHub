import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router";
import { FiMail, FiLock, FiCheckCircle } from "react-icons/fi";
import { BottomNavigation, TextInput, Button } from "~/components";
import NotificationPopup from "~/components/NotificationPopup";
import { useUserStore } from "~/stores";
import { useRequest } from "~/hooks";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { 
    makeRequest,
    isSuccess,
    isError,
    validationErrors,
    error: requestError,
    isLoading: loginLoading,
  } = useRequest();
  const [error, setError] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("Error");
  const loadUserData = useUserStore((state) => state.loadUserData);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isSuccess) {
      setNotificationTitle("Login Successful");
      setNotificationMessage("Welcome back! Redirecting...");
      setIsNotificationOpen(true);
      setTimeout(async () => {
        await loadUserData();
      }, 1500);
    }
  }, [isSuccess, loadUserData]);

  useEffect(() => {
    if (isError) {
      const data = requestError?.data;
      if (data?.message?.includes("Email not verified")) {
        alert("Please verify your email before logging in.");
        navigate("/verify-otp", {
          state: { email: formData.email, token: data.data.token },
        });
      } else {
        setError(data?.message || "");
      }
    }
  }, [isError, requestError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    await makeRequest({
      method: "POST",
      url: "http://localhost:4000/dinehub/api/auth/login",
      payload: {
        email: formData.email,
        password: formData.password,
      }
    })
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 px-6 py-6 flex flex-col">
      {/* --- Title Section --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Let's Sign You In
        </h1>
        <p className="text-gray-500">Welcome back, you've been missed!</p>
      </div>

      {/* --- Form Section --- */}
      <form className="flex-col flex gap-5" onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          type="email"
          name="email"
          error={validationErrors?.email || ""}
          value={formData.email}
          onChange={handleChange}
          placeholder="user@example.com"
          required
          icon={FiMail}
        />
        <TextInput
          label="Password"
          type="password"
          name="password"
          error={validationErrors?.password || ""}
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          icon={FiLock}
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/forgot-password")}
            type="button"
            className="hover:cursor-pointer text-sm font-bold text-gray-900 hover:text-red-600 transition"
          >
            Forgot Password?
          </button>
        </div>

        {error ? (
          <div className="text-red-600 text-sm font-medium">{error}</div>
        ) : null}

        {/* Submit Button */}
        <Button 
        type="submit" 
        disabled={loginLoading}
        text="Sign In"
        isLoading={loginLoading}
        isLoadingText="Signing In..."
        />
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

      <BottomNavigation />

      {/* Success Notification */}
      <NotificationPopup
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        title={notificationTitle}
        message={notificationMessage}
        icon={FiCheckCircle}
        iconClassName="text-green-600"
        autoClose={false}
      />
    </div>
  );
};

export default Login;
