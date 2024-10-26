export interface ICreateProject {
  name: string
  description: string
  workspaceId: string
  members: string[]
}

export interface IGetProjectsByWorkspace {
  id: string
}
