import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { queryClient } from "@/providers/react-query-provider"
import queries from "@/queries"
import { projectServices } from "@/services/project-services"
import { IProject } from "@/services/project-services/type"
import { createModal } from "@/stores/store-actions/modal-action"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { useMutation } from "@tanstack/react-query"
import { Edit2, EllipsisVertical, LogOut, Trash2 } from "lucide-react"

interface ColumnActionsProps {
  row: IProject
}

const ColumnActions = (props: ColumnActionsProps) => {
  const { row } = props
  const { activeWorkspace } = useWorkspaceStore()

  const deleteProjectMutation = useMutation({
    mutationFn: projectServices.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.projects.getProjects(activeWorkspace?._id as string)
          .queryKey,
      })
    },
  })

  const leaveProjectMutation = useMutation({
    mutationFn: projectServices.leaveProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.projects.getProjects(activeWorkspace?._id as string)
          .queryKey,
      })
    },
  })

  function handleDeleteProject() {
    deleteProjectMutation.mutate(row.id)
  }

  function handleLeaveProject() {
    leaveProjectMutation.mutate(row.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem
          onClick={() =>
            createModal({
              name: "edit-project",
              data: row,
            })
          }
        >
          <div className="flex items-center gap-x-2 ">
            <Edit2 className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
            Edit
          </div>
        </DropdownMenuItem>
        {activeWorkspace?.currentUserRole === "admin" ||
        activeWorkspace?.currentUserRole === "operator" ? (
          <DropdownMenuItem onClick={handleDeleteProject}>
            <div className="flex items-center gap-x-2 ">
              <Trash2 className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
              Delete
            </div>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleLeaveProject}>
            <div className="flex items-center gap-x-2 ">
              <LogOut className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
              Leave
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ColumnActions
