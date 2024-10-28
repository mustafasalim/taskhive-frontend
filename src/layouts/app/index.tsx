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
    if (data && data.length === 0 && location.pathname === "/dashboard") {
      navigate("/create-join")
    } else {
      navigate("/dashboard")
    }
  }, [data, navigate])

  useEffect(() => {
    const checkAuthentication = () => {
      const accessToken = getAccessTokenFromLocalStorage()

      if (!accessToken) {
        navigate("/auth/login")
      } else if (location.pathname === "/") {
        navigate("/dashboard")
      }
    }

    checkAuthentication()
  }, [location.pathname])

  return <AppProvider />
}

export default AppLayout
