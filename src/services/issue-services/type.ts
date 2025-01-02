export interface CreateIssueDto {
  statusId: string
  title: string
  description?: string
  assignedTo?: string[]
  dueDate?: Date
  project: string
  priority?: "low" | "medium" | "high"
}

export interface UpdateIssueDto {
  title?: string
  description?: string
  assignedTo?: string[]
  dueDate?: Date
  priority?: "low" | "medium" | "high"
  status?: string
}

export interface User {
  _id: string
  name: string
  email: string
}

export interface Issue {
  _id: string
  title: string
  description?: string
  assignedTo?: User[]
  dueDate?: Date
  project: string
  status: string
  createdAt: Date
  updatedAt: Date
  priority?: "low" | "medium" | "high"
  videoToken?: string
}
