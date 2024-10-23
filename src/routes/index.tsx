import { createBrowserRouter } from "react-router-dom"
import { authRoutes } from "./auth-routes"
import { dashboardRoutes } from "./dashboard-routes"
import AppLayout from "@/layouts/app"
import AuthProvider from "@/providers/auth-provider"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    ),
    children: [authRoutes, dashboardRoutes],
  },
])

export default router
