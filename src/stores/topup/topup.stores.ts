import type { TopUpTransaction, CreateTopUpRequest, UpdateTopUpStatusRequest, TopUpStatusNames, TopUpStatusColors } from '@/interfaces/topup.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from 'axios'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import api from '@/lib/safe.api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

interface TopUpState {
  topUps: TopUpTransaction[]
  currentTopUp: TopUpTransaction | null
  loading: boolean
  error: string | null
}

export const useTopUpStore = defineStore('topup', {
  state: (): TopUpState => ({
    topUps: [],
    currentTopUp: null,
    loading: false,
    error: null
  }),

  getters: {
    // Get total top-ups count
    totalTopUps: (state): number => state.topUps.length,

    // Get pending top-ups count
    pendingTopUps: (state): number => 
      state.topUps.filter(t => t.status === 'Pending').length,

    // Get successful top-ups count
    successfulTopUps: (state): number => 
      state.topUps.filter(t => t.status === 'Success').length,

    // Get top-up by ID
    getTopUpById: (state) => (id: string): TopUpTransaction | undefined => 
      state.topUps.find(t => t.transactionId === id),

    // Get sorted top-ups (newest first)
    sortedTopUps: (state): TopUpTransaction[] => {
      return [...state.topUps].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      })
    }
  },

  actions: {
    // Fetch all top-ups
    async fetchAllTopUps(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<TopUpTransaction[]>> = 
          await api.get(`${API_BASE_URL}/api/top-up`)

        if (response.data.status === 200 && response.data.data) {
          this.topUps = response.data.data.map(topUp => ({
            ...topUp,
            statusText: this.getStatusName(topUp.status),
            statusColor: this.getStatusColor(topUp.status)
          }))
          
          if (this.topUps.length > 0) {
            toast.success(`${this.topUps.length} top-up transactions loaded successfully`)
          } else {
            toast.info('No top-up transactions found')
          }
        } else {
          throw new Error(response.data.message || 'Failed to fetch top-ups')
        }
      } catch (error: any) {
        console.error('Error fetching top-ups:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to fetch top-ups'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Fetch top-up by ID
    async fetchTopUpById(id: string): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<TopUpTransaction>> = 
          await api.get(`${API_BASE_URL}/api/top-up/${id}`)

        if (response.data.status === 200 && response.data.data) {
          this.currentTopUp = {
            ...response.data.data,
            statusText: this.getStatusName(response.data.data.status),
            statusColor: this.getStatusColor(response.data.data.status)
          }
        } else {
          throw new Error(response.data.message || 'Failed to fetch top-up')
        }
      } catch (error: any) {
        console.error('Error fetching top-up:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to fetch top-up'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Create new top-up
    async createTopUp(data: CreateTopUpRequest): Promise<TopUpTransaction | null> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<TopUpTransaction>> = 
          await api.post(`${API_BASE_URL}/api/top-up`, data)

        if ((response.data.status === 200 || response.data.status === 201) && response.data.data) {
          const newTopUp = {
            ...response.data.data,
            statusText: this.getStatusName(response.data.data.status),
            statusColor: this.getStatusColor(response.data.data.status)
          }
          
          this.topUps.unshift(newTopUp)
          toast.success('Top-up transaction created successfully')
          return newTopUp
        } else {
          throw new Error(response.data.message || 'Failed to create top-up')
        }
      } catch (error: any) {
        console.error('Error creating top-up:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to create top-up'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update top-up status
    async updateTopUpStatus(data: UpdateTopUpStatusRequest): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<TopUpTransaction>> = 
          await api.put(`${API_BASE_URL}/api/top-up/status`, data)

        if (response.data.status === 200 && response.data.data) {
          const updatedTopUp = {
            ...response.data.data,
            statusText: this.getStatusName(response.data.data.status),
            statusColor: this.getStatusColor(response.data.data.status)
          }
          
          const index = this.topUps.findIndex(t => t.transactionId === data.transactionId)
          if (index !== -1) {
            this.topUps[index] = updatedTopUp
          }
          
          if (this.currentTopUp?.transactionId === data.transactionId) {
            this.currentTopUp = updatedTopUp
          }
          
          toast.success('Top-up status updated successfully')
        } else {
          throw new Error(response.data.message || 'Failed to update top-up status')
        }
      } catch (error: any) {
        console.error('Error updating top-up status:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to update top-up status'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete top-up
    async deleteTopUp(id: string): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<TopUpTransaction>> = 
          await api.delete(`${API_BASE_URL}/api/top-up/${id}`)

        if (response.data.status === 200) {
          this.topUps = this.topUps.filter(t => t.transactionId !== id)
          
          if (this.currentTopUp?.transactionId === id) {
            this.currentTopUp = null
          }
          
          toast.success('Top-up transaction deleted successfully')
        } else {
          throw new Error(response.data.message || 'Failed to delete top-up')
        }
      } catch (error: any) {
        console.error('Error deleting top-up:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to delete top-up'
        toast.error(this.error)
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
        'Pending': 'warning',
        'Success': 'success',
        'Failed': 'danger'
      }
      return statusColors[status] || 'secondary'
    },

    // Clear current top-up
    clearCurrentTopUp(): void {
      this.currentTopUp = null
    },

    // Reset store
    resetStore(): void {
      this.topUps = []
      this.currentTopUp = null
      this.loading = false
      this.error = null
    }
  }
})
