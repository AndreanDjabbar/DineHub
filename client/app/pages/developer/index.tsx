import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FiServer,
  FiPlus,
  FiLogOut,
  FiExternalLink,
  FiUser,
  FiMapPin,
  FiX,
} from "react-icons/fi";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  adminEmail: string;
}

const DeveloperDashboard: React.FC = () => {
  const token = localStorage.getItem("token");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    address: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  // Mock Data
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/dinehub/api/restaurant/restaurants",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Restaurants: ", data);
        setRestaurants(data.data);
      } else {
        console.error("Failed to fetch restaurants, Status:", response.status);
      }
    } catch (err: any) {
      console.error("Failed to fetch restaurants:", err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating Tenant:", formData);

    try {
      const response = await fetch(
        "http://localhost:4000/dinehub/api/restaurant/onboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug,
            address: formData.address,
            adminName: formData.adminName,
            adminEmail: formData.adminEmail,
            adminPassword: formData.adminPassword,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        await fetchRestaurants();
        setFormData({
          name: "",
          slug: "",
          address: "",
          adminName: "",
          adminEmail: "",
          adminPassword: "",
        });
        setShowModal(false);
      }
    } catch (err: any) {
      console.error("Failed to create tenant:", err);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://localhost:4000/dinehub/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Failed to logout:", error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* --- Super Admin Header --- */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 p-2 rounded-xl">
            <FiServer className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              DineHub Central
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Super Admin Console
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-600 flex items-center gap-2 text-sm font-bold transition"
        >
          <FiLogOut /> Logout
        </button>
      </header>

      <main className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Active Tenants
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage all restaurant instances
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition shadow-lg shadow-red-100 active:scale-[0.98]"
          >
            <FiPlus className="w-5 h-5" /> Onboard Restaurant
          </button>
        </div>

        {/* --- Tenants Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((repo) => (
            <div
              key={repo.id}
              className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-gray-100 transition group duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{repo.name}</h3>
                <a
                  href={`/${repo.slug}`}
                  target="_blank"
                  className="text-gray-400 hover:text-red-600 transition p-1 bg-gray-50 rounded-lg"
                >
                  <FiExternalLink />
                </a>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FiMapPin className="shrink-0 text-red-400" />
                  <span className="truncate">{repo.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="bg-red-50 px-2 py-1 rounded-md text-xs font-bold text-red-600 font-mono">
                    /{repo.slug}
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
                    Primary Admin
                  </p>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="bg-gray-100 p-1.5 rounded-full text-gray-500">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">{repo.adminEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- Create Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white text-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl scale-100">
            <div className="px-8 py-6 flex justify-between items-center border-b border-gray-50">
              <div>
                <h3 className="font-extrabold text-xl text-gray-900">
                  Onboard New Restaurant
                </h3>
                <p className="text-sm text-gray-500">
                  Create a new tenant and assign an admin.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Restaurant Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4">
                    Restaurant Details
                  </h4>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Brand Name
                    </label>
                    <input
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition placeholder:text-gray-400"
                      placeholder="e.g. Burger King"
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      URL Slug
                    </label>
                    <input
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition placeholder:text-gray-400"
                      placeholder="e.g. burger-king-jkt"
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Address
                    </label>
                    <textarea
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition placeholder:text-gray-400 resize-none"
                      placeholder="Full Address..."
                      rows={2}
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Right: Initial Admin Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4">
                    Admin Account
                  </h4>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Admin Name
                    </label>
                    <input
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition placeholder:text-gray-400"
                      placeholder="Full Name"
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, adminName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Email Address
                    </label>
                    <input
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition placeholder:text-gray-400"
                      placeholder="admin@brand.com"
                      type="email"
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, adminEmail: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Password
                    </label>
                    <input
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition placeholder:text-gray-400"
                      placeholder="••••••••"
                      type="password"
                      required
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adminPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-2xl font-bold bg-red-600 text-white hover:bg-red-700 transition shadow-lg shadow-red-100 active:scale-[0.98]"
                >
                  Create Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperDashboard;
