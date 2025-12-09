import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from "react";

export default function PublicLayout() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  if (token) {
    let redirectPath = "/menu";

    if(userString) {
      try{
        const user = JSON.parse(userString);
        const role = user.role;
        if(role === "ADMIN") {
          redirectPath = "/admin/dashboard";
        }else if(role === "CASHIER") {
          redirectPath = "/cashier";
        }else if(role === "KITCHEN") {
          redirectPath = "/kitchen";
        }else if(role === "Developer") {
          redirectPath = "/developer";
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}