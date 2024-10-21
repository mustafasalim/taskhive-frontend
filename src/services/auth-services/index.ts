import api from "../api"
import {
  IAuthForgotPassword,
  IAuthLogin,
  IAuthResetPassword,
  IAuthSignup,
  IAuthVerifyEmail,
} from "./type"

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

  authForgotPassword: async (data: IAuthForgotPassword) => {
    const response = await api.post("/auth/forgot-password", data)
    return response.data
  },

  authResetPassword: async (data: IAuthResetPassword) => {
    const { confirmPassword, password, token } = data
    const response = await api.post(`/auth/reset-password/${token}`, {
      confirmPassword,
      password,
    })
    return response.data
  },
}
