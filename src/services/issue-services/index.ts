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
    const response = await api.put(`/statuses/issues/${issueId}/update`, data)
    return response.data
  },

  getIssueById: async (issueId: string) => {
    const response = await api.get(`/statuses/issues/${issueId}`)
    return response.data
  },

  getLiveKitToken: async (room: string, username: string) => {
    const response = await api.get(
      `statuses/issues/livekit/token?room=${room}&username=${username}`,
      {}
    )
    return response.data.token
  },
}
