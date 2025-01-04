import api from "../api"
import { CreateIssueDto, UpdateIssueDto } from "./type"

export const issueServices = {
  addIssueToStatus: async (data: CreateIssueDto) => {
    const { statusId, images, ...rest } = data
    const formData = new FormData()

    // Append issue data
    Object.entries(rest).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, String(item)))
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString())
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    // Append images if they exist
    if (images && images.length > 0) {
      images.forEach((image: File) => {
        formData.append("images", image)
      })
    }

    const response = await api.post(
      `/statuses/${statusId}/issues/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return response.data
  },

  updateIssueImages: async (issueId: string, images: File[]) => {
    const formData = new FormData()
    images.forEach((image) => {
      formData.append("images", image)
    })

    const response = await api.post(
      `/statuses/issues/${issueId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return response.data
  },

  deleteIssueImage: async (issueId: string, imageUrl: string) => {
    const response = await api.delete(`/statuses/issues/${issueId}/images`, {
      data: { imageUrl },
    })
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

  deleteIssue: async (issueId: string) => {
    const response = await api.delete(`/statuses/issues/${issueId}`)
    return response.data
  },
}
