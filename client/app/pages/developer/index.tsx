import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FiAlertCircle, FiEdit, FiEye, FiEyeOff } from "react-icons/fi";
import {
  FiServer,
  FiPlus,
  FiLogOut,
  FiExternalLink,
  FiUser,
  FiMapPin,
  FiX,
} from "react-icons/fi";
import { Button, TextInput } from "~/components";
import useUserStore from "~/stores/user.store";
import { useRequest } from "~/hooks";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  adminPassword?: string;
}

const DeveloperDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    address: "",
    adminName: "",
    adminId: "",
    adminEmail: "",
    adminPassword: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      address: "",
      adminName: "",
      adminId: "",
      adminEmail: "",
      adminPassword: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  // Mock Data
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const {
    makeRequest: fetchRestaurants,
    isError: isFetchRestaurantsError,
    isSuccess: isFetchRestaurantsSuccess,
    error: fetchRestaurantsError,
    data: fetchRestaurantsData,
    isLoading: isFetchRestaurantsLoading,
  } = useRequest();

  const loadRestaurants = async () => {
    fetchRestaurants({
      method: "GET",
      url: "/restaurant",
    });
  };

  useEffect(() => {
    loadRestaurants();
  }, []);


  const {
      makeRequest: createRestaurant,
      isError: isCreateRestaurantError,
      isSuccess: isCreateRestaurantSuccess,
      error: createRestaurantError,
      reset: createRestaurantReset,
      validationErrors: createRestaurantValidationErrors,
      data: createRestaurantData,
      isLoading: isCreateRestaurantLoading,
  } = useRequest();

  const {
      makeRequest: updateRestaurant,
      isError: isUpdateRestaurantError,
      isSuccess: isUpdateRestaurantSuccess,
      error: updateRestaurantError,
      reset: updateRestaurantReset,
      validationErrors: updateRestaurantValidationErrors,
      data: updateRestaurantData,
      isLoading: isUpdateRestaurantLoading,
  } = useRequest();

  const {
    makeRequest: logoutRequest,
    isSuccess: isLogoutSuccess,
  } = useRequest();

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (restaurant: Restaurant) => {
    setIsEditing(true);
    setEditId(restaurant.id);

    setFormData({
      name: restaurant.name,
      slug: restaurant.slug,
      address: restaurant.address,
      adminName: restaurant.adminName,
      adminEmail: restaurant.adminEmail,
      adminId: restaurant.adminId,
      adminPassword: restaurant.adminPassword || "",
    });

    setShowModal(true);
  };

  const handleCreate = async () => {
    createRestaurant({
      method: "POST",
      url: "/restaurant/onboard",
      payload: {
        name: formData.name,
        slug: formData.slug,
        address: formData.address,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
      },
    });
  };

  const handleUpdate = async (id: string) => {
    const updateBody: any = {
      name: formData.name,
      slug: formData.slug,
      address: formData.address,
      adminName: formData.adminName,
      adminId: formData.adminId,
      adminEmail: formData.adminEmail,
      adminPassword: formData.adminPassword ? formData.adminPassword : undefined,
    };

    updateRestaurant({
      method: "PUT",
      url: `/restaurant/${id}`, 
      payload: updateBody,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editId) {
      await handleUpdate(editId);
    } else {
      await handleCreate();
    }
  };

  useEffect(() => {
    if (isFetchRestaurantsSuccess && fetchRestaurantsData) {
      setRestaurants(fetchRestaurantsData.data);
    }
  }, [isFetchRestaurantsSuccess, fetchRestaurantsData]);

  useEffect(() => {
    if (( isCreateRestaurantSuccess && createRestaurantData) || (isUpdateRestaurantSuccess && updateRestaurantData)) {
      loadRestaurants();
      setShowModal(false);
      resetForm();
    }
  }, [isCreateRestaurantSuccess, createRestaurantData, isUpdateRestaurantSuccess, updateRestaurantData])

  useEffect(() => {
    if (isFetchRestaurantsError) {
      console.error("Failed to fetch restaurants:", fetchRestaurantsError);
    }
  }, [isFetchRestaurantsError, fetchRestaurantsError]);

  useEffect(() => {
    if (isLogoutSuccess) {
      useUserStore.getState().clearUserData();
      navigate("/login");
    }
  }, [isLogoutSuccess, navigate]);

  useEffect(() => {
    if (isCreateRestaurantError && createRestaurantError) {
      console.error("Failed to create restaurant:", createRestaurantError);
      alert(createRestaurantError?.data?.message || "Failed to create restaurant. Please try again.");
    }
    if (isUpdateRestaurantError && updateRestaurantError) {
      console.error("Failed to update restaurant:", updateRestaurantError);
      alert(updateRestaurantError?.data?.message || "Failed to update restaurant. Please try again.");
    }
  }, [isCreateRestaurantError, createRestaurantError, isUpdateRestaurantError, updateRestaurantError]);

  const handleLogout = async () => {
    await logoutRequest({
      method: "POST",
      url: "/auth/logout",
    });
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
          <div
          >
            <Button
              onClick={openCreateModal}
              text="Onboard New Tenant"
            />
          </div>
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
                  className="text-gray-400 hover:text-blue-600 transition p-1rounded-lg hover:cursor-pointer"
                  title="Edit Restaurant"
                >
                  <FiEdit />
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
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                  createRestaurantReset();
                  updateRestaurantReset();
                }}
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
                      <TextInput
                        placeholder="e.g. Burger King"
                        label="Brand Name"
                        value={formData.name}
                        required
                        error={isEditing ? (updateRestaurantValidationErrors.name) : (createRestaurantValidationErrors.name)}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <TextInput
                        label="Slug"
                        placeholder="e.g. burger-king-jkt"
                        value={formData.slug}
                        required
                        error={isEditing ? (updateRestaurantValidationErrors.slug) : (createRestaurantValidationErrors.slug)}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <TextInput
                        label="Address"
                        placeholder="Full Address..."
                        value={formData.address}
                        error={isEditing ? (updateRestaurantValidationErrors.address) : (createRestaurantValidationErrors.address)}
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4">
                      Admin Account
                    </h4>

                    <div className="space-y-2">
                      <TextInput
                        label="Admin Name"
                        placeholder="Full Name"
                        value={formData.adminName}
                        error={isEditing ? (updateRestaurantValidationErrors.adminName) : (createRestaurantValidationErrors.adminName)}
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, adminName: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <TextInput
                        label="Admin Email"
                        placeholder="admin@brand.com"
                        value={formData.adminEmail}
                        error={isEditing ? (updateRestaurantValidationErrors.adminEmail) : (createRestaurantValidationErrors.adminEmail)}
                        type="email"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, adminEmail: e.target.value })
                        }
                      />

                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <TextInput
                          label="Admin Password"
                          placeholder="••••••••"
                          error={isEditing ? (updateRestaurantValidationErrors.adminPassword) : (createRestaurantValidationErrors.adminPassword)}
                          value={formData.adminPassword}
                          type={"password"}
                          required={!isEditing}
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
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
                  <Button
                    type="submit"
                    disabled={isEditing ? isUpdateRestaurantLoading : isCreateRestaurantLoading}
                    isLoading={isEditing ? isUpdateRestaurantLoading : isCreateRestaurantLoading}
                    text={isEditing ? "Update Tenant" : "Create Tenant"}
                    isLoadingText={isEditing ? "Updating..." : "Creating..."}
                  />
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
