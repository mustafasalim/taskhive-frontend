import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DashbordLayoutSidebar from "./sidebar"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import queries from "@/queries"

const DashboardLayout = () => {
  const { data } = useQuery(queries.workspaces.getWorkspaces)
  const navigate = useNavigate()

  useEffect(() => {
    if (data && data.length > 0) {
      navigate("/dashboard")
    } else {
      navigate("/create-join")
    }
  }, [data, navigate])
  return (
    <SidebarProvider>
      <DashbordLayoutSidebar />
      <SidebarInset className="bg-sidebar">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 z-10">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="w-full h-full flex flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary dark:bg-secondary/50 md:min-h-min">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
