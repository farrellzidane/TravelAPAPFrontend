import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Mock tokens dari AuthServiceMockImpl.java
export const AUTH_TOKENS = {
  SUPERADMIN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMSIsInJvbGUiOiJTdXBlcmFkbWluIn0.lJEnbqCnBRHd5VQGRpt2bhL6thuJc35qY5dupmg8dwI',
  ACCOMMODATION_OWNER: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhMmIzYzRkLTVlNmYtNzA4MC05MGEwLWIxYzJkM2U0ZjUwMSIsInJvbGUiOiJBY2NvbW1vZGF0aW9uIE93bmVyIn0.UQV7EuEaokBoLv8yB3Ti-wLAujzitxZmZ6g0fF4VJPI',
  CUSTOMER: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMxYzFjMWMxLWMxYzEtYzFjMS1jMWMxLWMxYzFjMWMxYzFjMSIsInJvbGUiOiJDdXN0b21lciJ9.AIRg51HdixEkiDJP0afDZCCz1Z8EduexjZA8u85yEJs'
}

// Get current role from localStorage or default to CUSTOMER
const getCurrentToken = (): string => {
  const role = localStorage.getItem('userRole') || 'CUSTOMER'
  return AUTH_TOKENS[role as keyof typeof AUTH_TOKENS] || AUTH_TOKENS.CUSTOMER
}

// Function to set user role
export const setUserRole = (role: keyof typeof AUTH_TOKENS) => {
  localStorage.setItem('userRole', role)
}

// Function to get current role
export const getCurrentRole = (): string => {
  return localStorage.getItem('userRole') || 'CUSTOMER'
}

// Add request interceptor to automatically include Bearer token
axios.interceptors.request.use(
  (config) => {
    // Add Authorization header with Bearer token based on current role
    config.headers.Authorization = `Bearer ${getCurrentToken()}`
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
