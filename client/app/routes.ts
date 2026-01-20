import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/ProtectedLayout.tsx", [
    route("account", "./pages/account/index.tsx"),
    route("settings", "./pages/settings/index.tsx"),

    layout("./layouts/DeveloperLayout.tsx", [
      route("developer", "./pages/developer/index.tsx"),
    ]),
    layout("./layouts/AdminLayout.tsx", [
      route("admin", "./pages/admin/index.tsx"),
    ]),
    layout("./layouts/KitchenLayout.tsx", [
      route("kitchen", "./pages/kitchen/index.tsx"),
    ]),
    layout("./layouts/CashierLayout.tsx", [
      route("cashier", "./pages/cashier/index.tsx"),
    ]),
  ]),

  layout("./layouts/PublicLayout.tsx", [
    route("login", "./pages/account/login.tsx"),
    route("signup", "./pages/account/signup.tsx"),
    route("forgot-password", "./pages/forgot-password/index.tsx"),
    route("reset-password", "./pages/reset-password/index.tsx"),
    route("", "./pages/account/landingpage.tsx"),
  ]),

  route("menu", "./pages/menu/index.tsx"),
  route("menu/details", "./pages/menu/details.tsx"),
  route("cart", "./pages/cart/index.tsx"),
  route("orders", "./pages/orders/index.tsx"),
  route("verify-otp", "./pages/account/verifyotp.tsx"),
  route("register-tenant", "./pages/register-tenant/index.tsx"),
  route("partner", "./pages/partner/index.tsx"),
  route("partner-payment", "./pages/partner-payment/index.tsx"),
] satisfies RouteConfig;
