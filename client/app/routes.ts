import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("menu", "menu/index.tsx"),
  route("cart", "cart/index.tsx"),
  route("account", "account/index.tsx"),
] satisfies RouteConfig;
