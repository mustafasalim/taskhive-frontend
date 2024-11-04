import api from "../api"
import { ICreateProject } from "./type"

export const projectServices = {
  createProject: async (data: ICreateProject) => {
    const response = await api.post("/projects/create", data)
    return response
  },
  getProjectsByWorkspace: async (id: string) => {
    const response = await api.get(`/projects/workspace/${id}`)
    return response.data
  },
  getProjectById: async (id: string) => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },
  addMembersToProject: async (id: string, members: string[]) => {
    const response = await api.post(`/projects/${id}/members`, {
      members,
    })
    return response.data
  },
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },
  leaveProject: async (id: string) => {
    const response = await api.post(`/projects/${id}/leave`)
    return response.data
  },
}
