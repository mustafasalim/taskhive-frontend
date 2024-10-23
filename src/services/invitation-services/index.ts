import api from "../api"
import { IInviteUser, IJoinWorkspace } from "./type"

export const invitationServices = {
  inviteUser: async (data: IInviteUser) => {
    const response = await api.post("/invitation/invite-user", data)
    return response.data
  },
  joinWorkspace: async (token: IJoinWorkspace) => {
    const response = await api.post(`/invitation/join-workspace`, token)
    return response.data
  },
}
