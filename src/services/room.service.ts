import axios, { type AxiosResponse } from 'axios'
import type { Room, CreateMaintenanceRequest } from '@/interfaces/room.interface'
import api from '@/lib/safe.api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

interface ApiResponse<T> {
  status: number
  message: string
  timestamp: string
  data: T
}

export const roomService = {
  async createMaintenance(data: CreateMaintenanceRequest): Promise<Room> {
    try {
      console.log('Creating maintenance:', data)
      
      const response: AxiosResponse<ApiResponse<Room>> = 
        await api.post(`${API_BASE_URL}/api/property/maintenance/add`, data)
      
      console.log('Create maintenance response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in createMaintenance:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  }
}