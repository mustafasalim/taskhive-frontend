/* eslint-disable react-hooks/exhaustive-deps */
import { getAccessTokenFromLocalStorage } from "@/lib/hooks/use-access-token"
import AppProvider from "@/providers/app-provider"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

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
  return (
    <>
      <AppProvider />
    </>
  )
}

export default AppLayout
