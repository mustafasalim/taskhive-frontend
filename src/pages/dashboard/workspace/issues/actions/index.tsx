import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import queries from "@/queries"
import { IProject } from "@/services/project-services/type"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { useProjectStore } from "@/stores/project-slice"
import { createModal } from "@/stores/store-actions/modal-action"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useEffect } from "react"

const IssuesPageHeaderActions = () => {
  const { activeWorkspace } = useWorkspaceStore()
  const { activeProject, setActiveProject } = useProjectStore()

  const { data: projects, refetch } = useQuery({
    ...queries.projects.getProjects(activeWorkspace?._id as string),
    enabled: !!activeWorkspace?._id,
  })

  const handleClickCreateStatus = () => {
    if (!activeProject?._id) return
    createModal({
      name: "create-status",
      data: activeProject._id,
    })
  }

  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects?.find((p: IProject) => p.id === projectId)
    if (selectedProject) {
      setActiveProject({
        _id: selectedProject.id,
        title: selectedProject.name,
      })
    }
  }

  // Reset active project only when workspace changes
  useEffect(() => {
    if (activeWorkspace) {
      setActiveProject(null)
    }
  }, [activeWorkspace])

  useEffect(() => {
    handleProjectChange(activeProject?._id as string)
  }, [])

  // Reset active project only when workspace changes
  useEffect(() => {
    if (activeWorkspace?._id) {
      refetch().then(() => {
        // Only reset active project if it belongs to a different workspace
        const currentProject = projects?.find(
          (p: IProject) => p.id === activeProject?._id
        )
        if (!currentProject) {
          setActiveProject(null)
        }
      })
    }
  }, [activeWorkspace?._id])

  // Set first project as active by default if there are projects and no active project
  useEffect(() => {
    if (projects && projects.length > 0 && !activeProject) {
      handleProjectChange(projects[0].id)
    }
  }, [projects])

  console.log("activeProject", activeProject)

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={handleClickCreateStatus}
        variant="ghost"
        size="sm"
        disabled={!activeProject}
      >
        <Plus className="mx-auto h-4 w-4" />
        create status
      </Button>
      <Select
        value={activeProject?._id || undefined}
        onValueChange={handleProjectChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Projects</SelectLabel>
            {projects &&
              projects.map((project: IProject) => (
                <SelectItem
                  key={project.id}
                  value={project.id}
                >
                  <div className="flex items-center gap-x-2">
                    <img
                      className="rounded-md"
                      width={20}
                      height={20}
                      src={`https://api.dicebear.com/9.x/identicon/svg?seed=${project.name}`}
                      alt=""
                    />
                    <div>{project.name}</div>
                  </div>
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default IssuesPageHeaderActions
