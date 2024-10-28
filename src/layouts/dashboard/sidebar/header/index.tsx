/* eslint-disable react-hooks/exhaustive-deps */
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
import queries from "@/queries"
import { workspaceServices } from "@/services/workspace-services"
import { IWorkspace } from "@/services/workspace-services/type"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ChevronsUpDown, Plus } from "lucide-react"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const DashbordSidebarHeader = () => {
  const { activeWorkspace, setActiveWorkspace } = useWorkspaceStore()
  const { data: workspaces } = useQuery(queries.workspaces.getWorkspaces)
  const navigate = useNavigate()

  const getActiveWorkspaceMutation = useMutation({
    mutationFn: workspaceServices.getActiveWorkspaces,
    onSuccess: (data) => {
      setActiveWorkspace(data)
    },
  })

  function handleClickGetActiveWorkspace(workspace: IWorkspace) {
    getActiveWorkspaceMutation.mutate(workspace?._id)
  }

  useEffect(() => {
    if (workspaces && workspaces.length > 0) {
      getActiveWorkspaceMutation.mutate(
        (activeWorkspace?._id as string) || (workspaces[0]?._id as string)
      )
    } else {
      navigate("/dashboard")
    }
  }, [workspaces])

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
                  src={`https://api.dicebear.com/9.x/identicon/svg?seed=${activeWorkspace?.name}`}
                  alt=""
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace?.name}
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
            {workspaces &&
              workspaces.map((team: IWorkspace, index: number) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => handleClickGetActiveWorkspace(team)}
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
              <Link to="/create-join">
                <div className="font-medium text-muted-foreground">
                  Create or join a team
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default DashbordSidebarHeader
