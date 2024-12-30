import api from "../api"
import { ICreateStatus } from "./type"

export const statusServices = {
  createStatus: async (data: ICreateStatus) => {
    const { projectId, name, order } = data
    const response = await api.post(`/statuses/${projectId}/create`, {
      name,
      order,
    })
    return response.data
  },
}
