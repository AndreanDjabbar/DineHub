import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from "react";
import useUserStore from "~/stores/user.store";

export default function KitchenLayout() {
  const [isMounted, setIsMounted] = useState(false);
  const userData = useUserStore(state => state.userData);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  if (userData?.role !== "KITCHEN") {
    return <Navigate to="/menu" replace />;
  }

  return <Outlet />;
}