import axios from 'axios'
import { getToken } from '@/lib/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Get current token from cookie/localStorage
const getCurrentToken = (): string | null => {
  return getToken()
}

// Function to get current role from JWT token
export const getCurrentRole = (): string => {
  try {
    const token = getCurrentToken()
    if (!token) {
      return ''
    }
    
    // JWT format: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) {
      return ''
    }
    
    // Decode payload (base64url)
    const payload = JSON.parse(atob(parts[1]))
    // Return role from token payload
    return payload.role || payload.roles || ''
  } catch (error) {
    console.error('Error decoding token for role:', error)
    return ''
  }
}

// Function to decode JWT token and get user info
export const getCurrentUserInfo = (): { userId: string; role: string } | null => {
  try {
    const token = getCurrentToken()
    if (!token) {
      return null
    }
    
    // JWT format: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) {
      return null
    }
    
    // Decode payload (base64url)
    const payload = JSON.parse(atob(parts[1]))
    return {
      userId: payload.id || payload.userId || payload.sub || '',
      role: payload.role || payload.roles || ''
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

// Function to get current user ID
export const getCurrentUserId = (): string => {
  const userInfo = getCurrentUserInfo()
  return userInfo?.userId || ''
}

// Function to get current user name from token
export const getCurrentUserName = (): string => {
  try {
    const token = getCurrentToken()
    if (!token) {
      return 'Unknown User'
    }
    
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) {
      return 'Unknown User'
    }
    
    const payload = JSON.parse(atob(parts[1]))
    return payload.name || payload.username || payload.sub || 'Unknown User'
  } catch (error) {
    console.error('Error decoding token for name:', error)
    return 'Unknown User'
  }
}

// Role checking helper functions
// These handle all role format variations including typos from backend
export const isSuperAdmin = (role?: string): boolean => {
  const r = role || getCurrentRole()
  return r === 'SUPERADMIN' || r === 'Superadmin' || r === 'superadmin'
}

export const isAccommodationOwner = (role?: string): boolean => {
  const r = role || getCurrentRole()
  return r === 'ACCOMMODATION_OWNER' || 
         r === 'Accommodation Owner' || 
         r === 'Accomodation Owner' ||  // Typo variant from SSO
         r === 'Accomodation owner' ||
         r === 'accommodation_owner'
}

export const isCustomer = (role?: string): boolean => {
  const r = role || getCurrentRole()
  return r === 'CUSTOMER' || r === 'Customer' || r === 'customer'
}

// Add request interceptor to automatically include Bearer token
axios.interceptors.request.use(
  (config) => {
    const token = getCurrentToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
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
