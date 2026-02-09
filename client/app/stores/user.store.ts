import { create } from "zustand";
import api from "~/lib/axios";

interface UserStore {
    userID: string | null;
    setUserID: (id: string | null) => void;
    name: string | null;
    setName: (name: string | null) => void;
    role: string | null;
    setRole: (role: string | null) => void;
    email: string | null;
    setEmail: (email: string | null) => void;
    loadUserData: () => Promise<void>;
    clearUserData: () => void;
    userData: User | null;
}

interface User {
    userID: string;
    name: string;
    role: string;
    email: string;
    restaurantId?: string;
}

const useUserStore = create<UserStore>((set) => ({
    userID: null,
    setUserID: (id) => set({ userID: id }),
    name: null,
    setName: (name) => set({ name }),
    role: null,
    setRole: (role) => set({ role }),
    email: null,
    setEmail: (email) => set({ email }),
    loadUserData: async () => {
        try {
            const response = await api.get("/user/me");
            const data = response.data;

            if (data.success) {
                const user = data.data.user;
                set({ 
                    userID: user.id, 
                    name: user.name, 
                    role: user.role, 
                    email: user.email 
                });
                set({ userData: {
                    userID: user.id,
                    name: user.name,
                    role: user.role,
                    email: user.email,
                    restaurantId: user.restaurantId
                } });
            }
        } catch(err) {
            console.error("Failed to load user data:", err);
        }
    },
    clearUserData: () => 
        set({ 
            userID: null, 
            name: null, 
            role: null, 
            email: null,
            userData: null
        }),
    userData: null,
}));

export default useUserStore;