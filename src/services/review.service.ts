import axios, { type AxiosResponse } from 'axios'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import type { Review, CreateReviewRequest } from '@/interfaces/review.interface'
import api from '@/config/axios.config'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const reviewService = {
  // Get all reviews by property ID
  async getReviewsByProperty(propertyID: string): Promise<Review[]> {
    try {
      const response: AxiosResponse<CommonResponseInterface<Review[]>> = 
        await api.get(`${API_BASE_URL}/api/reviews/property/${propertyID}`)
      return response.data.data
    } catch (error: any) {
      console.error('Error fetching reviews by property:', error)
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews')
    }
  },

  // Get all reviews by customer ID
  async getReviewsByCustomer(customerID: string): Promise<Review[]> {
    try {
      const response: AxiosResponse<CommonResponseInterface<Review[]>> = 
        await api.get(`${API_BASE_URL}/api/reviews/customer/${customerID}`)
      return response.data.data
    } catch (error: any) {
      console.error('Error fetching reviews by customer:', error)
      throw new Error(error.response?.data?.message || 'Failed to fetch your reviews')
    }
  },

  // Get review detail by ID
  async getReviewById(reviewID: string): Promise<Review> {
    try {
      const response: AxiosResponse<CommonResponseInterface<Review>> = 
        await api.get(`${API_BASE_URL}/api/reviews/${reviewID}`)
      return response.data.data
    } catch (error: any) {
      console.error('Error fetching review by ID:', error)
      throw new Error(error.response?.data?.message || 'Failed to fetch review details')
    }
  },

  // Create new review
  async createReview(request: CreateReviewRequest): Promise<Review> {
    try {
      const response: AxiosResponse<CommonResponseInterface<Review>> = 
        await api.post(`${API_BASE_URL}/api/reviews/create`, request)
      return response.data.data
    } catch (error: any) {
      console.error('Error creating review:', error)
      throw new Error(error.response?.data?.message || 'Failed to create review')
    }
  }
}
