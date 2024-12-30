/* eslint-disable react-hooks/exhaustive-deps */
import { getAccessTokenFromLocalStorage } from "@/lib/hooks/use-access-token"
import AppProvider from "@/providers/app-provider"
import queries from "@/queries"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const AppLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { data } = useQuery({
    ...queries.workspaces.getWorkspaces,
    enabled: !!getAccessTokenFromLocalStorage(),
  })

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()

    if (!accessToken) {
      if (!location.pathname.startsWith("/auth")) {
        navigate("/auth/login")
      }
    } else {
      if (location.pathname === "/") {
        navigate("/dashboard")
      }

      if (data && data.length === 0 && location.pathname === "/dashboard") {
        navigate("/create-join")
      }
    }
  }, [location.pathname, data, navigate])

  return <AppProvider />
}

export default AppLayout
