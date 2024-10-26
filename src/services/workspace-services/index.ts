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
  deleteWorkspace: async (id: string) => {
    const response = await api.delete(`/workspaces/${id}`)
    return response.data
  },
}
