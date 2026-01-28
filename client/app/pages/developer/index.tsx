import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FiEdit2, FiEye, FiEyeOff } from "react-icons/fi";
import {
  FiServer,
  FiPlus,
  FiLogOut,
  FiExternalLink,
  FiUser,
  FiMapPin,
  FiX,
} from "react-icons/fi";
import api from "~/lib/axios";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  adminName: string;
  adminEmail: string;
  adminPassword?: string;
}

const DeveloperDashboard: React.FC = () => {
  const token = localStorage.getItem("token");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    address: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      address: "",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  // Mock Data
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get(
        "/restaurant",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log("Fetched Restaurants: ", data);
      setRestaurants(data.data);
    } catch (err: any) {
      console.error("Failed to fetch restaurants:", err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (restaurant: Restaurant) => {
    console.log("Editing Restaurant:", restaurant);
    setIsEditing(true);
    setEditId(restaurant.id);

    const dataToLoad = {
      name: restaurant.name,
      slug: restaurant.slug,
      address: restaurant.address,
      adminName: restaurant.adminName,
      adminEmail: restaurant.adminEmail,
      adminPassword: restaurant.adminPassword || "",
    };

    console.log("Loading Data into Form:", dataToLoad);
    console.groupEnd();

    setFormData({
      name: restaurant.name,
      slug: restaurant.slug,
      address: restaurant.address,
      adminName: restaurant.adminName,
      adminEmail: restaurant.adminEmail,
      adminPassword: restaurant.adminPassword || "",
    });

    setShowModal(true);
  };

  const handleCreate = async () => {
    try {
      const response = await api.post(
        "/restaurant/onboard",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchRestaurants();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      console.error("Failed to create tenant:", err);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const updateBody: any = {
        name: formData.name,
        slug: formData.slug,
        address: formData.address,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
      };

      if (formData.adminPassword) {
        updateBody.adminPassword = formData.adminPassword;
      }
      const response = await api.put(`/restaurant/${id}`, updateBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchRestaurants();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      console.error("Failed to update tenant:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editId) {
      console.log("Editing Tenant:", formData);
      await handleUpdate(editId);
    } else {
      await handleCreate();
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await api.post("/auth/logout", {}, {
          headers: {
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
          className="text-gray-400 hover:text-red-600 flex items-center gap-2 text-sm font-bold transition hover:cursor-pointer"
        >
          <FiLogOut /> Logout
        </button>
      </header>

      <main className="p-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Active Tenants
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage all restaurant instances
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex items-center gap-2 transition shadow-lg shadow-red-100 text-sm px-4 py-3 w-fit hover:cursor-pointer"
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
                <button
                  onClick={() => handleEditClick(repo)}
                  className="text-gray-400 hover:text-red-600 transition p-1 bg-gray-50 rounded-lg hover:cursor-pointer"
                  title="Edit Restaurant"
                >
                  <FiEdit2 />
                </button>
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
          <div className="bg-white text-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl scale-100 max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 flex justify-between items-center border-b border-gray-50">
              <div className="">
                <h3 className="font-extrabold text-xl text-gray-900">
                  {isEditing ? "Edit Tenant" : "Onboard New Tenant"}
                </h3>
                <p className="text-sm text-gray-500">
                  {isEditing
                    ? "Update restaurant and admin details"
                    : "Create a new restaurant instance"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition hover:cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-8">
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
                        value={formData.name}
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
                        value={formData.slug}
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
                        value={formData.address}
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
                        value={formData.adminName}
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
                        value={formData.adminEmail}
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
                      <div className="relative">
                        <input
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition placeholder:text-gray-400"
                          placeholder="••••••••"
                          value={formData.adminPassword}
                          type={showPassword ? "text" : "password"}
                          required={!isEditing}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              adminPassword: e.target.value,
                            })
                          }
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
                    {isEditing ? "Update Tenant" : "Create Tenant"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperDashboard;
