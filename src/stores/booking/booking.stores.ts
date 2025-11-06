import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import { toast } from 'vue-sonner'
import type { Booking, CreateBookingRequest, BookingFilter } from '@/interfaces/booking.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref<Booking[]>([])
  const currentBooking = ref<Booking | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAllBookings = async (filter?: BookingFilter) => {
    loading.value = true
    error.value = null

    try {
      console.log('Fetching bookings with filter:', filter)
      
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

      const response: AxiosResponse<CommonResponseInterface<Booking[]>> = await axios.get(url)

      console.log('Fetch bookings response:', response.data)

      if (response.data.status === 200 && response.data.data) {
        bookings.value = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch bookings')
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
        toast.error(err.response.data.message)
      } else {
        error.value = 'Failed to fetch bookings'
        toast.error('Failed to fetch bookings. Please try again.')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchBookingById = async (bookingId: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('Fetching booking by ID:', bookingId)

      const response: AxiosResponse<CommonResponseInterface<Booking>> = 
        await axios.get(`${API_BASE_URL}/api/bookings/${bookingId}`)

      console.log('Fetch booking response:', response.data)

      if (response.data.status === 200 && response.data.data) {
        currentBooking.value = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch booking')
      }
    } catch (err: any) {
      console.error('Error fetching booking:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
        toast.error(err.response.data.message)
      } else {
        error.value = 'Failed to fetch booking'
        toast.error('Failed to fetch booking. Please try again.')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
    loading.value = true
    error.value = null

    try {
      console.log('Creating booking:', data)

      const response: AxiosResponse<CommonResponseInterface<Booking>> = 
        await axios.post(`${API_BASE_URL}/api/bookings/create`, data)

      console.log('Create booking response:', response.data)

      if (response.data.status === 201 && response.data.data) {
        toast.success(response.data.message || 'Booking created successfully!')
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to create booking')
      }
    } catch (err: any) {
      console.error('Error creating booking:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
        toast.error(err.response.data.message)
      } else if (err.response?.data) {
        error.value = JSON.stringify(err.response.data)
        toast.error('Failed to create booking. Please check your input.')
      } else {
        error.value = err.message || 'Failed to create booking'
        toast.error('Failed to create booking. Please try again.')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }


  const payBooking = async (bookingId: string): Promise<Booking> => {
    loading.value = true
    error.value = null

    try {
      console.log('Confirming payment for booking:', bookingId)

      const response: AxiosResponse<CommonResponseInterface<Booking>> = 
        await axios.post(`${API_BASE_URL}/api/bookings/status/pay`, { bookingID: bookingId })

      console.log('Payment confirmation response:', response.data)

      if (response.data.status === 200 && response.data.data) {
        toast.success(response.data.message || 'Payment confirmed successfully!')
        currentBooking.value = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to confirm payment')
      }
    } catch (err: any) {
      console.error('Error confirming payment:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
        toast.error(err.response.data.message)
      } else {
        error.value = 'Failed to confirm payment'
        toast.error('Failed to confirm payment. Please try again.')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelBooking = async (bookingId: string): Promise<Booking> => {
    loading.value = true
    error.value = null

    try {
      console.log('Cancelling booking:', bookingId)

      const response: AxiosResponse<CommonResponseInterface<Booking>> = 
        await axios.post(`${API_BASE_URL}/api/bookings/status/cancel`, { bookingID: bookingId })

      console.log('Cancel booking response:', response.data)

      if (response.data.status === 200 && response.data.data) {
        toast.success(response.data.message || 'Booking cancelled successfully!')
        currentBooking.value = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to cancel booking')
      }
    } catch (err: any) {
      console.error('Error cancelling booking:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
        toast.error(err.response.data.message)
      } else {
        error.value = 'Failed to cancel booking'
        toast.error('Failed to cancel booking. Please try again.')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const requestRefund = async (bookingId: string): Promise<Booking> => {
    loading.value = true
    error.value = null

    try {
      console.log('Requesting refund for booking:', bookingId)

      const response: AxiosResponse<CommonResponseInterface<Booking>> = 
        await axios.post(`${API_BASE_URL}/api/bookings/status/refund`, { bookingID: bookingId })

      console.log('Refund request response:', response.data)

      if (response.data.status === 200 && response.data.data) {
        toast.success(response.data.message || 'Refund processed successfully!')
        currentBooking.value = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to process refund')
      }
    } catch (err: any) {
      console.error('Error processing refund:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
        toast.error(err.response.data.message)
      } else {
        error.value = 'Failed to process refund'
        toast.error('Failed to process refund. Please try again.')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const getStatusClass = (statusColor?: string): string => {
    switch (statusColor) {
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'success': return 'bg-green-100 text-green-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'purple': return 'bg-purple-100 text-purple-800'
      case 'danger': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return {
    bookings,
    currentBooking,
    loading,
    error,
    fetchAllBookings,
    fetchBookingById,
    createBooking,
    payBooking,
    cancelBooking,
    requestRefund,
    getStatusClass
  }
})