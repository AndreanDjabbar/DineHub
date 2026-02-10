import { Outlet, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { useUserStore } from "~/stores";

export default function PublicLayout() {
  const userData = useUserStore((state) => state.userData);
  const route = window.location.pathname;
  const prohibitedRoutes = [
    "/login", 
    "/register",
    "/forgot-password",
    "/reset-password",
    "verify-otp"
  ];
  const isProhibitedRoute = prohibitedRoutes.includes(route);

  if (userData && isProhibitedRoute) {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}
