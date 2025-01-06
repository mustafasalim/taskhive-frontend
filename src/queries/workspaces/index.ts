import { workspaceServices } from "@/services/workspace-services"
import { createQueryKeys } from "@lukemorales/query-key-factory"

const workspaces = createQueryKeys("workspaces", {
  getWorkspaces: {
    queryKey: ["workspaces"],
    queryFn: workspaceServices.getWorkspaces,
  },
  getWorkspaceMembers: (workspaceId: string) => ({
    queryKey: [workspaceId, "members"],
    queryFn: () => workspaceServices.getWorkspaceMembers(workspaceId),
  }),
})

export default workspaces
