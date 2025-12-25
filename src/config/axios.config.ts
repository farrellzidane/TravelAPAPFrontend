import axios from 'axios'
import { redirectToLogin } from '@/lib/auth'
import { toast } from 'vue-sonner'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL
axios.defaults.withCredentials = true // Enable sending cookies with requests
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Role checking helper functions
// Now these will use data from auth store instead of decoding JWT client-side
// Updated to match standardized uppercase role format from backend
export const isSuperAdmin = (role?: string): boolean => {
  if (!role) return false
  return role === 'SUPERADMIN'
}

export const isAccommodationOwner = (role?: string): boolean => {
  if (!role) return false
  return role === 'ACCOMMODATION_OWNER'
}

export const isCustomer = (role?: string): boolean => {
  if (!role) return false
  return role === 'CUSTOMER'
}

// Deprecated functions - kept for backward compatibility
// These now return empty strings and should be replaced with auth store usage
export const getCurrentRole = (): string => {
  console.warn('getCurrentRole() is deprecated. Use auth store instead.')
  return ''
}

export const getCurrentUserId = (): string => {
  console.warn('getCurrentUserId() is deprecated. Use auth store instead.')
  return ''
}

export const getCurrentUserName = (): string => {
  console.warn('getCurrentUserName() is deprecated. Use auth store instead.')
  return ''
}

export const getCurrentUserInfo = (): { userId: string; role: string } | null => {
  console.warn('getCurrentUserInfo() is deprecated. Use auth store instead.')
  return null
}

// Add request interceptor for logging
axios.interceptors.request.use(
  (config) => {
    // Cookies are sent automatically via withCredentials
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
let isRefreshing = false

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return Promise.reject(error)
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Try to refresh token or validate session
          // For now, redirect to login
          toast.error('Session expired', {
            description: 'Please login again'
          })
          redirectToLogin()
        } catch (refreshError) {
          redirectToLogin()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        toast.error('Access Denied', {
          description: error.response.data?.message || 'You do not have permission to access this resource'
        })
      }

      // Log error details for debugging
      console.error('API Error:', {
        status: error.response.status,
        message: error.response.data?.message,
        url: error.config?.url
      })
    }
    return Promise.reject(error)
  }
)

export { API_BASE_URL }
export default axios
