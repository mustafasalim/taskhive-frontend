import { Button } from "@/components/ui/button"

import { createModal } from "@/stores/store-actions/modal-action"
import { useWorkspaceStore } from "@/stores/workspace-slice"

import { Plus } from "lucide-react"

const ProjectsPageHeaderActions = () => {
  const { activeWorkspace } = useWorkspaceStore()

  function handleClickCreateProject() {
    createModal({
      name: "create-project",
      data: activeWorkspace?._id,
    })
  }
  return (
    <div>
      {(activeWorkspace?.currentUserRole === "admin" ||
        activeWorkspace?.currentUserRole === "operator") && (
        <Button
          onClick={handleClickCreateProject}
          variant="ghost"
          size="sm"
        >
          <Plus className="mx-auto h-4 w-4" />
          create project
        </Button>
      )}
    </div>
  )
}

export default ProjectsPageHeaderActions
