import {
  getAccessTokenFromLocalStorage,
  removeAccessTokenFromLocalStorage,
} from "@/lib/hooks/use-access-token"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL, // Use your API base URL
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor: Attach token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromLocalStorage()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle responses globally (e.g., error logging, redirecting on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      removeAccessTokenFromLocalStorage()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
