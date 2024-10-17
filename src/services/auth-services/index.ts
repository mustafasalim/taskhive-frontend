import api from "../api"
import { IAuthLogin, IAuthSignup, IAuthVerifyEmail } from "./type"

export const authService = {
  authLogin: async (data: IAuthLogin) => {
    const response = await api.post("/auth/login", data)
    return response.data
  },

  authSignup: async (data: IAuthSignup) => {
    const response = await api.post("/auth/signup", data)
    return response.data
  },

  authVerifyEmail: async (data: IAuthVerifyEmail) => {
    const response = await api.post("/auth/verify-email", data)
    return response.data
  },
}
