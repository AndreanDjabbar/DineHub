import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("menu", "menu/index.tsx"),
  route("cart", "cart/index.tsx"),
  route("account", "account/index.tsx"),
  route("login", "account/login.tsx"),
  route("signup", "account/signup.tsx"),
  route("verify-otp", "account/verifyotp.tsx"),
  route("forgot-password", "forgot-password/index.tsx"),
  route("reset-password", "reset-password/index.tsx"),
] satisfies RouteConfig;
