import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { useUserStore } from "~/stores";

export default function AdminLayout() {
  const role = useUserStore((state) => state.role);
  
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}