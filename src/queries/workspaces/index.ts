import { workspaceServices } from "@/services/workspace-services"
import { createQueryKeys } from "@lukemorales/query-key-factory"

const workspaces = createQueryKeys("workspaces", {
  getWorkspaces: {
    queryKey: [""],
    queryFn: workspaceServices.getWorkspaces,
  },
})

export default workspaces
