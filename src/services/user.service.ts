import { type AxiosResponse } from 'axios'
import api from '@/lib/safe.api'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import type { UserProfile } from '@/interfaces/auth/profile.interface'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const userService = {
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
