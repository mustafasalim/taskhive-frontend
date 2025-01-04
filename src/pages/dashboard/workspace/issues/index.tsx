import PageHeader from "@/components/page-header"
import IssuesPageHeaderActions from "./actions"
import StatusList from "@/components/status-list"
import { useProjectStore } from "@/stores/project-slice"
import { useQuery } from "@tanstack/react-query"
import queries from "@/queries"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createModal } from "@/stores/store-actions/modal-action"
import { useEffect } from "react"

const WorkspaceIssuesPage = () => {
  const { activeProject } = useProjectStore()

  const { data: statuses, refetch } = useQuery({
    ...queries.statuses.getStatuses(activeProject?._id as string),
    enabled: !!activeProject?._id,
  })
  useEffect(() => {
    if (activeProject) {
      refetch()
    }
  }, [activeProject])

  const handleClickCreateStatus = () => {
    if (!activeProject?._id) return
    createModal({
      name: "create-status",
      data: activeProject._id,
    })
  }

  return (
    <div className="w-full flex flex-col h-full">
      <PageHeader
        title="All Issues"
        actions={<IssuesPageHeaderActions />}
      />

      <div className="h-full w-full">
        {!statuses || statuses.length === 0 ? (
          <Alert className="mt-4 mx-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No statuses found in this project. Create a status to start adding
              issues.{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={handleClickCreateStatus}
              >
                Create Status
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <StatusList />
        )}
      </div>
    </div>
  )
}

export default WorkspaceIssuesPage
