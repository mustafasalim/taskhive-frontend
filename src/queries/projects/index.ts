import { projectServices } from "@/services/project-services"
import { createQueryKeys } from "@lukemorales/query-key-factory"

const projects = createQueryKeys("projects", {
  getProjects: (workspaceId: string) => ({
    queryKey: [""],
    queryFn: () => projectServices.getProjectsByWorkspace(workspaceId),
  }),
})

export default projects
