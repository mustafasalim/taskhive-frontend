export interface ICreateWorkspace {
  name: string
  description: string
}

export interface IWorkspaceMember {
  user: string // ObjectId type for MongoDB, but you can also use string
  role: "admin" | "operator" | "member"
}

export interface IWorkspace {
  _id: string
  name: string
  description: string
  owner: string
  members: IWorkspaceMember[]
  createdAt: Date
  updatedAt: Date
}
