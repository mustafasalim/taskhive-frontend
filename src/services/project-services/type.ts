export interface ICreateProject {
  name: string
  description: string
  workspaceId: string
  members: string[] | undefined
}

export interface IProject {
  name: string
  description: string
  workspaceName: string
  ownerName: string
  members: string[]
  createdAt: Date
  id: string
}

export interface IAddMembersToProject {
  projectId: string
  members: string[]
}
