export interface CreateStatusDto {
  name: string
  order?: number
  projectId: string
}

export interface UpdateStatusDto {
  name?: string
  order?: number
}

export interface Status {
  _id: string
  name: string
  order: number
  projectId: string
  createdAt: Date
  updatedAt: Date
}
