import { statusServices } from "@/services/status-services"
import { createQueryKeys } from "@lukemorales/query-key-factory"

const statuses = createQueryKeys("statuses", {
  getStatuses: (projectId: string) => ({
    queryKey: [""],
    queryFn: () => statusServices.getStatusesByProject(projectId),
  }),
})

export default statuses
