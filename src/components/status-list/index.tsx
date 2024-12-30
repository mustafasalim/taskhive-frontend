import { useQuery } from "@tanstack/react-query"
import { statusServices } from "@/services/status-services"
import { Status } from "@/services/status-services/type"
import { useProjectStore } from "@/stores/project-slice"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { createModal } from "@/stores/store-actions/modal-action"
import { issueServices } from "@/services/issue-services"
import { Issue } from "@/services/issue-services/type"
import IssueCard from "@/components/issue-card"

const StatusList = () => {
  const { activeProject } = useProjectStore()
  const { data: statuses, isLoading } = useQuery({
    queryKey: ["statuses", activeProject?._id],
    queryFn: () =>
      statusServices.getStatusesByProject(activeProject?._id || ""),
    enabled: !!activeProject?._id,
  })

  // Fetch issues for all statuses in parallel
  const issueQueries = useQuery({
    queryKey: ["issues", statuses?.map((s: Status) => s._id)],
    queryFn: async () => {
      if (!statuses) return []
      const issuePromises = statuses.map((status: Status) =>
        issueServices.getIssuesByStatus(status._id)
      )
      return Promise.all(issuePromises)
    },
    enabled: !!statuses?.length,
  })

  const handleCreateIssue = (status: Status) => {
    createModal({
      name: "create-issue",
      data: { status, open: true },
    })
  }

  if (isLoading) {
    return <div className="p-4">Loading statuses...</div>
  }

  if (!activeProject) {
    return <div className="p-4">Please select a project first.</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="xl:w-[calc(94vw-200px)] lg:w-[calc(84vw-200px)] md:w-[calc(84vw-200px)]  flex-1 overflow-x-auto">
        <div className="h-full inline-flex gap-4 p-4">
          {statuses?.map((status: Status, index: number) => (
            <div
              key={status._id}
              className="w-[360px] flex flex-col bg-white/50 dark:bg-black/20 rounded-lg border"
            >
              <div className="p-4 border-b shrink-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">
                      {status.name}
                    </h3>
                    <span className="text-xs text-gray-500 shrink-0">
                      {issueQueries.data?.[index]?.length || 0}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => handleCreateIssue(status)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 min-h-0 p-4 overflow-y-auto">
                <div className="space-y-3">
                  {issueQueries.data?.[index]?.map((issue: Issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                    />
                  ))}
                  {(!issueQueries.data?.[index] ||
                    issueQueries.data[index].length === 0) && (
                    <div className="text-center text-sm text-gray-500">
                      No issues in this status
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {statuses?.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              No statuses found. Create a status to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatusList
