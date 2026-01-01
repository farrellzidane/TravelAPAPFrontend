import type { AxiosResponse } from 'axios'
import type {
  Bill,
  CreateBillRequest,
  UpdateBillRequest,
  PayBillRequest,
  BillFilter,
  ApiResponse
} from '@/interfaces/bill.interface'
import api from '@/config/axios.config'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const billService = {
  async getAllBills(filter?: BillFilter): Promise<Bill[]> {
    try {
      console.log('Fetching all bills with filter:', filter)

      let url = `${API_BASE_URL}/api/bill`

      const params = new URLSearchParams()
      if (filter?.customerId) {
        params.append('customerId', filter.customerId)
      }
      if (filter?.serviceName) {
        params.append('serviceName', filter.serviceName)
      }
      if (filter?.status !== undefined && filter.status !== 'all') {
        params.append('status', filter.status.toString())
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      console.log('Request URL:', url)

      const response: AxiosResponse<ApiResponse<Bill[]>> = await api.get(url)

      console.log('Get all bills response:', response.data)

      return response.data.data
    } catch (error: any) {
      console.error('Error in getAllBills:', error)

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }

      throw error
    }
  },

  async getCustomerBills(
    customerId: string,
    status?: number,
    sortBy?: string,
    sortDirection?: string
  ): Promise<Bill[]> {
    try {
      console.log('Fetching customer bills:', { customerId, status, sortBy, sortDirection })

      let url = `${API_BASE_URL}/api/bill/customer`

      const params = new URLSearchParams()
      params.append('customerId', customerId)

      if (status !== undefined && status !== -1) {
        params.append('status', status.toString())
      }
      if (sortBy) {
        params.append('sortBy', sortBy)
      }
      if (sortDirection) {
        params.append('sortDirection', sortDirection)
      }

      url += `?${params.toString()}`

      console.log('Request URL:', url)

      const response: AxiosResponse<ApiResponse<Bill[]>> = await api.get(url)

      console.log('Get customer bills response:', response.data)

      return response.data.data
    } catch (error: any) {
      console.error('Error in getCustomerBills:', error)

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }

      throw error
    }
  },

  async getServiceBills(
    serviceName: string,
    status?: number,
    customerId?: string
  ): Promise<Bill[]> {
    try {
      console.log('Fetching service bills:', { serviceName, status, customerId })

      let url = `${API_BASE_URL}/api/bill/${serviceName}`

      const params = new URLSearchParams()
      if (status !== undefined && status !== -1) {
        params.append('status', status.toString())
      }
      if (customerId) {
        params.append('customerId', customerId)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      console.log('Request URL:', url)

      const response: AxiosResponse<ApiResponse<Bill[]>> = await api.get(url)

      console.log('Get service bills response:', response.data)

      return response.data.data
    } catch (error: any) {
      console.error('Error in getServiceBills:', error)

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }

      throw error
    }
  },

  async getBillById(billId: string): Promise<Bill> {
    try {
      console.log('Fetching bill by ID:', billId)

      const response: AxiosResponse<ApiResponse<Bill>> = await api.get(
        `${API_BASE_URL}/api/bill/detail/${billId}`
      )

      console.log('Get bill response:', response.data)

      return response.data.data
    } catch (error: any) {
      console.error('Error in getBillById:', error)

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }

      throw error
    }
  },

  async createBill(data: CreateBillRequest): Promise<Bill> {
    try {
      console.log('Creating bill:', data)

      const response: AxiosResponse<ApiResponse<Bill>> = await api.post(
        `${API_BASE_URL}/api/bill/create`,
        data
      )

      console.log('Create bill response:', response.data)

      return response.data.data
    } catch (error: any) {
      console.error('Error in createBill:', error)

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }

      throw error
    }
  },

  async updateBill(billId: string, data: UpdateBillRequest): Promise<Bill> {
    try {
      console.log('Updating bill:', billId, data)

      const response: AxiosResponse<ApiResponse<Bill>> = await api.put(
        `${API_BASE_URL}/api/bill/update/${billId}`,
        data
      )

      console.log('Update bill response:', response.data)

      return response.data.data
    } catch (error: any) {
      console.error('Error in updateBill:', error)

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }

      throw error
    }
  },

  async payBill(billId: string, data?: PayBillRequest): Promise<Bill> {
    try {
      console.log('Paying bill:', billId, data)

      const response: AxiosResponse<ApiResponse<Bill>> = await api.post(
        `${API_BASE_URL}/api/bill/${billId}/pay`,
        data || {}
      )

      console.log('Pay bill response:', response.data)

      return response.data.data
    } catch (error: any) {
      console.error('Error in payBill:', error)

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }

      throw error
    }
  }
}
