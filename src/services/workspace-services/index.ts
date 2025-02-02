import api from "../api"
import { ICreateWorkspace } from "./type"

export const workspaceServices = {
  createWorkspace: async (data: ICreateWorkspace) => {
    const response = await api.post("/workspaces/create", data)
    return response.data
  },
  getWorkspaces: async () => {
    const response = await api.get("/workspaces")
    return response.data
  },
  getActiveWorkspaces: async (id: string) => {
    const response = await api.get(`/workspaces/${id}`)
    return response.data
  },
  getWorkspaceMembers: async (id: string) => {
    const response = await api.get(`/workspaces/members/${id}`)
    return response.data
  },
  leaveWorkspace: async (id: string) => {
    const response = await api.delete(`/workspaces/leave/${id}`)
    return response.data
  },
  deleteWorkspace: async (id: string) => {
    const response = await api.delete(`/workspaces/${id}`)
    return response.data
  },
  updateMemberRole: async ({
    workspaceId,
    memberId,
    role,
  }: {
    workspaceId: string
    memberId: string
    role: string
  }) => {
    const response = await api.patch(
      `/workspaces/${workspaceId}/members/${memberId}/role`,
      { role }
    )
    return response.data
  },
}
