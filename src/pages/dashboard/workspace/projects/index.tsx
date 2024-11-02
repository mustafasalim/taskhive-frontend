import PageHeader from "@/components/page-header"
import ProjectsPageHeaderActions from "./actions"
import ProjectsTable from "./table"

const WorkspaceProjectsPage = () => {
  return (
    <div>
      <PageHeader
        title="Projects"
        action={<ProjectsPageHeaderActions />}
      />
      <ProjectsTable />
    </div>
  )
}

export default WorkspaceProjectsPage
