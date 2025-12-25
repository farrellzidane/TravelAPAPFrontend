import axios, { type AxiosResponse } from 'axios'
import type { PaymentMethod, CreatePaymentMethodRequest, UpdatePaymentMethodStatusRequest, ApiResponse } from '@/interfaces/paymentmethod.interface'
import api from '@/config/axios.config'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const paymentMethodService = {
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response: AxiosResponse<ApiResponse<PaymentMethod[]>> = 
        await api.get(`${API_BASE_URL}/api/payment-method`)
      
      return response.data.data || []
    } catch (error) {
      console.error('Error in getAllPaymentMethods:', error)
      throw error
    }
  },

  async createPaymentMethod(data: CreatePaymentMethodRequest): Promise<PaymentMethod> {
    try {
      console.log('Creating payment method with data:', data)
      
      const response: AxiosResponse<ApiResponse<PaymentMethod>> = 
        await api.post(`${API_BASE_URL}/api/payment-method`, data)
      
      console.log('Create payment method response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in createPaymentMethod:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async updatePaymentMethodStatus(data: UpdatePaymentMethodStatusRequest): Promise<PaymentMethod> {
    try {
      console.log('Updating payment method status:', data)
      
      const response: AxiosResponse<ApiResponse<PaymentMethod>> = 
        await api.put(`${API_BASE_URL}/api/payment-method/status`, data)
      
      console.log('Update payment method status response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in updatePaymentMethodStatus:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async deletePaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      console.log('Deleting payment method:', id)
      
      const response: AxiosResponse<ApiResponse<PaymentMethod>> = 
        await api.delete(`${API_BASE_URL}/api/payment-method/delete/${id}`)
      
      console.log('Delete payment method response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in deletePaymentMethod:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  }
}
