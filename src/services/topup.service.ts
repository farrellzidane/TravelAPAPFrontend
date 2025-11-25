import axios, { type AxiosResponse } from 'axios'
import type { TopUpTransaction, CreateTopUpRequest, UpdateTopUpStatusRequest, ApiResponse } from '@/interfaces/topup.interface'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const topUpService = {
  async getAllTopUps(): Promise<TopUpTransaction[]> {
    try {
      const response: AxiosResponse<ApiResponse<TopUpTransaction[]>> = 
        await axios.get(`${API_BASE_URL}/api/top-up`)
      
      return response.data.data || []
    } catch (error) {
      console.error('Error in getAllTopUps:', error)
      throw error
    }
  },

  async getTopUpById(id: string): Promise<TopUpTransaction> {
    try {
      const response: AxiosResponse<ApiResponse<TopUpTransaction>> = 
        await axios.get(`${API_BASE_URL}/api/top-up/${id}`)
      
      return response.data.data
    } catch (error) {
      console.error('Error in getTopUpById:', error)
      throw error
    }
  },

  async createTopUp(data: CreateTopUpRequest): Promise<TopUpTransaction> {
    try {
      console.log('Creating top-up with data:', data)
      
      const response: AxiosResponse<ApiResponse<TopUpTransaction>> = 
        await axios.post(`${API_BASE_URL}/api/top-up`, data)
      
      console.log('Create top-up response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in createTopUp:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async updateTopUpStatus(data: UpdateTopUpStatusRequest): Promise<TopUpTransaction> {
    try {
      console.log('Updating top-up status:', data)
      
      const response: AxiosResponse<ApiResponse<TopUpTransaction>> = 
        await axios.put(`${API_BASE_URL}/api/top-up/status`, data)
      
      console.log('Update top-up status response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in updateTopUpStatus:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async deleteTopUp(id: string): Promise<TopUpTransaction> {
    try {
      console.log('Deleting top-up:', id)
      
      const response: AxiosResponse<ApiResponse<TopUpTransaction>> = 
        await axios.delete(`${API_BASE_URL}/api/top-up/${id}`)
      
      console.log('Delete top-up response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in deleteTopUp:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  }
}
