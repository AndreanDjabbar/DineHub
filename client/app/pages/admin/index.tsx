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

// Import Types
import type {
  User,
  Table,
  MenuCategory,
  AddOn,
  AddOnOption,
  MenuItem,
} from "./components/types";
import { UserHeader } from "~/components";
import api from "~/lib/axios";
import EditMenuItemModal from "./components/EditMenuItemModal";
import EditCategoryModal from "./components/EditCategoryModal";

const sortTablesByNumber = (tables: Table[]): Table[] => {
  return [...tables].sort((a, b) => {
    const getNum = (name: string) => Number(name.match(/\d+/)?.[0] ?? 0);

    return getNum(a.name) - getNum(b.name);
  });
};

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const [activeTab, setActiveTab] = useState<"staff" | "tables" | "menu">(
    "staff",
  );
  const user = userString ? JSON.parse(userString) : null;
  const restaurantId = user?.restaurantId;

  // --- MOCK STATE (Replace with API data) ---
  const [users, setUsers] = useState<User[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);

  // --- FORM STATES ---
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });
  const [newTable, setNewTable] = useState({ capacity: 2 });
  const [newCategory, setNewCategory] = useState<MenuCategory>({
    name: "",
    image: "",
  });
  const [newMenuItem, setNewMenuItem] = useState<{
    name: string;
    price: number;
    categoryId: string;
    image: string | null;
    addOns: AddOn[];
  }>({ name: "", price: 0, categoryId: "", image: null, addOns: [] });

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
  const [menuItemErrors, setMenuItemErrors] = useState<{
    name?: string;
    price?: string;
    categoryId?: string;
    image?: string;
    addOns?: string;
  }>({});
  const [addTableErrors, setAddTableErrors] = useState<{ capacity?: string }>(
    {},
  );
  const [updateTableErrors, setUpdateTableErrors] = useState<{
    capacity?: string;
  }>({});

  if (!token || !userString) {
    window.location.href = "/login";
  }

  useEffect(() => {
    const fetchStaff = async () => {
      if (!restaurantId) {
        console.error("No restaurant ID found for user");
        return;
      }
      try {
        const [cashierRes, kitchenRes] = await Promise.all([
          api.get(`/user/cashier/${restaurantId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          api.get(`/user/kitchen/${restaurantId}`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }),
        ]);
        const cashierData = await cashierRes.data;
        const kitchenData = await kitchenRes.data;

        const cashiers = cashierData.data?.cashier || [];
        const kitchenStaff = kitchenData.data?.kitchen || [];

        const allStaff = [...cashiers, ...kitchenStaff];
        setUsers(allStaff);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };
    fetchStaff();
  }, [restaurantId, token]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await api.get(`/restaurant/table/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        const tables = data?.data?.tables || [];
        setTables(tables);
      } catch (error) {
        console.error("Error fetching tables data:", error);
      }
    };
    fetchTables();
  }, [restaurantId, token]);

  const fetchMenu = async () => {
    try {
      const response = await api.get(`/restaurant/full-menu/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Menu response:", response);
      const menu = response.data.data?.menu || [];
      // Ensure each item has the correct categoryId from its parent category
      const categoriesWithIds = menu.map((category: MenuCategory) => ({
        ...category,
        items: (category.items || []).map((item: MenuItem) => ({
          ...item,
          categoryId: item.categoryId || category.id || "",
          addOns: item.addOns || [],
        })),
      }));
      setCategories(categoriesWithIds);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    if (activeTab !== "menu") return;
    fetchMenu();
  }, [restaurantId, token, activeTab]);

  // --- HANDLERS ---
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
    try {
      const response = await api.post("/user/create-staff", {
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      const createdUser = data.data;

      setUsers([
        ...users,
        {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
        },
      ]);

      setNewUser({ name: "", email: "", password: "", role: "cashier" }); // Reset form
      alert("Staff created successfully");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUserEditClick = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setIsEditModalOpen(true);
  };

  const handleTableEditClick = (tableToEdit: Table) => {
    setEditingTable(tableToEdit);
    setIsEditModalOpen(true);
  };

  const handleCategoryEditClick = (categoryToEdit: MenuCategory) => {
    setEditingCategory(categoryToEdit);
    setIsEditModalOpen(true);
  };

  const handleMenuEditClick = (itemToEdit: MenuItem) => {
    // Ensure categoryId is set correctly from the item's category object if needed
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

    try {
      const response = await api.put(
        `/user/update-staff/${editingUser.id}`,
        {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;

      const updatedUser = data?.data?.user;

      setUsers(
        users.map((u) =>
          u.id === updatedUser.id ? { ...u, ...updatedUser } : u,
        ),
      );

      setEditingUser(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setUsers(users.filter((u) => u.id !== id));

    if (!restaurantId) {
      console.error("No restaurant ID found for user");
      return;
    }
    await api.post(
      `/user/delete-staff/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  };

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

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextNumber = getNextTableNumber(tables);
    const tableName = `Table ${nextNumber}`;
    try {
      const response = await api.post(
        "/restaurant/table",
        {
          name: tableName,
          capacity: newTable.capacity,
          restaurantId: restaurantId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;
      const createdTable = data?.data?.table;

      setTables((prev) =>
        sortTablesByNumber([
          ...prev,
          {
            id: createdTable.id,
            name: createdTable.name,
            capacity: createdTable.capacity,
          },
        ]),
      );

      setActiveTable(createdTable);

      setNewTable({ capacity: 2 });
      setAddTableErrors({});
      alert("Table added successfully");
    } catch (error: any) {
      console.error("Error adding table:", error);
      const apiError = error?.data;

      if (apiError?.validation_errors) {
        const fieldErrors: Record<string, string> = {};

        apiError.validation_errors.forEach((msg: string) => {
          if (msg.toLowerCase().includes("capacity")) {
            fieldErrors.capacity = msg;
          }
        });

        setAddTableErrors(fieldErrors);
      }
    }
  };

  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;

    try {
      const response = await api.put(
        `/restaurant/table/${editingTable.id}`,
        {
          name: editingTable.name,
          capacity: editingTable.capacity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;
      const updatedTable = data.data.table;

      setTables((prev) =>
        sortTablesByNumber(
          prev.map((t) =>
            t.id === updatedTable.id ? { ...t, ...updatedTable } : t,
          ),
        ),
      );

      setEditingTable(null);
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error("Error updating table:", error);

      console.error("Error adding table:", error);
      const apiError = error?.data;

      if (apiError?.validation_errors) {
        const fieldErrors: Record<string, string> = {};

        apiError.validation_errors.forEach((msg: string) => {
          if (msg.toLowerCase().includes("capacity")) {
            fieldErrors.capacity = msg;
          }
        });

        setUpdateTableErrors(fieldErrors);
      }
    }
  };

  const handleDeleteTable = async (id: number) => {
    setTables(tables.filter((t) => t.id !== id));

    if (!restaurantId) {
      console.error("No restaurant ID found for user");
      return;
    }
    await api.delete(`/restaurant/table/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/restaurant/category",
        {
          name: newCategory.name,
          image: newCategory.image,
          restaurantId: restaurantId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;
      const createdCategory = data?.data?.category;
      setCategories((prev) => [...prev, { ...createdCategory, items: [] }]);
      setNewCategory({ name: "", image: "" });
      alert("Category added successfully");
    } catch (error: any) {
      const apiError = error?.data;

      if (apiError?.validation_errors) {
        const fieldErrors: Record<string, string> = {};

        apiError.validation_errors.forEach((msg: string) => {
          if (msg.includes("name")) fieldErrors.name = msg;
          if (msg.includes("image")) fieldErrors.image = msg;
        });

        setCategoryErrors(fieldErrors);
      }
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const response = await api.put(
        `/restaurant/category/${editingCategory.id}`,
        {
          name: editingCategory.name,
          image: editingCategory.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;
      const updatedCategory = data.data.category;

      setCategories((prev) =>
        prev.map((c) =>
          c.id === updatedCategory.id ? { ...c, ...updatedCategory } : c,
        ),
      );

      setEditingCategory(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.delete(`/restaurant/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/restaurant/item",
        {
          name: newMenuItem.name,
          price: newMenuItem.price,
          categoryId: newMenuItem.categoryId,
          image: newMenuItem.image,
          addOns: newMenuItem.addOns,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;
      const createdItem = data?.data?.menuItem;

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === createdItem.categoryId
            ? { ...cat, items: [...(cat?.items || []), createdItem] }
            : cat,
        ),
      );

      await fetchMenu();

      setNewMenuItem({
        name: "",
        price: 0,
        categoryId: "",
        image: null,
        addOns: [],
      });
      setNewAddOn({ name: "", minSelect: 0, maxSelect: 1, options: [] });
      alert("Menu item added successfully");
    } catch (error: any) {
      console.error("Error adding menu item:", error);

      const apiError = error?.data || error?.response?.data;

      if (apiError?.validation_errors) {
        const fieldErrors: Record<string, string> = {};

        apiError.validation_errors.forEach((msg: string) => {
          const lower = msg.toLowerCase();

          if (lower.includes("name")) fieldErrors.name = msg;
          else if (lower.includes("price")) fieldErrors.price = msg;
          else if (lower.includes("category")) fieldErrors.categoryId = msg;
          else if (lower.includes("image")) fieldErrors.image = msg;
          else if (lower.includes("addon")) fieldErrors.addOns = msg;
        });

        setMenuItemErrors(fieldErrors);
      }
    }
  };

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

    try {
      const response = await api.put(
        `/menu/items/${editingMenuItem.id}`,
        {
          name: editingMenuItem.name,
          price: editingMenuItem.price,
          categoryId: editingMenuItem.categoryId,
          image: editingMenuItem.image,
          addOns: editingMenuItem.addOns,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;
      const updatedItem = data.data.menuItem;

      setCategories((prev) =>
        prev.map((c) =>
          c.id === updatedItem.categoryId
            ? {
                ...c,
                items: (c.items || []).map((i) =>
                  i.id === updatedItem.id ? { ...i, ...updatedItem } : i,
                ),
              }
            : c,
        ),
      );

      setEditingMenuItem(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await api.delete(`/restaurant/item/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state to remove the deleted item from all categories
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          items: (cat.items || []).filter((item) => item.id !== id),
        })),
      );
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
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
                onTableSelect={setActiveTable}
                addTableErrors={addTableErrors}
                setAddTableErrors={setAddTableErrors}
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
                handleDeleteMenuItem={handleDeleteMenuItem}
                handleMenuEditClick={handleMenuEditClick}
                handleCategoryEditClick={handleCategoryEditClick}
                categoryErrors={categoryErrors}
                setCategoryErrors={setCategoryErrors}
                menuItemErrors={menuItemErrors}
                setMenuItemErrors={setMenuItemErrors}
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
            />

            <EditTableModal
              isOpen={isEditModalOpen && !!editingTable}
              editingTable={editingTable}
              setEditingTable={setEditingTable}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingTable(null);
              }}
              onUpdate={handleUpdateTable}
              updateTableErrors={updateTableErrors}
              setUpdateTableErrors={setUpdateTableErrors}
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
              onUpdate={handleUpdateCategory}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
