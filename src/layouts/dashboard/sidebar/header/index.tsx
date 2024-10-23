import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { workspaceServices } from "@/services/workspace-services"
import { IWorkspace } from "@/services/workspace-services/type"
import { useQuery } from "@tanstack/react-query"
import { ChevronsUpDown, Plus } from "lucide-react"

import { useEffect, useState } from "react"

const DashbordSidebarHeader = () => {
  const { data } = useQuery({
    queryKey: [""],
    queryFn: workspaceServices.getWorkspaces,
  })

  const [activeTeam, setActiveTeam] = useState<IWorkspace>()

  useEffect(() => {
    if (data && data.length > 0) {
      setActiveTeam(data[0])
    }
  }, [data])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                <img
                  className="w-10 h-10"
                  src={`https://api.dicebear.com/9.x/identicon/svg?seed=${activeTeam?.name}`}
                  alt=""
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam?.name}
                </span>
                <span>new</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {data &&
              data.map((team: IWorkspace, index: number) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <img
                      src={`https://api.dicebear.com/9.x/identicon/svg?seed=${team.name}`}
                      className="size-4 shrink-0"
                      alt=""
                    />
                  </div>

                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default DashbordSidebarHeader
