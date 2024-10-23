import DashbordLayout from "@/layouts/dashboard"
import type { RouteObject } from "react-router-dom"

export const dashboardRoutes: RouteObject = {
  path: "/dashboard",
  element: <DashbordLayout />,
  children: [],
}
