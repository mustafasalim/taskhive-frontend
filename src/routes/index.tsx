import { createBrowserRouter } from "react-router-dom"
import { authRoutes } from "./auth-routes"
import { dashboardRoutes } from "./dashboard-routes"
import AppLayout from "@/layouts/app"
import AuthProvider from "@/providers/auth-provider"
import CreateOrJoinPage from "@/pages/create-or-join"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    ),
    children: [
      authRoutes,
      dashboardRoutes,
      { path: "create-join", element: <CreateOrJoinPage /> },
    ],
  },
])

export default router
