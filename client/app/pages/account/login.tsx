import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { FiMail, FiLock } from "react-icons/fi";
import { BiLoader } from "react-icons/bi";
import { BottomNavigation, TextInput, Button } from "~/components";

const Login: React.FC = () => {
  const navigate = useNavigate();
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
        if (role === "ADMIN") {
          navigate("/admin");
          return;
        } else if (role === "CASHIER") {
          navigate("/cashier");
          return;
        } else if (role === "KITCHEN") {
          navigate("/kitchen");
          return;
        } else if (role === "Developer") {
          navigate("/developer");
          return;
        } else {
          navigate("/menu");
        }
      } else {
        console.log("Response Data: ", data);
        if (data.message.includes("Email not verified")) {
          alert("Please verify your email before logging in.");
          navigate("/verify-otp", {
            state: { email: formData.email, token: data.data.token },
          });
        } else {
          alert(data.message);
          setError(data.message);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
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
    </div>
  );
};

export default Login;
