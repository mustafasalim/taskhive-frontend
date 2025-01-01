import DashbordLayout from "@/layouts/dashboard"
import WorkspaceIssuesPage from "@/pages/dashboard/workspace/issues"
import WorkspaceProjectsPage from "@/pages/dashboard/workspace/projects"
import ViewIssuePage from "@/pages/dashboard/workspace/issues/view"

import type { RouteObject } from "react-router-dom"

export const dashboardRoutes: RouteObject = {
  path: "/dashboard",
  element: <DashbordLayout />,
  children: [
    {
      path: "workspace/projects",
      element: <WorkspaceProjectsPage />,
    },
    {
      path: "workspace/issues",
      element: <WorkspaceIssuesPage />,
    },
    {
      path: "workspace/issues/:issueId",
      element: <ViewIssuePage />,
    },
  ],
}
