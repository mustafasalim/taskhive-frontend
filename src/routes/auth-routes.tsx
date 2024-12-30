import type { RouteObject } from "react-router-dom"
import AuthLayouth from "@/layouts/auth"
import Login from "@/pages/auth/login"
import Signup from "@/pages/auth/signup"
import ResetPassword from "@/pages/auth/reset-password"

export const authRoutes: RouteObject = {
  path: "/auth",
  element: <AuthLayouth />,
  children: [
    {
      path: "signup",
      element: <Signup />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "reset-password/:token",
      element: <ResetPassword />,
    },
  ],
}
