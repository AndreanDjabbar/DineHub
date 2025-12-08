import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // index("./home.tsx"),
  route("menu", "./pages/menu/index.tsx"),
  route("cart", "./pages/cart/index.tsx"),
  route("account", "./pages/account/index.tsx"),
  route("login", "./pages/account/login.tsx"),
  route("signup", "./pages/account/signup.tsx"),
  route("verify-otp", "./pages/account/verifyotp.tsx"),
  route("forgot-password", "./pages/forgot-password/index.tsx"),
  route("reset-password", "./pages/reset-password/index.tsx"),
  route("settings", "./pages/settings/index.tsx"),
] satisfies RouteConfig;
