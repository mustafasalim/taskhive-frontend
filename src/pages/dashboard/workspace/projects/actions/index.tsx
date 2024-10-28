import { Button } from "@/components/ui/button"
import { projectServices } from "@/services/project-services"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { useMutation } from "@tanstack/react-query"
import { Plus } from "lucide-react"

const ProjectsPageHeaderActions = () => {
  const { activeWorkspace } = useWorkspaceStore()
  const createProjectMutation = useMutation({
    mutationFn: projectServices.createProject,
  })
  function handleClickCreateProject() {
    createProjectMutation.mutate({
      name: "Crms",
      description: "test",
      workspaceId: "6718ec2177e53c624ff0e639",
      members: ["6718d32b16436192416e4301", "67166952de7bb4d76772f640"],
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
