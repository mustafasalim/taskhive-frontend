import PageHeader from "@/components/page-header"
import IssuesPageHeaderActions from "./actions"

const WorkspaceIssuesPage = () => {
  return (
    <div>
      <PageHeader
        title="All Issues"
        action={<IssuesPageHeaderActions />}
      />
    </div>
  )
}

export default WorkspaceIssuesPage
