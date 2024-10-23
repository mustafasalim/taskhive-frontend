import api from "../api"
import { ICreateWorkspace } from "./type"

export const workspaceServices = {
  createWorkspace: async (data: ICreateWorkspace) => {
    const response = await api.post("/workspaces/create-workspace", data)
    return response.data
  },
  getWorkspaces: async () => {
    const response = await api.get("/workspaces/get-workspaces")
    return response.data
  },
}
