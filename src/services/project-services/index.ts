import api from "../api"
import { IAddMembersToProject, ICreateProject, IUpdateProject } from "./type"

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
  addMembersToProject: async (data: IAddMembersToProject) => {
    const { members, projectId } = data
    const response = await api.post(`/projects/${projectId}/members`, {
      members,
    })
    return response.data
  },
  updateProject: async (data: IUpdateProject) => {
    const { description, title, id } = data
    const response = await api.patch(`/projects/${id}/update`, {
      description,
      title,
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
