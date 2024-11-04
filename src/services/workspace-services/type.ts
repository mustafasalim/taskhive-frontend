export interface ICreateWorkspace {
  name: string
  description: string
}

export interface IWorkspace {
  _id: string
  name: string
  owner: {
    _id: string
    name: string
  }
}

export interface IWorkspaceMember {
  _id: string
  name: string
  email: string
  role: "admin" | "operator" | "member"
}
export interface IActiveWorkspaces {
  _id: string
  name: string
  currentUserRole: "admin" | "operator" | "member"
  description: string
  owner: string
  members: string[] | undefined
  createdAt: Date
  updatedAt: Date
}
