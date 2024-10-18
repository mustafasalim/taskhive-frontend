/* eslint-disable react-hooks/exhaustive-deps */
import { getAccessTokenFromLocalStorage } from "@/lib/hooks/use-access-token"
import { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

const AppLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === "/") {
      if (getAccessTokenFromLocalStorage()) {
        navigate("/dashboard")
      } else {
        navigate("/auth/login")
      }
    }
  }, [location.pathname])
  return <Outlet />
}

export default AppLayout
