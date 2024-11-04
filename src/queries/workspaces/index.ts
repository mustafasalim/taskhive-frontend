import { workspaceServices } from "@/services/workspace-services"
import { createQueryKeys } from "@lukemorales/query-key-factory"

const workspaces = createQueryKeys("workspaces", {
  getWorkspaces: {
    queryKey: [""],
    queryFn: workspaceServices.getWorkspaces,
  },
  getWorkspaceMembers: (workspaceId: string) => ({
    queryKey: [""],
    queryFn: () => workspaceServices.getWorkspaceMembers(workspaceId),
  }),
})

export default workspaces
