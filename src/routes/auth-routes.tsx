import type { RouteObject } from "react-router-dom"
import AuthLayouth from "@/layouts/auth"
import Login from "@/pages/auth/login"
import Signup from "@/pages/auth/signup"
import VerifyEmail from "@/pages/auth/verify-email"
import AuthProvider from "@/providers/auth-provider"

export const authRoutes: RouteObject = {
  path: "/auth",
  element: (
    <AuthProvider>
      <AuthLayouth />
    </AuthProvider>
  ),
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
      path: "verify-email",
      element: <VerifyEmail />,
    },
  ],
}
