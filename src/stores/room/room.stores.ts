import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import { toast } from 'vue-sonner'
import type { Room, CreateMaintenanceRequest } from '@/interfaces/room.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import api from '@/config/axios.config'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const useRoomStore = defineStore('room', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createMaintenance = async (data: CreateMaintenanceRequest): Promise<Room> => {
    loading.value = true
    error.value = null

    try {
      console.log('Creating maintenance:', data)
      
      const response: AxiosResponse<CommonResponseInterface<Room>> = 
        await api.post(`${API_BASE_URL}/api/property/maintenance/add`, data)

      console.log('Create maintenance response:', response.data)

      if ((response.data.status === 200 || response.data.status === 201) && response.data.data) {
        toast.success(response.data.message || 'Maintenance schedule created successfully!')
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to create maintenance schedule')
      }
    } catch (err: any) {
      console.error('Error creating maintenance:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
        toast.error(err.response.data.message)
      } else if (err.response?.data) {
        error.value = JSON.stringify(err.response.data)
        toast.error('Failed to create maintenance schedule. Please check your input.')
      } else {
        error.value = err.message || 'Failed to create maintenance schedule'
        toast.error('Failed to create maintenance schedule. Please try again.')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createMaintenance
  }
})