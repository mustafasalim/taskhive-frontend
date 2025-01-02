import { getAccessTokenFromLocalStorage } from "@/lib/hooks/use-access-token"
import type React from "react"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

interface Props {
  children: React.ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = getAccessTokenFromLocalStorage()

    if (token) {
      if (
        location.pathname === "/auth" ||
        location.pathname === "/auth/login"
      ) {
        navigate("/dashboard/workspace/issues")
      }
    } else {
      if (location.pathname.includes("/dashboard")) {
        navigate("/auth/login")
      }
    }
  }, [location.pathname, navigate])

  return <>{children}</>
}

export default AuthProvider
