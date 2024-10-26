import PageHeader from "@/components/page-header"
import ProjectsPageHeaderActions from "./actions"
import { useMutation } from "@tanstack/react-query"
import { projectServices } from "@/services/project-services"
import { useEffect, useState } from "react"

const WorkspaceProjectsPage = () => {
  const [data, setData] = useState<any>([])
  const getProjectByWorkspaceMutation = useMutation({
    mutationFn: projectServices.getProjectsByWorkspace,
    onSuccess: (data) => {
      setData(data)
    },
  })

  useEffect(() => {
    getProjectByWorkspaceMutation.mutate("6718ec2177e53c624ff0e639")
  }, [])

  return (
    <div>
      <PageHeader
        title="Projects"
        action={<ProjectsPageHeaderActions />}
      />
    </div>
  )
}

export default WorkspaceProjectsPage
