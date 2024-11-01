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
  addMembersToProject: async (projectId: string, members: string[]) => {
    const response = await api.post(`/projects/${projectId}/members`, {
      members,
    })
    return response.data
  },
}
