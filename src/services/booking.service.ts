import axios, { type AxiosResponse } from 'axios'
import type { Booking, CreateBookingRequest, BookingFilter, CreateBookingWithoutRoomRequest, UpdateBookingRequest } from '@/interfaces/booking.interface'
import api from '@/lib/safe.api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

interface ApiResponse<T> {
  status: number
  message: string
  timestamp: string
  data: T
}

export const bookingService = {
  async getAllBookings(filter?: BookingFilter): Promise<Booking[]> {
    try {
      console.log('Fetching all bookings with filter:', filter)
      
      let url = `${API_BASE_URL}/api/bookings`
      
      const params = new URLSearchParams()
      if (filter?.status && filter.status !== 'all') {
        params.append('status', filter.status.toString())
      }
      if (filter?.search) {
        params.append('search', filter.search)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      console.log('Request URL:', url)
      
      const response: AxiosResponse<ApiResponse<Booking[]>> = await api.get(url)
      
      console.log('Get all bookings response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in getAllBookings:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async getBookingById(bookingId: string): Promise<Booking> {
    try {
      console.log('Fetching booking by ID:', bookingId)
      
      const response: AxiosResponse<ApiResponse<Booking>> = 
        await api.get(`${API_BASE_URL}/api/bookings/${bookingId}`)
      
      console.log('Get booking response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in getBookingById:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async createBooking(data: CreateBookingRequest | CreateBookingWithoutRoomRequest): Promise<Booking> {
    try {
      console.log('Creating booking:', data)
      
      const response: AxiosResponse<ApiResponse<Booking>> = 
        await api.post(`${API_BASE_URL}/api/bookings/create`, data)
      
      console.log('Create booking response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in createBooking:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async updateBooking(data: UpdateBookingRequest): Promise<Booking> {
    try {
      console.log('Updating booking:', data)
      
      const response: AxiosResponse<ApiResponse<Booking>> = 
        await api.put(`${API_BASE_URL}/api/bookings/update`, data)
      
      console.log('Update booking response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in updateBooking:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async payBooking(bookingId: string): Promise<Booking> {
    try {
      console.log('Paying booking:', bookingId)
      
      const response: AxiosResponse<ApiResponse<Booking>> = 
        await api.put(`${API_BASE_URL}/api/bookings/${bookingId}/payment-confirm`)
      
      console.log('Pay booking response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in payBooking:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    try {
      console.log('Cancelling booking:', bookingId)
      
      const response: AxiosResponse<ApiResponse<Booking>> = 
        await api.put(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`)
      
      console.log('Cancel booking response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in cancelBooking:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  }

  // Removed: requestRefund method as refund feature removed
  /*
  async requestRefund(bookingId: string): Promise<Booking> {
    try {
      console.log('Requesting refund for booking:', bookingId)
      
      const response: AxiosResponse<ApiResponse<Booking>> = 
        await api.put(`${API_BASE_URL}/api/bookings/${bookingId}/refund`)
      
      console.log('Request refund response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in requestRefund:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  }
  */
}