import api from "../api"
import { CreateIssueDto, UpdateIssueDto } from "./type"

export const issueServices = {
  addIssueToStatus: async (data: CreateIssueDto) => {
    const { statusId, ...rest } = data
    const response = await api.post(`/statuses/${statusId}/issues/create`, rest)
    return response.data
  },

  getIssuesByStatus: async (statusId: string) => {
    const response = await api.get(`/statuses/${statusId}/issues`)
    return response.data
  },

  updateIssue: async (issueId: string, data: UpdateIssueDto) => {
    const response = await api.patch(`/issues/${issueId}`, data)
    return response.data
  },
}
