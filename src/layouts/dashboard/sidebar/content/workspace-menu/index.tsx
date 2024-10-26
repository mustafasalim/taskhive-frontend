/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Box, ChevronRight, Layers, SquareTerminal, Users } from "lucide-react"

import { Link } from "react-router-dom"

const WorkspaceMenu = () => {
  const mock = {
    navMain: [
      {
        title: "Workspace",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Issues",
            url: "#",
            icon: Layers,
          },
          {
            title: "Projects",
            url: "/dashboard/workspace/projects",
            icon: Box,
          },
          {
            title: "Users",
            url: "/dashboard/workspace/users",
            icon: Users,
          },
        ],
      },
    ],
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Your teams</SidebarGroupLabel>
      <SidebarMenu>
        {mock.navMain.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem: any) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link to={subItem.url}>
                          {subItem.icon && <subItem.icon />}
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default WorkspaceMenu
