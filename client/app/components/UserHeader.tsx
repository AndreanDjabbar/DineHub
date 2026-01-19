import React, { useEffect, useRef } from 'react';
import { MdMenu } from 'react-icons/md';
import ProfileBadge from './ProfileBadge';
import { BiX } from 'react-icons/bi';

const UserHeader = () => {
    const [restaurantName, setRestaurantName] = React.useState<string>("");
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const menuRef = useRef<HTMLDivElement>(null);

    const getUser = () => {
        try {
            const userString = localStorage.getItem("user");
            return userString ? JSON.parse(userString) : null;
        } catch (error) {
            console.error("Failed to parse user data:", error);
            return null;
        }
    };

    const user = getUser();
    const token = localStorage.getItem("token");
    const restaurantId = user?.restaurantId;

    const fetchRestaurantDetails = async () => {
        if (!restaurantId || !token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:4000/dinehub/api/restaurant/${restaurantId}`,
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
                setRestaurantName(data.data.name);
            } else {
                console.error("Failed to fetch restaurant details");
            }
        } catch (error) {
            console.error("Failed to fetch restaurant details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurantDetails();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isMenuOpen) {
            setIsMenuOpen(false);
        }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMenuOpen]);

    return (
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex justify-between items-center top-0 z-40 sticky shadow-sm">
            <div className="flex items-center gap-2">
                {isLoading ? (
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                <h1 className="text-lg sm:text-xl font-bold text-red-600 truncate max-w-[200px] sm:max-w-none">
                    {restaurantName || "DineHub"}
                </h1>
                )}
            </div>

            <div className="relative" ref={menuRef}>
                <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 text-red-600 hover:text-red-800 transition-all hover:cursor-pointer duration-200"
                aria-label="Toggle profile menu"
                aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <BiX size={28} /> : <MdMenu size={28} />}
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                <div className="fixed top-10 right-2 w-80 max-w-[90vw] duration-200">
                    <ProfileBadge />
                </div>
                )}
            </div>
        </header>
    );
};

export default UserHeader;