import { type AxiosResponse } from 'axios'
import api from '@/config/axios.config'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import type { UserProfile } from '@/interfaces/auth/profile.interface'
import type {
  User,
  Customer,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  LoginResponse,
  ApiResponse
} from '@/interfaces/user.interface'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const userService = {
  /**
   * Login user
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<ApiResponse<LoginResponse>> = 
        await api.post(`${API_BASE_URL}/api/auth/login`, request)
      
      if (response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Login failed')
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  /**
   * Register new customer
   */
  async register(request: RegisterRequest): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = 
        await api.post(`${API_BASE_URL}/api/auth/register`, request)
      
      if (response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Registration failed')
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post(`${API_BASE_URL}/api/auth/logout`)
    } catch (error: any) {
      console.error('Logout error:', error)
      throw error
    }
  },

  /**
   * Get all users (SUPERADMIN only)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<ApiResponse<User[]>> = 
        await api.get(`${API_BASE_URL}/api/auth/users`)
      
      return response.data.data || []
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  /**
   * Get all customers with optional filters (SUPERADMIN/ACCOMMODATION_OWNER)
   */
  async getAllCustomers(search?: string, gender?: string): Promise<Customer[]> {
    try {
      const params: any = {}
      if (search) params.search = search
      if (gender) params.gender = gender

      const response: AxiosResponse<ApiResponse<Customer[]>> = 
        await api.get(`${API_BASE_URL}/api/auth/customers`, { params })
      
      return response.data.data || []
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  /**
   * Get user by identifier (email or username)
   */
  async getUserByIdentifier(identifier: string): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = 
        await api.get(`${API_BASE_URL}/api/auth/user/${identifier}`)
      
      if (response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'User not found')
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  /**
   * Update user information
   */
  async updateUser(userId: string, request: UpdateUserRequest): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = 
        await api.put(`${API_BASE_URL}/api/auth/user/${userId}`, request)
      
      if (response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Update failed')
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  /**
   * Get all accommodation owners (for Superadmin only)
   */
  async getAccommodationOwners(): Promise<UserProfile[]> {
    try {
      console.log('🔍 Fetching accommodation owners from:', `${API_BASE_URL}/api/users/accommodation-owners`)
      
      const response: AxiosResponse<CommonResponseInterface<UserProfile[]>> = 
        await api.get(`${API_BASE_URL}/api/users/accommodation-owners`)
      
      console.log('📦 Raw response:', response.data)
      console.log('👥 Accommodation owners data:', response.data.data)
      
      return response.data.data || []
    } catch (error: any) {
      console.error('❌ Error in getAccommodationOwners:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  }
}
