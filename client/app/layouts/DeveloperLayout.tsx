import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from "react";
import useUserStore from "~/stores/user.store";

export default function DeveloperLayout() {
  const [isMounted, setIsMounted] = useState(false);
  const userData = useUserStore(state => state.userData);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  if (userData?.role !== "Developer" && userData === null) {
    return <Navigate to="/login" replace />;
  }

  if (userData?.role !== "Developer" && userData !== null) {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}