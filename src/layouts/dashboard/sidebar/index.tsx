import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DashbordSidebarHeader from "./header"
import DashbordSidebarContent from "./content"
import DashbordSidebarFooter from "./footer"

const DashbordLayoutSidebar = () => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <DashbordSidebarHeader />
        </SidebarHeader>
        <SidebarContent>
          <DashbordSidebarContent />
        </SidebarContent>
        <SidebarFooter>
          <DashbordSidebarFooter />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4"
            />
            All Issues
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-sidebar md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashbordLayoutSidebar
