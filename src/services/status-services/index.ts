import api from "../api"
import { CreateStatusDto, UpdateStatusDto, Status } from "./type"

export const statusServices = {
  createStatus: async (data: CreateStatusDto) => {
    const response = await api.post(`/statuses/${data.projectId}/create`, data)
    return response.data
  },

  getStatusesByProject: async (projectId: string) => {
    const response = await api.get(`statuses/${projectId}`)
    return response.data.map(
      (status: { project: string } & Omit<Status, "projectId">) => ({
        ...status,
        projectId: status.project,
      })
    )
  },

  updateStatus: async (statusId: string, data: UpdateStatusDto) => {
    const response = await api.patch(`/statuses/${statusId}`, data)
    return response.data
  },

  deleteStatus: async (statusId: string) => {
    await api.delete(`/statuses/${statusId}`)
  },
}
