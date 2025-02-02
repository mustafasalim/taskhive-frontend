import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DashbordLayoutSidebar from "./sidebar"
import { Outlet } from "react-router-dom"

const DashboardLayout = () => {
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
          <div className="h-full py-2 px-3 border flex-1 rounded-sm bg-white/40 dark:bg-black/20 md:min-h-min">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
