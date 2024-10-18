import { createBrowserRouter } from "react-router-dom"
import { authRoutes } from "./auth-routes"
import { dashboardRoutes } from "./dashboard-routes"
import AppLayout from "@/layouts/app-layout"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [authRoutes, dashboardRoutes],
  },
])

export default router
