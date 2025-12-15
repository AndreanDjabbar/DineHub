import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";

const RegisterRestaurant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    address: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calling the public endpoint we discussed
      const response = await fetch(
        "http://localhost:4000/dinehub/api/public/register-tenant",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // In a real app, you'd redirect to payment here
        alert("Registration successful! Redirecting to login...");
        navigate("/login");
      } else {
        alert("Error: " + (data.message || "Registration failed"));
      }
    } catch (error) {
      console.error("Registration failed", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white max-w-2xl w-full p-8 rounded-3xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Join DineHub
          </h1>
          <p className="text-gray-500">
            Launch your restaurant ordering system in minutes.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* --- Section 1: Restaurant Details --- */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider border-b border-gray-100 pb-2">
              Restaurant Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  className="w-full bg-gray-50 border text-gray-900 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-100 outline-none transition"
                  placeholder="e.g. Padang Merdeka"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  URL Slug
                </label>
                <input
                  className="w-full bg-gray-50 border text-gray-900 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-100 outline-none transition"
                  placeholder="e.g. padang-merdeka-jkt"
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Your site will be at dinehub.com/
                  {formData.slug || "your-slug"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Full Address
              </label>
              <textarea
                className="w-full bg-gray-50 border text-gray-900 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-100 outline-none transition resize-none"
                placeholder="Street name, City, Zip Code..."
                rows={2}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* --- Section 2: Admin Account --- */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider border-b border-gray-100 pb-2">
              Admin Account
            </h3>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Your Full Name
              </label>
              <input
                className="w-full bg-gray-50 border text-gray-900 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-100 outline-none transition"
                placeholder="e.g. Budi Santoso"
                onChange={(e) =>
                  setFormData({ ...formData, adminName: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border text-gray-900 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-100 outline-none transition"
                  placeholder="admin@resto.com"
                  onChange={(e) =>
                    setFormData({ ...formData, adminEmail: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-gray-50 border text-gray-900 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-100 outline-none transition"
                    placeholder="••••••••"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adminPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-100 mt-6 active:scale-[0.99]"
          >
            {loading ? "Waiting..." : "Continue to Payment"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? Login{" "}
            <Link
              to="/login"
              className="text-red-600 font-bold hover:underline"
            >
              here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterRestaurant;
