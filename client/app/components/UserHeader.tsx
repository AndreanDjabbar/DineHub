import React, { useEffect } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router';

const UserHeader = () => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const restaurantId = user?.restaurantId; 
    const [restaurantName, setRestaurantName] = React.useState<string>("");
    const navigate = useNavigate();

    const fetchRestaurantDetails = async () => {
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
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if(token){
            try{
                await fetch("http://localhost:4000/dinehub/api/auth/logout", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            });
            } catch (error) {
                console.error("Failed to logout:", error);
            } finally {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        fetchRestaurantDetails();
    }, []);

    return (
        <div>
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center top-0 z-10 sticky">
                <h1 className="text-xl font-bold text-red-600">{restaurantName}</h1>

                <span className="absolute left-1/2 -translate-x-1/2">{user.email}</span>

                <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition ml-auto hover:cursor-pointer"
                >
                <FiLogOut /> Logout
                </button>
            </header>
        </div>
    )
}

export default UserHeader