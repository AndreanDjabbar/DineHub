import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FiLogOut, FiUserPlus, FiLayers, FiBookOpen, FiUser } from "react-icons/fi";
// Import Components
import { 
  StatsGrid,
  StaffManagement,
  TableManagement,
  MenuManagement,
  EditUserModal,
  EditTableModal 
} from "./components";

// Import Types
import type {
  User,
  Table,
  MenuCategory,
  AddOn,
  AddOnOption,
} from "./components/types";
import { UserHeader } from "~/components";
import api from "~/lib/axios";

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
    "staff"
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

  if (!token || !userString) {
    window.location.href = "/login";
  }

  useEffect(() => {
    const fetchStaff = async () => {
      console.log("Fetching staff...");
      console.log("Restaurant ID:", restaurantId);
      console.log("Token:", token);
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
            }
          }) 
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
      console.log("Fetching tables...");
      try {
        const response = await api.get(`/restaurant/tables/${restaurantId}`, {
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

  useEffect(() => {
    const fetchCategories = async () => {
      if (activeTab !== "menu") return;
      try {
        const response = await api.get(`/menu/categories/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log("Fetching categories...");
        console.log("Response:", response);
        const categories = response.data.data?.categories || [];
        console.log("Categories:", categories);
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
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
      })

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

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      const response = await api.put(`/user/update-staff/${editingUser.id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = response.data;

      const updatedUser = data?.data?.user;

      setUsers(
        users.map((u) =>
          u.id === updatedUser.id ? { ...u, ...updatedUser } : u
        )
      );

      setEditingUser(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async(id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    console.log("Deleting user with ID:", id);

    if (!restaurantId) {
      console.error("No restaurant ID found for user");
      return;
    }
    await api.post(`/user/delete-staff/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
      const response = await api.post("/restaurant/tables", {
        name: tableName,
        capacity: newTable.capacity,
        restaurantId: restaurantId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        ])
      );

      setActiveTable(createdTable);

      setNewTable({ capacity: 2 });
      alert("Table added successfully");
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };

  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;

    try {
      const response = await api.put(
        `/restaurant/tables/${editingTable.id}`, {
          name: editingTable.name,
          capacity: editingTable.capacity,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })

      const data = response.data;
      const updatedTable = data.data.table;

      setTables((prev) =>
        sortTablesByNumber(
          prev.map((t) =>
            t.id === updatedTable.id ? { ...t, ...updatedTable } : t
          )
        )
      );

      setEditingTable(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating table:", error);
    }
  };

  const handleDeleteTable = async (id: number) => {
    setTables(tables.filter((t) => t.id !== id));
    console.log("Deleting table with ID:", id);

    if (!restaurantId) {
      console.error("No restaurant ID found for user");
      return;
    }
    await api.delete(`/restaurant/tables/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/menu/categories", {
        name: newCategory.name,
        image: newCategory.image,
        restaurantId: restaurantId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      const data = response.data;
      const createdCategory = data?.data?.category;
      setCategories([...categories, { ...createdCategory, items: [] }]);
      setNewCategory({ name: "", image: "" });
      alert("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/menu/items", {
        name: newMenuItem.name,
        price: newMenuItem.price,
        categoryId: newMenuItem.categoryId,
        image: newMenuItem.image,
        addOns: newMenuItem.addOns,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      const data = response.data;
      const createdItem = data?.data?.menuItem;

      setCategories(
        categories.map((cat) =>
          cat.id === createdItem.categoryId
            ? { ...cat, items: [...(cat?.items || []), createdItem] }
            : cat
        )
      );

      setNewMenuItem({
        name: "",
        price: 0,
        categoryId: "",
        image: null,
        addOns: [],
      });
      setNewAddOn({ name: "", minSelect: 0, maxSelect: 1, options: [] });
      alert("Menu item added successfully");
    } catch (error) {
      console.error("Error adding menu item:", error);
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

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will delete all items in this category."))
      return;
    try {
      await api.delete(`/menu/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDeleteMenuItem = async (id: string, categoryId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/menu/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: cat?.items?.filter((i) => i.id !== id) }
            : cat
        )
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
              <FiLayers size={25}/> Table Management
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`py-4 px-2 text-sm font-bold flex flex-1 flex-col items-center justify-center gap-2 transition hover:cursor-pointer ${activeTab === "menu" ? "bg-red-50 text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <FiBookOpen size={25}/> Menu Management
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
              />
            )}

            <EditUserModal
              isOpen={isEditModalOpen && !!editingUser}
              editingUser={editingUser}
              setEditingUser={setEditingUser as any}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingUser(null);
              }}
              onUpdate={handleUpdateUser}
            />

            <EditTableModal
              isOpen={isEditModalOpen && !!editingTable}
              editingTable={editingTable}
              setEditingTable={setEditingTable as any}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingTable(null);
              }}
              onUpdate={handleUpdateTable}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
