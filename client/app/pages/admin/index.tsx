import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FiLogOut,
  FiUserPlus,
  FiLayers,
  FiBookOpen,
  FiUser,
} from "react-icons/fi";
// Import Components
import {
  StatsGrid,
  StaffManagement,
  TableManagement,
  MenuManagement,
  EditUserModal,
  EditTableModal,
} from "./components";

import type {
  User,
  Table,
  MenuCategory,
  AddOn,
  AddOnOption,
  MenuItem,
} from "./components/types";
import { UserHeader } from "~/components";
import EditMenuItemModal from "./components/EditMenuItemModal";
import EditCategoryModal from "./components/EditCategoryModal";
import { useUserStore } from "~/stores";
import { useRequest } from "~/hooks";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"staff" | "tables" | "menu">(
    "staff",
  );
  const userData = useUserStore((state) => state.userData);
  const restaurantId = userData?.restaurantId;

  // --- MOCK STATE (Replace with API data) ---
  const [users, setUsers] = useState<User[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [nextTableNumber, setNextTableNumber] = useState<number>(1);
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);

  const getNextTableNumber = (tables: Table[]) => {
    const numbers = tables
      .map((t) => {
        const match = t.name?.match(/\d+/);
        return match ? Number(match[0]) : null;
      })
      .filter((n): n is number => n !== null)
      .sort((a, b) => a - b);

    let next = 1;
    for (const n of numbers) {
      if (n === next) next++;
      else if (n > next) break;
    }

    return next;
  };

  // --- FORM STATES ---
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });
  const [newTable, setNewTable] = useState({ 
    name: `Table ${nextTableNumber}`,
    capacity: 2 
  });
  const [newCategory, setNewCategory] = useState<MenuCategory>({
    name: "",
    image: "",
  });
  const [newMenuItem, setNewMenuItem] = useState<{
    name: string;
    price: number;
    categoryId: string;
    image: string;
    addOns: AddOn[];
  }>({ name: "", price: 0, categoryId: "", image: "", addOns: [] });

  const [newAddOn, setNewAddOn] = useState<AddOn>({
    name: "",
    minSelect: 0,
    maxSelect: 1,
    options: [],
  });
  const [newAddOnOption, setNewAddOnOption] = useState<AddOnOption>({
    name: "",
    price: 0,
  });

  // Staff operations
  const { 
    makeRequest: fetchCashierRequest, 
    data: cashierData, 
    isSuccess: isCashierSuccess 
  } = useRequest();
  const { 
    makeRequest: fetchKitchenRequest, 
    data: kitchenData, 
    isSuccess: isKitchenSuccess 
  } = useRequest();
  const { 
    makeRequest: addUserRequest, 
    isSuccess: isAddUserSuccess, 
    isLoading: isAddUserRequest,
    isError: isAddUserError, 
    error: addUserError, 
    validationErrors: addUserValidationErrors 
  } = useRequest();
  const { 
    makeRequest: updateUserRequest, 
    isSuccess: isUpdateUserSuccess, 
    isError: isUpdateUserError, 
    error: updateUserError, 
    validationErrors: updateUserValidationErrors 
  } = useRequest();
  const { 
    makeRequest: deleteUserRequest 
  } = useRequest();

  // Table operations
  const { 
    makeRequest: fetchTablesRequest, 
    data: tablesData, 
    isSuccess: isTablesSuccess 
  } = useRequest();
  const { 
    makeRequest: addTableRequest, 
    isSuccess: isAddTableSuccess, 
    isError: isAddTableError, 
    error: addTableError, 
    isLoading: isAddTableRequest,
    validationErrors: addTableValidationErrors 
  } = useRequest();
  const { 
    makeRequest: updateTableRequest, 
    isSuccess: isUpdateTableSuccess, 
    isError: isUpdateTableError, 
    isLoading: isEditTableLoading,
    error: updateTableError, 
    validationErrors: updateTableValidationErrors 
  } = useRequest();
  const { makeRequest: deleteTableRequest } = useRequest();

  // Menu operations
  const { 
    makeRequest: fetchMenuRequest, 
    data: menuData, 
    isSuccess: isMenuSuccess 
  } = useRequest();
  const { 
    makeRequest: addCategoryRequest, 
    isSuccess: isAddCategorySuccess, 
    isError: isAddCategoryError, 
    isLoading: isAddCategoryLoading,
    error: addCategoryError, 
    validationErrors: addCategoryValidationErrors 
  } = useRequest();
  const { 
    makeRequest: updateCategoryRequest, 
    isSuccess: isUpdateCategorySuccess,
    isError: isUpdateCategoryError,
    error: updateCategoryError,
    isLoading: isUpdateCategoryLoading,
    validationErrors: updateCategoryValidationErrors,
  } = useRequest();
  const { 
    makeRequest: deleteCategoryRequest 
  } = useRequest();
  const { 
    makeRequest: addMenuItemRequest, 
    isSuccess: isAddMenuItemSuccess, 
    isError: isAddMenuItemError, 
    isLoading: isAddMenuItemLoading,
    error: addMenuItemError, 
    validationErrors: addMenuItemValidationErrors 
  } = useRequest();
  const { 
    makeRequest: updateMenuItemRequest, 
    isSuccess: isUpdateMenuItemSuccess,
    isError: isUpdateMenuItemError,
    error: updateMenuItemError,
    validationErrors: updateMenuItemValidationErrors,
  } = useRequest();
  const { 
    makeRequest: deleteMenuItemRequest,
  } = useRequest();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null,
  );
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [categoryErrors, setCategoryErrors] = useState<Record<string, string>>(
    {},
  );
  const [updateUserErrors, setUpdateUserErrors] = useState<
    Record<string, string>
  >({});
  const [addTableErrors, setAddTableErrors] = useState<{ capacity?: string }>(
    {},
  );
  const [updateTableErrors, setUpdateTableErrors] = useState<{
    capacity?: string;
  }>({});

  useEffect(() => {
    const fetchStaff = async () => {
      if (!restaurantId) {
        console.error("No restaurant ID found for user");
        return;
      }
      await fetchCashierRequest({
        method: "GET",
        url: `http://localhost:4000/dinehub/api/user/cashier/${restaurantId}`,
      });
      await fetchKitchenRequest({
        method: "GET",
        url: `http://localhost:4000/dinehub/api/user/kitchen/${restaurantId}`,
      });
    };
    fetchStaff();
  }, [restaurantId]);

  useEffect(() => {
    if (isCashierSuccess && isKitchenSuccess && cashierData && kitchenData) {
      const cashiers = cashierData?.data?.cashier || [];
      const kitchenStaff = kitchenData?.data?.kitchen || [];
      const allStaff = [...cashiers, ...kitchenStaff];
      setUsers(allStaff);
    }
  }, [isCashierSuccess, isKitchenSuccess, cashierData, kitchenData]);

  useEffect(() => {
    const fetchTables = async () => {
      if (!restaurantId) return;
      await fetchTablesRequest({
        method: "GET",
        url: `http://localhost:4000/dinehub/api/restaurant/table/restaurant/${restaurantId}`,
      });
    };
    fetchTables();
  }, [restaurantId]);

  useEffect(() => {
    if (isTablesSuccess && tablesData) {
      const fetchedTables = tablesData?.data?.tables || [];
      setTables(fetchedTables);
      setNextTableNumber(getNextTableNumber(fetchedTables));
    }
  }, [isTablesSuccess, tablesData]);

  useEffect(() => {
    const newNextTableNumber = getNextTableNumber(tables);
    setNextTableNumber(newNextTableNumber);
    setNewTable({ 
      name: `Table ${newNextTableNumber}`,
      capacity: 2 
    });
  }, [tables]);

  const fetchMenu = async () => {
    await fetchMenuRequest({
      method: "GET",
      url: `http://localhost:4000/dinehub/api/restaurant/full-menu/${restaurantId}`,
    });
  };

  useEffect(() => {
    if (isMenuSuccess && menuData) {
      const menu = menuData?.data?.menu || [];
      const categoriesWithIds = menu.map((category: MenuCategory) => ({
        ...category,
        items: (category.items || []).map((item: MenuItem) => ({
          ...item,
          categoryId: item.categoryId || category.id || "",
          addOns: item.addOns || [],
        })),
      }));
      setCategories(categoriesWithIds);
    }
  }, [isMenuSuccess, menuData]);

  useEffect(() => {
    if (activeTab !== "menu") return;
    fetchMenu();
  }, [restaurantId, activeTab]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) {
      console.error("No restaurant ID found for user");
      return;
    }
    const payload = {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role.toUpperCase(),
      restaurantId: restaurantId,
    };
    
    await addUserRequest({
      method: "POST",
      url: "http://localhost:4000/dinehub/api/user/create-staff",
      payload: payload,
    });
  };

  useEffect(() => {
    if (isAddUserSuccess) {
      const fetchStaff = async () => {
        await fetchCashierRequest({
          method: "GET",
          url: `http://localhost:4000/dinehub/api/user/cashier/${restaurantId}`,
        });
        await fetchKitchenRequest({
          method: "GET",
          url: `http://localhost:4000/dinehub/api/user/kitchen/${restaurantId}`,
        });
      };
      fetchStaff();
      setNewUser({ name: "", email: "", password: "", role: "cashier" });
      alert("Staff created successfully");
    }
  }, [isAddUserSuccess]);


  const handleUserEditClick = (userToEdit: User) => {
    setUpdateUserErrors({});
    setEditingUser(userToEdit);
    setIsEditModalOpen(true);
  };

  const handleTableEditClick = (tableToEdit: Table) => {
    setAddTableErrors({});
    setUpdateTableErrors({});
    setEditingTable(tableToEdit);
    setIsEditModalOpen(true);
  };

  const handleCategoryEditClick = (categoryToEdit: MenuCategory) => {
    setCategoryErrors({});
    setEditingCategory(categoryToEdit);
    setIsEditModalOpen(true);
  };

  const handleMenuEditClick = (itemToEdit: MenuItem) => {
    const itemWithCategoryId = {
      ...itemToEdit,
      categoryId:
        itemToEdit.categoryId || (itemToEdit as any).category?.id || "",
    };
    setEditingMenuItem(itemWithCategoryId);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    await updateUserRequest({
      method: "PUT",
      url: `http://localhost:4000/dinehub/api/user/update-staff/${editingUser.id}`,
      payload: {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      },
    });
  };

  useEffect(() => {
    if (isUpdateUserSuccess) {
      const fetchStaff = async () => {
        await fetchCashierRequest({
          method: "GET",
          url: `http://localhost:4000/dinehub/api/user/cashier/${restaurantId}`,
        });
        await fetchKitchenRequest({
          method: "GET",
          url: `http://localhost:4000/dinehub/api/user/kitchen/${restaurantId}`,
        });
      };
      fetchStaff();
      setEditingUser(null);
      setIsEditModalOpen(false);
    }
  }, [isUpdateUserSuccess]);

  useEffect(() => {
    if (isUpdateUserError && updateUserValidationErrors) {
      const fieldErrors: Record<string, string> = {};
      Object.entries(updateUserValidationErrors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });
      setUpdateUserErrors(fieldErrors);
    }
  }, [isUpdateUserError, updateUserValidationErrors]);

  const handleDeleteUser = async (id: string) => {
    if (!restaurantId) {
      console.error("No restaurant ID found for user");
      return;
    }
    await deleteUserRequest({
      method: "POST",
      url: `http://localhost:4000/dinehub/api/user/delete-staff/${id}`,
    });
    await fetchCashierRequest({
      method: "GET",
      url: `http://localhost:4000/dinehub/api/user/cashier/${restaurantId}`,
    });
    await fetchKitchenRequest({
      method: "GET",
      url: `http://localhost:4000/dinehub/api/user/kitchen/${restaurantId}`,
    });
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTableRequest({
      method: "POST",
      url: "http://localhost:4000/dinehub/api/restaurant/table",
      payload: {
        name: newTable.name,
        capacity: newTable.capacity,
        restaurantId: restaurantId,
      },
    });
  };

  useEffect(() => {
    if (isAddTableSuccess) {
      const refetchTables = async () => {
        await fetchTablesRequest({
          method: "GET",
          url: `http://localhost:4000/dinehub/api/restaurant/table/restaurant/${restaurantId}`,
        });
      };
      refetchTables();
      setAddTableErrors({});
      alert("Table added successfully");
    }
  }, [isAddTableSuccess]);

  useEffect(() => {
    if (isAddTableError && addTableValidationErrors) {
      const fieldErrors: Record<string, string> = {};
      Object.entries(addTableValidationErrors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });
      setAddTableErrors(fieldErrors);
    }
  }, [isAddTableError, addTableValidationErrors]);

  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;

    await updateTableRequest({
      method: "PUT",
      url: `http://localhost:4000/dinehub/api/restaurant/table/${editingTable.id}`,
      payload: {
        name: editingTable.name,
        capacity: editingTable.capacity,
      },
    });
  };

  useEffect(() => {
    if (isUpdateTableSuccess) {
      const refetchTables = async () => {
        await fetchTablesRequest({
          method: "GET",
          url: `http://localhost:4000/dinehub/api/restaurant/table/${restaurantId}`,
        });
      };
      refetchTables();
      setEditingTable(null);
      setIsEditModalOpen(false);
    }
  }, [isUpdateTableSuccess]);

  useEffect(() => {
    if (isUpdateTableError && updateTableValidationErrors) {
      const fieldErrors: Record<string, string> = {};
      Object.entries(updateTableValidationErrors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });
      setUpdateTableErrors(fieldErrors);
    }
  }, [isUpdateTableError, updateTableValidationErrors]);

  const handleDeleteTable = async (id: number) => {
    if (!restaurantId) {
      console.error("No restaurant ID found for user");
      return;
    }
    await deleteTableRequest({
      method: "DELETE",
      url: `http://localhost:4000/dinehub/api/restaurant/table/${id}`,
    });
    await fetchTablesRequest({
      method: "GET",
      url: `http://localhost:4000/dinehub/api/restaurant/table/${restaurantId}`,
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCategoryRequest({
      method: "POST",
      url: "http://localhost:4000/dinehub/api/restaurant/category",
      payload: {
        name: newCategory.name,
        image: newCategory.image,
        restaurantId: restaurantId,
      },
    });
  };

  useEffect(() => {
    if (isAddCategorySuccess) {
      fetchMenu();
      setNewCategory({ name: "", image: "" });
      alert("Category added successfully");
    }
  }, [isAddCategorySuccess]);

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    await updateCategoryRequest({
      method: "PUT",
      url: `http://localhost:4000/dinehub/api/restaurant/category/${editingCategory.id}`,
      payload: {
        name: editingCategory.name,
        image: editingCategory.image,
      },
    });
  };

  useEffect(() => {
    if (isUpdateCategorySuccess) {
      fetchMenu();
      setEditingCategory(null);
      setIsEditModalOpen(false);
    }
  }, [isUpdateCategorySuccess]);

  const handleDeleteCategory = async (id: string) => {
    await deleteCategoryRequest({
      method: "DELETE",
      url: `http://localhost:4000/dinehub/api/restaurant/category/${id}`,
    });
    fetchMenu();
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMenuItemRequest({
      method: "POST",
      url: "http://localhost:4000/dinehub/api/restaurant/item",
      payload: {
        name: newMenuItem.name,
        price: newMenuItem.price,
        categoryId: newMenuItem.categoryId,
        image: newMenuItem.image,
        addOns: newMenuItem.addOns,
      },
    });
  };

  useEffect(() => {
    if (isAddMenuItemSuccess) {
      fetchMenu();
      setNewMenuItem({
        name: "",
        price: 0,
        categoryId: "",
        image: "",
        addOns: [],
      });
      setNewAddOn({ name: "", minSelect: 0, maxSelect: 1, options: [] });
      alert("Menu item added successfully");
    }
  }, [isAddMenuItemSuccess]);

  const handleAddAddOnToItem = () => {
    if (!newAddOn.name) return;
    setNewMenuItem({
      ...newMenuItem,
      addOns: [...newMenuItem.addOns, { ...newAddOn }],
    });
    setNewAddOn({ name: "", minSelect: 0, maxSelect: 1, options: [] });
  };

  const handleAddOptionToAddOn = () => {
    if (!newAddOnOption.name) return;
    setNewAddOn({
      ...newAddOn,
      options: [...newAddOn.options, { ...newAddOnOption }],
    });
    setNewAddOnOption({ name: "", price: 0 });
  };

  const handleUpdateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuItem) return;

    await updateMenuItemRequest({
      method: "PUT",
      url: `http://localhost:4000/dinehub/api/menu/items/${editingMenuItem.id}`,
      payload: {
        name: editingMenuItem.name,
        price: editingMenuItem.price,
        categoryId: editingMenuItem.categoryId,
        image: editingMenuItem.image,
        addOns: editingMenuItem.addOns,
      },
    });
  };

  useEffect(() => {
    if (isUpdateMenuItemSuccess) {
      fetchMenu();
      setEditingMenuItem(null);
      setIsEditModalOpen(false);
    }
  }, [isUpdateMenuItemSuccess]);

  const handleDeleteMenuItem = async (id: string) => {
    await deleteMenuItemRequest({
      method: "DELETE",
      url: `http://localhost:4000/dinehub/api/restaurant/item/${id}`,
    });
    fetchMenu();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <UserHeader />

      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

        {/* Stats Grid */}
        <StatsGrid users={users} tables={tables} />

        {/* Management Area - Tabbed Interface */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 justify-between">
            <button
              onClick={() => setActiveTab("staff")}
              className={`py-4 px-2 text-sm font-bold flex flex-1 flex-col items-center justify-center gap-2 transition hover:cursor-pointer ${activeTab === "staff" ? "bg-red-50 text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <FiUserPlus size={25} /> Staff Management
            </button>
            <button
              onClick={() => setActiveTab("tables")}
              className={`py-4 px-2 text-sm font-bold flex flex-1 flex-col items-center justify-center gap-2 transition hover:cursor-pointer ${activeTab === "tables" ? "bg-red-50 text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <FiLayers size={25} /> Table Management
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`py-4 px-2 text-sm font-bold flex flex-1 flex-col items-center justify-center gap-2 transition hover:cursor-pointer ${activeTab === "menu" ? "bg-red-50 text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <FiBookOpen size={25} /> Menu Management
            </button>
          </div>

          <div className="p-8">
            {/* === STAFF MANAGEMENT TAB === */}
            {activeTab === "staff" && (
              <StaffManagement
                users={users}
                newUser={newUser}
                setNewUser={setNewUser}
                isAddUserLoading={isAddUserRequest}
                validationErrors={addUserValidationErrors}
                handleAddUser={handleAddUser}
                handleUserEditClick={handleUserEditClick}
                handleDeleteUser={handleDeleteUser}
              />
            )}

            {/* === TABLE MANAGEMENT TAB === */}
            {activeTab === "tables" && (
              <TableManagement
                tables={tables}
                newTable={newTable}
                setNewTable={setNewTable}
                handleAddTable={handleAddTable}
                handleTableEditClick={handleTableEditClick}
                handleDeleteTable={handleDeleteTable}
                activeTable={activeTable}
                isAddTableLoading={isAddTableRequest}
                onTableSelect={setActiveTable}
              />
            )}

            {/* === MENU MANAGEMENT TAB === */}
            {activeTab === "menu" && (
              <MenuManagement
                categories={categories}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                handleAddCategory={handleAddCategory}
                newMenuItem={newMenuItem}
                setNewMenuItem={setNewMenuItem}
                handleAddMenuItem={handleAddMenuItem}
                newAddOn={newAddOn}
                setNewAddOn={setNewAddOn}
                newAddOnOption={newAddOnOption}
                setNewAddOnOption={setNewAddOnOption}
                handleAddAddOnToItem={handleAddAddOnToItem}
                handleAddOptionToAddOn={handleAddOptionToAddOn}
                handleDeleteCategory={handleDeleteCategory}
                handleMenuEditClick={handleMenuEditClick}
                handleCategoryEditClick={handleCategoryEditClick}
                addCategoryValidationErrors={addCategoryValidationErrors}
                addMenuItemValidationErrors={addMenuItemValidationErrors}
                isAddCategoryLoading={isAddCategoryLoading}
                isAddMenuItemLoading={isAddMenuItemLoading}
              />
            )}

            <EditUserModal
              isOpen={isEditModalOpen && !!editingUser}
              editingUser={editingUser}
              setEditingUser={setEditingUser}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingUser(null);
              }}
              onUpdate={handleUpdateUser}
              updateUserValidationErrors={updateUserValidationErrors}
            />

            <EditTableModal
              isOpen={isEditModalOpen && !!editingTable}
              editingTable={editingTable}
              setEditingTable={setEditingTable}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingTable(null);
              }}
              isEditTableLoading={isEditTableLoading}
              onUpdate={handleUpdateTable}
              updateTableValidationErrors={updateTableValidationErrors}
            />

            <EditMenuItemModal
              isOpen={isEditModalOpen && !!editingMenuItem}
              onDelete={handleDeleteMenuItem}
              editingMenuItem={editingMenuItem}
              setEditingMenuItem={setEditingMenuItem}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingMenuItem(null);
              }}
              updateMenuItemValidationErrors={updateMenuItemValidationErrors}
              onUpdate={handleUpdateMenuItem}
              categories={categories}
            />

            <EditCategoryModal
              isOpen={isEditModalOpen && !!editingCategory}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingCategory(null);
              }}
              updateCategoryValidationErrors={updateCategoryValidationErrors}
              onUpdate={handleUpdateCategory}
              isEditCategoryLoading={isUpdateCategoryLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
