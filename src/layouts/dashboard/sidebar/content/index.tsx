import YourWorkspaceMenu from "./your-workspace-menu"
import WorkspaceMenu from "./workspace-menu"
import YourMenu from "./your-menu"

const DashbordSidebarContent = () => {
  return (
    <>
      <YourMenu />
      <WorkspaceMenu />
      <YourWorkspaceMenu />
    </>
  )
}

export default DashbordSidebarContent
