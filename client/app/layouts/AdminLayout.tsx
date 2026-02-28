import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { useUserStore, type UserStore } from "~/stores";

export default function AdminLayout() {
  const role = useUserStore((state: UserStore) => state.role);
  
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}