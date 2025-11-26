import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Mock tokens dengan UUID yang sesuai
// Payload format: {"userId": "uuid-string", "role": "RoleName"}
// Owner UUID: a058fb1b-cf37-4e91-99d2-17742d5add60
// Customer UUID: 6d9b6f5d-0714-49a4-96fa-aa9f4b29c1f8
export const AUTH_TOKENS = {
  SUPERADMIN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJyb2xlIjoiU3VwZXJhZG1pbiJ9.mockSignature',
  ACCOMMODATION_OWNER: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMDU4ZmIxYi1jZjM3LTRlOTEtOTlkMi0xNzc0MmQ1YWRkNjAiLCJyb2xlIjoiQWNjb21tb2RhdGlvbiBPd25lciJ9.mockSignature',
  CUSTOMER: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZDliNmY1ZC0wNzE0LTQ5YTQtOTZmYS1hYTlmNGIyOWMxZjgiLCJyb2xlIjoiQ3VzdG9tZXIifQ.mockSignature'
}

// Mock User IDs untuk digunakan saat create property/booking
export const MOCK_USER_IDS = {
  SUPERADMIN: '00000000-0000-0000-0000-000000000001',
  ACCOMMODATION_OWNER: 'a058fb1b-cf37-4e91-99d2-17742d5add60',
  CUSTOMER: '6d9b6f5d-0714-49a4-96fa-aa9f4b29c1f8'
}

// Get current role from localStorage or default to SUPERADMIN
const getCurrentToken = (): string => {
  const role = localStorage.getItem('userRole') || 'SUPERADMIN'
  return AUTH_TOKENS[role as keyof typeof AUTH_TOKENS] || AUTH_TOKENS.SUPERADMIN
}

// Function to set user role
export const setUserRole = (role: keyof typeof AUTH_TOKENS) => {
  localStorage.setItem('userRole', role)
}

// Function to get current role
export const getCurrentRole = (): string => {
  return localStorage.getItem('userRole') || 'SUPERADMIN'
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
