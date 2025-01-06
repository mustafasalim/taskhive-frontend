import api from "../api"
import { IInviteUser, IJoinWorkspace } from "./type"

export const invitationServices = {
  inviteUser: async (data: IInviteUser) => {
    const response = await api.post("/invitation/invite-user", data)
    return response.data
  },
  joinWorkspace: async (data: IJoinWorkspace) => {
    const response = await api.post(`/invitation/join`, {
      inviteCode: data.inviteCode,
    })
    return response.data
  },
}
