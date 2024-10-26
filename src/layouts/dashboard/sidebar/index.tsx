import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import DashbordSidebarHeader from "./header"
import DashbordSidebarContent from "./content"
import DashbordSidebarFooter from "./footer"

const DashbordLayoutSidebar = () => {
  return (
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
  )
}

export default DashbordLayoutSidebar
