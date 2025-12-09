import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from "react";

export default function KitchenLayout() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (user?.role !== "KITCHEN") {
    return <Navigate to="/menu" replace />;
  }

  return <Outlet />;
}