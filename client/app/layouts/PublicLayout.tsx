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

  if (token) {
    return <Navigate to="/menu" replace />;
  }

  return <Outlet />;
}