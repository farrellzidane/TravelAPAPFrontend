import type { PaymentMethod, CreatePaymentMethodRequest, UpdatePaymentMethodStatusRequest } from '@/interfaces/paymentmethod.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from 'axios'
import { toast } from 'vue-sonner'
import api from '@/config/axios.config'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

interface PaymentMethodState {
  paymentMethods: PaymentMethod[]
  loading: boolean
  error: string | null
}

export const usePaymentMethodStore = defineStore('paymentMethod', {
  state: (): PaymentMethodState => ({
    paymentMethods: [],
    loading: false,
    error: null
  }),

  getters: {
    // Get total payment methods count
    totalPaymentMethods: (state): number => state.paymentMethods.length,

    // Get active payment methods count
    activePaymentMethods: (state): number => 
      state.paymentMethods.filter(pm => pm.status === 'Active').length,

    // Get active payment methods only
    activePaymentMethodsList: (state): PaymentMethod[] =>
      state.paymentMethods.filter(pm => pm.status === 'Active'),

    // Get payment method by ID
    getPaymentMethodById: (state) => (id: string): PaymentMethod | undefined => 
      state.paymentMethods.find(pm => pm.paymentMethodId === id),

    // Get sorted payment methods (newest first)
    sortedPaymentMethods: (state): PaymentMethod[] => {
      return [...state.paymentMethods].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      })
    }
  },

  actions: {
    // Fetch all payment methods
    async fetchAllPaymentMethods(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<PaymentMethod[]>> = 
          await api.get(`${API_BASE_URL}/api/payment-method`)

        if (response.data.status === 200 && response.data.data) {
          this.paymentMethods = response.data.data.map(pm => ({
            ...pm,
            statusText: this.getStatusName(pm.status),
            statusColor: this.getStatusColor(pm.status)
          }))
          
          if (this.paymentMethods.length > 0) {
            toast.success(`${this.paymentMethods.length} payment methods loaded successfully`)
          } else {
            toast.info('No payment methods found')
          }
        } else {
          throw new Error(response.data.message || 'Failed to fetch payment methods')
        }
      } catch (error: any) {
        console.error('Error fetching payment methods:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to fetch payment methods'
        toast.error(this.error || 'Failed to fetch payment methods')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Create new payment method
    async createPaymentMethod(data: CreatePaymentMethodRequest): Promise<PaymentMethod | null> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<PaymentMethod>> = 
          await api.post(`${API_BASE_URL}/api/payment-method`, data)

        if ((response.data.status === 200 || response.data.status === 201) && response.data.data) {
          const newPaymentMethod = {
            ...response.data.data,
            statusText: this.getStatusName(response.data.data.status),
            statusColor: this.getStatusColor(response.data.data.status)
          }
          
          this.paymentMethods.unshift(newPaymentMethod)
          toast.success('Payment method created successfully')
          return newPaymentMethod
        } else {
          throw new Error(response.data.message || 'Failed to create payment method')
        }
      } catch (error: any) {
        console.error('Error creating payment method:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to create payment method'
        toast.error(this.error || 'Failed to create payment method')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update payment method status
    async updatePaymentMethodStatus(data: UpdatePaymentMethodStatusRequest): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<PaymentMethod>> = 
          await api.put(`${API_BASE_URL}/api/payment-method/status`, data)

        if (response.data.status === 200 && response.data.data) {
          const updatedPaymentMethod = {
            ...response.data.data,
            statusText: this.getStatusName(response.data.data.status),
            statusColor: this.getStatusColor(response.data.data.status)
          }
          
          const index = this.paymentMethods.findIndex(pm => pm.paymentMethodId === data.paymentMethodId)
          if (index !== -1) {
            this.paymentMethods[index] = updatedPaymentMethod
          }
          
          toast.success('Payment method status updated successfully')
        } else {
          throw new Error(response.data.message || 'Failed to update payment method status')
        }
      } catch (error: any) {
        console.error('Error updating payment method status:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to update payment method status'
        toast.error(this.error || 'Failed to update payment method status')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete payment method
    async deletePaymentMethod(id: string): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<PaymentMethod>> = 
          await api.delete(`${API_BASE_URL}/api/payment-method/delete/${id}`)

        if (response.data.status === 200) {
          this.paymentMethods = this.paymentMethods.filter(pm => pm.paymentMethodId !== id)
          toast.success('Payment method deleted successfully')
        } else {
          throw new Error(response.data.message || 'Failed to delete payment method')
        }
      } catch (error: any) {
        console.error('Error deleting payment method:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to delete payment method'
        toast.error(this.error || 'Failed to delete payment method')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Helper methods
    getStatusName(status: string): string {
      return status || 'Unknown'
    },

    getStatusColor(status: string): string {
      const statusColors: Record<string, string> = {
        'Inactive': 'danger',
        'Active': 'success'
      }
      return statusColors[status] || 'secondary'
    },

    // Reset store
    resetStore(): void {
      this.paymentMethods = []
      this.loading = false
      this.error = null
    }
  }
})
