import AuthProvider from "@/providers/auth-provider"
import type { RouteObject } from "react-router-dom"

export const dashboardRoutes: RouteObject = {
  path: "/dashboard",
  element: <AuthProvider>app</AuthProvider>,
  children: [],
}
