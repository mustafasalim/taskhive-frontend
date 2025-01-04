export interface CreateIssueDto {
  title: string
  description: string
  assignedTo: string[]
  priority: "low" | "medium" | "high"
  statusId: string
  project: string
  images: File[]
  dueDate?: Date | null
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
  description: string
  assignedTo: {
    _id: string
    name: string
    email: string
  }[]
  priority: "low" | "medium" | "high"
  status: string
  project: string
  createdAt: string
  updatedAt: string
  images?: string[]
  dueDate?: string
}
