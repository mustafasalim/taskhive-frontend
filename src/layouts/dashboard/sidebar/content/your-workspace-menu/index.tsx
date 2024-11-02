import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { queryClient } from "@/providers/react-query-provider"
import queries from "@/queries"
import { workspaceServices } from "@/services/workspace-services"
import { createModal } from "@/stores/store-actions/modal-action"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { useMutation } from "@tanstack/react-query"
import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react"

const YourWorkspaceMenu = () => {
  const { activeWorkspace, setActiveWorkspace } = useWorkspaceStore()

  const deleteWorkspaceMutation = useMutation({
    mutationFn: workspaceServices.deleteWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.workspaces.getWorkspaces.queryKey,
      })
      setActiveWorkspace(null)
      window.location.reload()
    },
  })

  const leaveWorkspaceMuation = useMutation({
    mutationFn: workspaceServices.leaveWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.workspaces.getWorkspaces.queryKey,
      })
      setActiveWorkspace(null)
      window.location.reload()
    },
  })

  function handleSelectDeleteProject() {
    deleteWorkspaceMutation.mutate(activeWorkspace?._id as string)
  }

  function handleSelectLeaveProject() {
    leaveWorkspaceMuation.mutate(activeWorkspace?._id as string)
  }

  function handleSelectIviteProject() {
    createModal({
      name: "invite-workspace",
      data: activeWorkspace?._id,
    })
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Your Teams</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem key={activeWorkspace?.name}>
            <SidebarMenuButton asChild>
              <a>
                <img
                  className="w-5 h-5"
                  src={`https://api.dicebear.com/9.x/rings/svg?seed=${activeWorkspace?.name}`}
                  alt=""
                />

                <span>{activeWorkspace?.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side="bottom"
                align="end"
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                {activeWorkspace?.currentUserRole === "admin" && (
                  <DropdownMenuItem onSelect={handleSelectIviteProject}>
                    <Forward className="text-muted-foreground" />
                    <span>Invite Project</span>
                  </DropdownMenuItem>
                )}
                {activeWorkspace?.currentUserRole === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSelectDeleteProject}>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </>
                )}
                {(activeWorkspace?.currentUserRole === "member" ||
                  activeWorkspace?.currentUserRole === "operator") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSelectLeaveProject}>
                      <Trash2 className="text-muted-foreground" />
                      <span>Leave Project</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}

export default YourWorkspaceMenu
