import PageHeader from "@/components/page-header"
import IssuesPageHeaderActions from "./actions"
import StatusList from "@/components/status-list"

const WorkspaceIssuesPage = () => {
  return (
    <div className="w-full flex flex-col h-full">
      <PageHeader
        title="All Issues"
        action={<IssuesPageHeaderActions />}
      />

      <div className="h-full w-full">
        <StatusList />
      </div>
    </div>
  )
}

export default WorkspaceIssuesPage
