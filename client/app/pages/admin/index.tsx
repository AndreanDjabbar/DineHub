import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FiLogOut, FiUserPlus, FiLayers, FiBookOpen } from "react-icons/fi";

// Import Components
import StatsGrid from "./components/StatsGrid";
import StaffManagement from "./components/StaffManagement";
import TableManagement from "./components/TableManagement";
import MenuManagement from "./components/MenuManagement";
import EditUserModal from "./components/EditUserModal";
import EditTableModal from "./components/EditTableModal";

// Import Types
import type {
  User,
  Table,
  MenuCategory,
  AddOn,
  AddOnOption,
} from "./components/types";

const sortTablesByNumber = (tables: Table[]): Table[] => {
  return [...tables].sort((a, b) => {
    const getNum = (name: string) => Number(name.match(/\d+/)?.[0] ?? 0);

    return getNum(a.name) - getNum(b.name);
  });
};

const AdminDashboard: React.FC = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const navigate = useNavigate();
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
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [newMenuItem, setNewMenuItem] = useState<{
    name: string;
    price: number;
    categoryId: string;
    addOns: AddOn[];
  }>({ name: "", price: 0, categoryId: "", addOns: [] });

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
          fetch(
            `http://localhost:4000/dinehub/api/user/cashier/${restaurantId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(
            `http://localhost:4000/dinehub/api/user/kitchen/${restaurantId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);
        if (!cashierRes.ok || !kitchenRes.ok) {
          console.error("Failed to fetch staff data");
          return;
        }
        const cashierData = await cashierRes.json();
        const kitchenData = await kitchenRes.json();
        const cashiers = cashierData.data || [];
        const kitchenStaff = kitchenData.data || [];

        const allStaff = [...cashiers, ...kitchenStaff];
        console.log("All Staff: ", allStaff);
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
        const response = await fetch(
          `http://localhost:4000/dinehub/api/restaurant/tables/${restaurantId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          console.error("Failed to fetch tables data");
          return;
        }
        const data = await response.json();
        const tables = data.data || [];
        console.log("All Tables: ", tables);
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
      console.log("Fetching categories...");
      try {
        const response = await fetch(
          `http://localhost:4000/dinehub/api/menu/categories/${restaurantId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          console.error("Failed to fetch categories");
          return;
        }
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [restaurantId, token, activeTab]);

  // --- HANDLERS ---
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
        console.error("Logout error:", error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

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
      const response = await fetch(
        "http://localhost:4000/dinehub/api/user/create-staff",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create staff");
      }

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
      const response = await fetch(
        `http://localhost:4000/dinehub/api/user/update-staff/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update staff");
      }

      const updatedUser = data.data;

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

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    console.log("Deleting user with ID:", id);

    if (!restaurantId) {
      console.error("No restaurant ID found for user");
      return;
    }
    fetch(`http://localhost:4000/dinehub/api/user/delete-staff/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      const response = await fetch(
        "http://localhost:4000/dinehub/api/restaurant/tables ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: tableName,
            capacity: newTable.capacity,
            restaurantId: restaurantId,
          }),
        }
      );

      const data = await response.json();
      console.log("Data:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to create table");
      }
      const createdTable = data.data;

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

      setNewTable({ capacity: 2 }); // Reset form
      alert("Table added successfully");
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };

  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;

    try {
      const response = await fetch(
        `http://localhost:4000/dinehub/api/restaurant/tables/${editingTable.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingTable.name,
            capacity: editingTable.capacity,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update table");
      }

      const updatedTable = data.data;

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

  const handleDeleteTable = (id: number) => {
    setTables(tables.filter((t) => t.id !== id));
    console.log("Deleting table with ID:", id);

    if (!restaurantId) {
      console.error("No restaurant ID found for user");
      return;
    }
    fetch(`http://localhost:4000/dinehub/api/restaurant/tables/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:4000/dinehub/api/menu/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newCategory.name,
            restaurantId: restaurantId,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }
      const createdCategory = data.data;
      setCategories([...categories, { ...createdCategory, items: [] }]);
      setNewCategory({ name: "" });
      alert("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:4000/dinehub/api/menu/items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newMenuItem.name,
            price: newMenuItem.price,
            categoryId: newMenuItem.categoryId,
            addOns: newMenuItem.addOns,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create menu item");
      }
      const createdItem = data.data;

      setCategories(
        categories.map((cat) =>
          cat.id === createdItem.categoryId
            ? { ...cat, items: [...cat.items, createdItem] }
            : cat
        )
      );

      setNewMenuItem({ name: "", price: 0, categoryId: "", addOns: [] });
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
      await fetch(`http://localhost:4000/dinehub/api/menu/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
      await fetch(`http://localhost:4000/dinehub/api/menu/items/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: cat.items.filter((i) => i.id !== id) }
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
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-red-600">DineHub Admin</h1>
        <span>{user.email}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition"
        >
          <FiLogOut /> Logout
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

        {/* Stats Grid */}
        <StatsGrid users={users} tables={tables} />

        {/* Management Area - Tabbed Interface */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === "staff" ? "bg-red-50 text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <FiUserPlus /> Staff Management
            </button>
            <button
              onClick={() => setActiveTab("tables")}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === "tables" ? "bg-red-50 text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <FiLayers /> Table Management
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === "menu" ? "bg-red-50 text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <FiBookOpen /> Menu Management
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
