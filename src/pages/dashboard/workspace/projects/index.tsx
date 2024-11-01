import PageHeader from "@/components/page-header"
import ProjectsPageHeaderActions from "./actions"
import ProjectsTable from "./table"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { projectServices } from "@/services/project-services"
import { IProject } from "@/services/project-services/type"

const data: IProject[] = [
  {
    name: "INV001",
    description: "This is a sample project",
    workspaceName: "naber",
    members: ["mustafa", "ilayda"],
    ownerName: "Credit Card", // Assuming this is the payment or ownership method
    createdAt: new Date(),
  },
]

const WorkspaceProjectsPage = () => {
  const { activeWorkspace } = useWorkspaceStore()

  const getProjectByWorkspaceMutation = useMutation({
    mutationFn: projectServices.getProjectsByWorkspace,
    onSuccess: (data) => {
      console.log(data)
    },
  })

  useEffect(() => {
    if (activeWorkspace) {
      getProjectByWorkspaceMutation.mutate(activeWorkspace?._id as string)
    }
  }, [])

  return (
    <div>
      <PageHeader
        title="Projects"
        action={<ProjectsPageHeaderActions />}
      />
      <ProjectsTable data={data} />
    </div>
  )
}

export default WorkspaceProjectsPage
