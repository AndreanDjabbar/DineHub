import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { FiMail, FiLock, FiCheckCircle } from "react-icons/fi";
import { BiLoader } from "react-icons/bi";
import { BottomNavigation, TextInput, Button } from "~/components";
import NotificationPopup from "~/components/NotificationPopup";
import api from "~/lib/axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("Error");

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
      const response = await api.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const data = response.data;
      if (data.success) {
        console.log("Login successful!, Data: ", data);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        setNotificationTitle("Login Successful");
        setNotificationMessage("Welcome back! Redirecting...");
        setIsNotificationOpen(true);

        setTimeout(() => {
          const role = data.data.user.role;
          const routeMapping: Record<any, string> = {
            ADMIN: "/admin",
            CASHIER: "/cashier",
            KITCHEN: "/kitchen",
            Developer: "/developer",
          };
          const redirectRoute = routeMapping[role] || "/";
          navigate(redirectRoute);
        }, 1500);
      }
    } catch (error) {
      const data = (error as any)?.data;
      console.error("Login failed:", error);
      if (data?.message?.includes("Email not verified")) {
        alert("Please verify your email before logging in.");
        navigate("/verify-otp", {
          state: { email: formData.email, token: data.data.token },
        });
      } else {
        setError("Incorrect email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="text-bold flex items-center justify-center gap-2">
              <BiLoader size={30} className="animate-spin" />
              Signing In...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
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
