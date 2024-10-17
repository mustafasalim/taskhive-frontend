import { createBrowserRouter } from "react-router-dom"
import { authRoutes } from "./auth-routes"
import { dashboardRoutes } from "./dashboard-routes"

const router = createBrowserRouter([
  {
    path: "/",
    children: [authRoutes, dashboardRoutes],
  },
])

export default router
