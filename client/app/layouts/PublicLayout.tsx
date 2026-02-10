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
    const routeMapping: Record<string, string> = {
      ADMIN: "/admin",
      CASHIER: "/cashier",
      USER: "/menu",
      KITCHEN: "/kitchen",
      DEVELOPER: "/developer",
    };
    
    const redirectRoute = routeMapping[userData.role] || "/account";
    return <Navigate to={redirectRoute} replace />;
  }

  return <Outlet />;
}
