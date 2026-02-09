import React, { useState } from 'react';
import { FiLogOut, FiUser, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import api from '~/lib/axios';
import useUserStore from '~/stores/user.store';

interface ProfileBadgeProps {
}

const ProfileBadge: React.FC<ProfileBadgeProps> = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const userData = useUserStore(state => state.userData);
    const clearUserData = useUserStore(state => state.clearUserData);

    const user = userData ? {
        name: userData.name,
        email: userData.email
    } : null;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await api.post("/auth/logout");
            clearUserData();
            navigate("/login");
        } catch (error) {
            console.error("Failed to logout:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="px-4 mt-6">
            <div className="relative bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-300">

                {/* Profile Content */}
                <div className="flex flex-col items-center gap-2 pt-2">
                    {/* Avatar */}
                    <div>
                        <FiUser className="w-16 h-16 " />
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-xl font-bold text-gray-900">
                        {user.name || "User"}
                        </h2>
                        <p className="text-gray-500 text-sm break-all max-w-full">
                        {user.email}
                        </p>
                    </div>

                    <div className="w-full border-t border-gray-200"></div>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                        aria-label="Logout"
                    >
                        <FiLogOut size={18} />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileBadge;