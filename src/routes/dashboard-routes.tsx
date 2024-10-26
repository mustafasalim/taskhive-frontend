import DashbordLayout from "@/layouts/dashboard"
import WorkspaceProjectsPage from "@/pages/dashboard/workspace/projects"
import WorkspaceUsersPage from "@/pages/dashboard/workspace/users"
import type { RouteObject } from "react-router-dom"

export const dashboardRoutes: RouteObject = {
  path: "/dashboard",
  element: <DashbordLayout />,
  children: [
    {
      path: "workspace/users",
      element: <WorkspaceUsersPage />,
    },
    {
      path: "workspace/projects",
      element: <WorkspaceProjectsPage />,
    },
  ],
}
