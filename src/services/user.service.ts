import apiClient from '@/config/axios.config'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import type { UserProfile } from '@/interfaces/auth/profile.interface'

export const userService = {
  /**
   * Get all accommodation owners (for Superadmin only)
   */
  async getAccommodationOwners(): Promise<UserProfile[]> {
    const response = await apiClient.get<CommonResponseInterface<UserProfile[]>>(
      '/api/users/accommodation-owners'
    )
    return response.data.data
  }
}
